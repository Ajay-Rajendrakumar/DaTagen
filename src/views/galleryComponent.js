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
import NotePad from './notePad'
import musicPlayer from './musicPlayer';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notepad:false,
            formdata:{
               "note":""
            },
            selectedFile:"",
            result_data:[],
            result_collection:[],
        }
    }
    componentDidMount(){
    
        this.loadGallery()
     
    }
    loadGallery=()=>{
        let fd = new FormData()
        this.props.distributer(fd,"galleryList").then(response => {
            if(response.status===200){ 
             let data=response['data']
                this.setState({galleryList:data})
                console.log(data)
           }else{                
             this.toasterHandler("error", "Cant reach the server")
           }
         }).catch((err)=>{
           this.toasterHandler("error", err)
         })
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
    
    render() {
        let {galleryList}={...this.state}
        return (
            <div className="galleryComponent">
                {galleryList && galleryList.map((img,val)=>
                        <img className="imgSize" src={pythonUrl+'/image/'+img} onClick={e=>this.props.handleImage(img)}></img>
                )}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Image));