import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../assets/css/login.css"
import { Button, Form, FormGroup, Label } from 'reactstrap';
import { ReactMultiEmail, isEmail } from 'react-multi-email'
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

class Reminder extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
            formdata:{
               "note":"",
               "date":"",
            },
            addMode:false,
        }
    }
    componentDidMount(){
    
       this.noteList()
     
    }
    noteList=()=>{
        let fd = new FormData()
        this.props.distributer(fd,"reminderList").then(response => {
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
            this.props.distributer(fd,'updateReminder').then(response => {
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
            fd.append("reminder",formdata['note'])
            fd.append("date",formdata['date'].split('T')[0])
            fd.append("time",formdata['date'].split('T')[1])
            fd.append("mail",formdata['mail'])
            this.props.distributer(fd,'addReminder').then(response => {
                 if(response.status===200){ 
                    this.noteList()
                    formdata['note']=""
                    formdata['date']=""
                    this.setState({formdata,addMode:false})
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
        let {noteList,formdata,addMode,emails}={...this.state}
        return (
            <div className="notePadContainer">
                <Card className="notePadBody">
                    <div className="row">
                        <CardTitle className="col-9 h1 m-1 text-primary font-weight-bold ">Reminder</CardTitle>
                        {addMode  && <span className="m-1"><button className={"btn btn-success mt-2"} onClick={e=>this.AddNote()}>Save</button></span>}  
                                              <span className="m-1"><button className={addMode?"btn btn-danger mt-2":"btn mt-2 btn-primary"} onClick={e=>this.setState({addMode:!addMode})}>{!addMode? "Add Reminder":"Cancel"}</button></span>
                        <span className=""><i className="c-pointer fa fa-2x m-3 fa-times-circle text-danger" aria-hidden="true" onClick={e=>this.props.onClose()}></i></span>
                    </div>
                    <hr className="bg-info"></hr>
                    <CardBody className="noteBody">
                        {!addMode?
                        
                            noteList && noteList.map((key,id)=>
                             <Card key={id} className={key['status']==="pending"?" m-1 border-warning":" m-1 border-success"}>
                                 <CardBody className="row m-1">
                                        <div className="col-4">{id+1 + ") "}{key['reminder']} </div>
                                        <div className="col-3">{key['status'][0].toUpperCase() + key['status'].slice(1)}{key['status']==="pending"?<i className="fa fa-exclamation-circle text-warning m-1" aria-hidden="true"></i>:<i className="fa fa-check-circle text-success m-1" aria-hidden="true"></i>}</div>
                                        <div className="col-2">{key['date']}</div>
                                        <div className="col-2">{key['time']}</div>
                                        {
                                          
                                               <div className="col-1 text-center"><i className="c-pointer fa  fa-trash text-danger" aria-hidden="true" onClick={e=>this.updateNote('delete',key)}></i></div>
                                        }
                               </CardBody>
                              
                             </Card>
                        )
                        :
                        <div>
                             <Form> 
                            <FormGroup>
                                <Label for={"reminder"}>Reminder</Label>
                                <Input  type="text" name="note" value={formdata['note']} onChange={e=>this.handleChange(e)}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={"date"}>Date</Label>
                                <Input  type="datetime-local" name="date" value={formdata['date']}onChange={e=>this.handleChange(e)}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={"date"}>Mail</Label>
                                <Input  type="text" name="mail" value={formdata['mail']} onChange={e=>this.handleChange(e)}/>

                           </FormGroup>
                           

            </Form>
                        </div>
                            

                        }
                         <div>
                                     
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reminder));