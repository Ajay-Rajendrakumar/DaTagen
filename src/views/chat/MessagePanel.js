import React from 'react';
import { Message } from './Message';

export class MessagesPanel extends React.Component {
    state = { input_value: '' }
    send = () => {
        if (this.state.input_value && this.state.input_value != '') {
            this.props.onSendMessage(this.props.channel.id, this.state.input_value);
            this.setState({ input_value: '' });
        }
    }

    handleInput = e => {
        this.setState({ input_value: e.target.value });
    }

    render() {

        let list = <div className="no-content-message">There is no messages to show</div>;
        if (this.props.channel && this.props.channel.messages) {
            list = this.props.channel.messages.map(m => <Message Senderid={this.props.id} key={m.id} id={m.id} senderName={m.senderName} user={m.user.name} text={m.text} message={m}/>);
        }
        return (
            <div className='messages-panel'>
                <div className="meesages-list p-1">{list}</div>
                {this.props.channel &&
                    <div className="messages-input row ml-0 ">
                        <input  className="col-8 form-control m-1" type="text" onChange={this.handleInput} value={this.state.input_value} />
                       
                        <button className="btn btn-sm btn-primary col-3 m-1" onClick={this.send}>Send</button>
                    </div>
                }
            </div>);
    }

}