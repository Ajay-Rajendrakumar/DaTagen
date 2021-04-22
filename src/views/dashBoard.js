import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../assets/css/login.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Card,
    CardBody,
    CardFooter,
    CardTitle,
   Input
  } from "reactstrap";
import '../styles/login.css'
import { withRouter } from 'react-router-dom';
import * as questionaction from "../store/actions/questions.action";
import _, { matches, toInteger } from 'lodash';
import moment from 'moment';
import {pythonUrl} from '../config.js'
import 'react-jinke-music-player/assets/index.css'
import MusicPlayer from './musicPlayer'
import NotePad from './notePad';
import Reminder from './reminders';
import Chat from './chat/Chat.js';
import Gallery from './galleryComponent.js'
import Image from './imageConponent.js'
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notepad:false,
            formdata:{
               "note":""
            },
            music:false,
            chat:false,
            selectedFile:"",
            result_data:[],
            result_collection:[],
        }
    }
    componentDidMount(){
    console.log(this.props.location.state)
     this.setState({logUser:this.props.location.state.logUser && this.props.location.state.logUser.name || "User"})
     
    }
    


    setParameters(qNo){
        let { formdata,all_questions } = { ...this.state }
        let fd = new FormData()
        let params=[]
            params.map((key,id)=>{
                fd.append(key,formdata[key])
            })
        return fd
    }

    toasterHandler = (type, msg) => {
        toast[type](msg, {
            position: toast.POSITION.TOP_RIGHT,
        });
    }

      
 
        
        handleChange=(e)=>{
        
            let { formdata } = { ...this.state }
            formdata[e.target.name] = e.target.value       
            this.setState({ formdata })
        }

        loadImage=(img)=>{
            this.setState({curImage:img})
        }
    
    render() {
        let {curImage,notepad,music,chat,logUser,remider,currentImage}={...this.state}
        return (
            <div className="">
                   {chat &&
                    <Chat user={logUser}/>
                   }
                    
                  
                    {notepad &&
                        <NotePad 
                            onClose={e=>this.setState({notepad:!notepad})}
                        
                        />
                    }
                    {remider &&
                        <Reminder 
                            onClose={e=>this.setState({remider:!remider})}
                        
                        />
                    }
                    <div class="ToolBar d-flex flex-column bd-highlight mb-3">
                        <div class="p-2 bd-highlight icon"><MusicPlayer onClose={e=>this.setState({music:!music})}/></div>
                        <div class="p-2 bd-highlight icon"><i className="fa fa-sticky-note-o fa-2x text-white" aria-hidden="true" onClick={e=>this.setState({notepad:!notepad})}></i></div>
                        <div class="p-2 bd-highlight icon"><i className="fa fa-comments fa-2x text-white" aria-hidden="true" onClick={e=>this.setState({chat:!chat})}></i></div>
                        <div class="p-2 bd-highlight icon"><i className="fa fa-bell fa-2x text-white" aria-hidden="true" onClick={e=>this.setState({remider:!remider})}></i></div>
                    </div>
                    <div>


                        <Gallery handleImage={img=>this.setState({currentImage:img})} user={logUser}/>
                          <Image curImage={currentImage}></Image>      
                
                    </div>
                    {/* <div className="MusicIcon">
                              <i className="fa fa-music fa-2x text-white" aria-hidden="true" onClick={e=>this.setState({music:!music})}></i>
                     </div>
                    <div className="NoteIcon">
                        <i className="fa fa-sticky-note-o fa-2x text-white" aria-hidden="true" onClick={e=>this.setState({notepad:!notepad})}></i>
                    </div>
                    <div className="ChatIcon">
                        <i className="fa fa-comments fa-2x text-white" aria-hidden="true" onClick={e=>this.setState({chat:!chat})}></i>
                    </div> */}
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
        distributer: (data,api) => { return dispatch(questionaction.distributer(data,api)); },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));