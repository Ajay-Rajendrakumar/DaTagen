import React,{Component} from 'react';
import { ChannelList } from './channelList.js';
import { MessagesPanel } from './MessagePanel.js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import socketClient from "socket.io-client";
const SERVER = "http://127.0.0.1:8080";
class Chat extends Component {
    state = {
        channels: null,
        socket: null,
        channel: null,
        
    }
    socket;
    componentDidMount() {
        this.setState({user:"Dummy"})
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = socketClient(SERVER);
        socket.on('connection', () => {
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        socket.on('channel', channel => {
            
            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    c.participants = channel.participants;
                }
            });
            this.setState({ channels });
        });
        socket.on('message', message => {
            
            let channels = this.state.channels
            channels.forEach(c => {
                if (c.id === message.channel_id) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                    }
                }
            });
            this.setState({ channels });
        });
        this.socket = socket;
    }

    loadChannels = async () => {
        fetch('http://localhost:8080/getChannels').then(async response => {
            let data = await response.json();
            this.setState({ channels: data.channels });
        })
    }

    handleChannelSelect = (id,name) => {
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });
        this.setState({ channel,currrentChannel:name });
        let obj={
            "id":id,
            "user":this.props.user
        }
        this.setState({userId:this.socket.id})
        this.socket.emit('channel-join',obj, ack => {
            console.log("UserId",ack)
            
        });
    }

    handleSendMessage = (channel_id, text) => {
        let user={
            "name":this.props.user,
        }
        this.socket.emit('send-message', { channel_id, text, senderName: this.socket.id, id: Date.now(),user:user });
    }

    render() {

        return (
            <div className='chat-app'>
                <div className="row "><span className="text-primary font-weight-bold text-warning col-12 h4 text-center">Chat</span></div>
                <div className="row "><span className="text-primary font-weight-bold ml-3 col-4 mb-1">Channel List</span></div>
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                <hr className="bg-light flex"></hr>
                <div className="text-light mt-n2 flex text-center font-weight-bold h6">Channel: {this.state.currrentChannel || '-'}</div>
                <MessagesPanel id={this.socket && this.socket.id} onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
    
    };
}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));
