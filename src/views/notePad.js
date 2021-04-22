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

class Music extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
            formdata:{
               "note":""
            },
            selectedFile:"",
            result_data:[],
            result_collection:[],
        }
    }
    componentDidMount(){
    
       this.noteList()
     
    }
    noteList=()=>{
        let fd = new FormData()
        this.props.distributer(fd,"noteList").then(response => {
            if(response.status===200){ 
             let data=response['data']
                this.setState({noteList:data})
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

      
        updateNote=(type,row)=>{
            let {  } = { ...this.state }
            let fd = new FormData()
            fd.append("type",type)
            fd.append("id",row['id'])
            if(type==="status"){
                fd.append('status','completed')
            }else{
                fd.append('delete','1')
            }  
            this.props.distributer(fd,'updateNote').then(response => {
                 if(response.status===200){ 
                    this.noteList()
                }else{                
                  this.toasterHandler("error", "Cant reach the server")
                }
              }).catch((err)=>{
                this.toasterHandler("error", err)
              })

        }
        AddNote=()=>{
            let {formdata  } = { ...this.state }
            let fd = new FormData()
            fd.append("note",formdata['note'])
            
            this.props.distributer(fd,'addNote').then(response => {
                 if(response.status===200){ 
                    this.noteList()
                    formdata['note']=""
                    this.setState({formdata})
                }else{                
                  this.toasterHandler("error", "Cant reach the server")
                }
              }).catch((err)=>{
                this.toasterHandler("error", err)
              })

        }
        handleChange=(e)=>{
        
            let { formdata } = { ...this.state }
            formdata[e.target.name] = e.target.value       
            this.setState({ formdata })
        }
    
    render() {
        let {noteList,formdata}={...this.state}
        return (
            <div className="notePadContainer">
                <Card className="notePadBody">
                    <div className="row">
                        <CardTitle className="col-11 h1 m-1 text-primary font-weight-bold ">Notes</CardTitle>
                        <span className=""><i className="c-pointer fa fa-2x m-3 fa-times-circle text-danger" aria-hidden="true" onClick={e=>this.props.onClose()}></i></span>
                    </div>
                    <hr className="bg-info"></hr>
                    <CardBody className="noteBody">
                        {noteList && noteList.map((key,id)=>
                             <Card key={id} className={key['status']==="pending"?" m-1 border-warning":" m-1 border-success"}>
                                 <CardBody className="row m-1">
                                        <div className="col-4">{id+1 + ") "}{key['note']} </div>
                                        <div className="col-3">{key['status'][0].toUpperCase() + key['status'].slice(1)}{key['status']==="pending"?<i className="fa fa-exclamation-circle text-warning m-1" aria-hidden="true"></i>:<i className="fa fa-check-circle text-success m-1" aria-hidden="true"></i>}</div>
                                        <div className="col-2">{key['date'].split('|')[0]}</div>
                                        <div className="col-2">{key['date'].split('|')[1]}</div>
                                        {
                                           key['status']==="pending"?
                                            <div className="col-1 text-center "><Input type="checkbox" className="c-pointer m-1" onClick={e=>this.updateNote('status',key)}></Input></div>
                                            :
                                            <div className="col-1 text-center"><i className="c-pointer fa  fa-trash text-danger" aria-hidden="true" onClick={e=>this.updateNote('delete',key)}></i></div>
                                        }
                               </CardBody>
                              
                             </Card>
                        )
                            

                        }
                         <div>
                                        <div className="row col-8 float_Bottom">
                                            <div className="col-9 text-center"><input type="text" className="form-control" name="note" onChange={e=>this.handleChange(e)} value={formdata['note']}></input></div>
                                            <div className="col-2 text-center"><button className="btn btn-primary" onClick={e=>this.AddNote()}>Add</button></div>
                                        </div>
                               </div>

                    </CardBody>
                </Card>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Music));