import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../../assets/css/login.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/login.css'
import { withRouter } from 'react-router-dom';
import * as questionaction from "../../store/actions/questions.action";
import _, { matches, toInteger } from 'lodash';
import moment from 'moment';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType:false,
            formdata:{
                'email':'',
                'pwd':'',
            },
            logged_user:""
          }
    }
    componentDidMount(){
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let { formdata,formType } = { ...this.state }
        let fd = new FormData()
        fd=this.setParameters()
        
        this.props.distributer(fd,!formType?"loginUser":"createUser").then(response => {
            if(response.status===200){ 
             let data=response['data']
           
             if(!formType){
              
                 this.setState({logged_user:data},()=>{
                    console.log(this.state.logged_user)
                    this.props.history.push("/dashboard");
                  })
                 
             }else{
                 this.setState({formType:!formType})
             }
           }else{                
             this.toasterHandler("error", response.message)
           }
         }).catch((err)=>{
           this.toasterHandler("error", err)
         })
    }

    setParameters(){
        let { formdata } = { ...this.state }
        let fd = new FormData()
        let params=['email','pwd']
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
        let {formType}={...this.state}
        return (
             <div className="loginMain-container bg-primary">
        <div className="col-4 loginContainer">
            <div className="text-center m-2"><span className="text-secondary h1">{!formType?"Login":"SignUp"}</span></div>
            <Form> 
                <FormGroup>
                    <Label for={"email"}>Username</Label>
                    <Input  type="text" name="email" onChange={e=>this.handleChange(e)}/>
                </FormGroup>
                <FormGroup>
                    <Label for={"pwd"}>Password</Label>
                    <Input  type="password" name="pwd" onChange={e=>this.handleChange(e)}/>
                </FormGroup>
                <Button
                    size="lg"
                    className="bg-primary border-0"
                    block
                    onClick={this.handleSubmit}>
                    Submit
                </Button>
                <div className="text-center m-2 c-pointer"><span className="text-primary h6" onClick={e=>this.setState({formType:!formType})}>{formType?"Login":"SignUp"}</span></div>
            </Form>
            </div>
        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        logged_user: state.logged_user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        distributer: (data,api) => { return dispatch(questionaction.distributer(data,api)); },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));