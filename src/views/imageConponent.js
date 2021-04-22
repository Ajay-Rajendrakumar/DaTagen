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
            dataSet:true,
            imgInfo:true,
            selectComp:true,
            contourComp:false,
            selectedData:[],
        }
    }
    componentDidMount(){
    this.getset(this.props.curImage)
     console.log(this.props.curImage)
     
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.curImage !== this.props.curImage) {
            this.getset(this.props.curImage)
     }

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

      generateSet=(curImage)=>{
        let fd = new FormData()
        fd.append("imgname",curImage.image)
        fd.append("imgid",curImage.id)
        this.props.distributer(fd,"generateDataset").then(response => {
             if(response.status===200){ 
                let data=response['data']
                this.setState({DataList:[]})
                this.getset(this.props.curImage)
               
                console.log(data)

            }else{                
              this.toasterHandler("error", "Cant reach the server")
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
          })
      }
      getset=(curImage)=>{
        let fd = new FormData()
        if(curImage){
        fd.append("imgname",curImage.image)
        fd.append("imgid",curImage.id)
        this.props.distributer(fd,"getDataset").then(response => {
             if(response.status===200){ 
                let data=response['data']
                this.setState({DataList:data})
                console.log(data)

            }else{                
              this.toasterHandler("error", "Cant reach the server")
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
          })
        }
      }
        
        handleChange=(e)=>{
        
            let { formdata } = { ...this.state }
            formdata[e.target.name] = e.target.value       
            this.setState({ formdata })
        }
        selectImage=(img)=>{
            let{selectedData}={...this.state}
            if(!selectedData.includes(img)){
                selectedData.push(img)
            }
            this.setState({selectedData})
        }
        removeImg=(img)=>{
            let{selectedData,contourList}={...this.state}
            if(selectedData.includes(img)){
                let ind=selectedData.indexOf(img)
                let val=selectedData.splice(ind,1)
                console.log(val)
                if(contourList){
                        contourList.splice(ind,1)

                }
            }
            this.setState({selectedData,contourList})
        }

        test=(file)=>{
            let {curImage}={...this.props}
            let fd = new FormData()
            fd.append("orgName",curImage.image)
            fd.append("orgId",curImage.id)
            let ids=[]
            file.forEach(element => {
                    ids.push(element['id'])    
            });
            fd.append("imgId",ids)
            
        this.props.distributer(fd,"testImage").then(response => {
             if(response.status===200){ 
                let data=response['data']
                console.log(response['data'])
                this.setState({contourList:data,contourComp:true,dataSet:false,imgInfo:false})

            }else{                
              this.toasterHandler("error", "Cant reach the server")
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
          })
        }
    
    render() {
        let {DataList,dataSet,imgInfo,selectComp,selectedData,contourList,contourComp}={...this.state}
        let {curImage}={...this.props}
        return (
            <div className="row imageComponent border ">

                  <div className="iconbar  border text-center d-flex align-items-center">
                            <span className="m-1"><i className={"fa fa-info-circle  fa-2x c-pointer "+(!dataSet?" text-danger":" text-primary")} onClick={e=>this.setState({dataSet:!dataSet,contourComp:false})}></i></span>
                            <span className="m-1"><i className={"fa fa-file-image-o  fa-2x c-pointer "+(!imgInfo?"text-danger":"text-primary")} onClick={e=>this.setState({imgInfo:!imgInfo,contourComp:false})}></i></span>
                            <span className="m-1"><i className={"fa fa-table  fa-2x c-pointer "+(!selectComp?"text-danger":"text-primary")} onClick={e=>this.setState({selectComp:!selectComp})}></i></span>
                            <span className="m-1"><i className={"fa fa-user-circle  fa-2x c-pointer "+(!contourComp?"text-danger":"text-primary")} onClick={e=>this.setState({contourComp:!contourComp,dataSet:false,imgInfo:false})}></i></span>
                        
                  </div>
                {dataSet && <div className="col-2  uploadImage border">
                        <div className="uploadImage p-1">{curImage && <img className="col-12 m-2" src={pythonUrl+'/originalImage/'+curImage['image']}></img>}</div>
                        
                        <div className="imgText">
                                {curImage && <div className=" row h6 font-weight-bold p-2 text-center border ">
                                    <div className="col-12 ">
                                        <td className="text-primary">Name</td><td>:</td><td className=" p-1">{curImage['image'].split('.')[0]}</td>
                                    </div>
                                    <div className="col-12">
                                        <td className="text-primary">Creator</td><td>:</td><td className=" p-1">{curImage['creator']}</td>
                                    </div>
                                    <div className=" col-12">
                                        <td className="text-primary">Date</td><td>:</td><td className=" p-1">{curImage['date']+" "+curImage['time']}</td>
                                    </div>
                                    <div className=" col-12 text-center m-2">
                                        <button className={" c-pointer font-weight-bold btn btn-primary"} onClick={e=>(this.generateSet(curImage))} >
                                        <span>{"Generate DataSet"}</span>
                                        </button>
                                    </div>
                                </div>}

                        </div>
                </div>}
                {imgInfo && <div className="col-3 imageDisplay ">
                {DataList &&  <>
                        <div className="text-center col-12 text-secondary font-weight-bold h3 mt-n4">Dataset</div>
                    <hr></hr>
                {DataList.map((img,val)=>
                        <span key={val}>
                        <img className={"dataImg col-12 m-1 c-pointer"+(selectedData && selectedData.includes(img)?" imgSucborder":"")} src={pythonUrl+'/generateDataset/'+curImage['image']+':'+img['image']} onClick={e=>this.selectImage(img)}></img>
                        <hr></hr>
                        </span>
                )}</>}
                </div>}
                {selectComp && <div className="row col-5  selectComp border">
               { selectedData &&
                <><div className="text-center col-7 text-secondary font-weight-bold h3 ">Selected:</div>
               </>}
               {selectedData && curImage && <button className="testbtn text-center text-light font-weight-bold btn btn-primary " onClick={e=>this.test(selectedData)}>Test Detection</button>}
                    <hr className="col-12"></hr>
                {selectedData && selectedData.map((img,val)=>
            
                        <img   key={val} className="mb-4 selectImg col-4  c-pointer" src={pythonUrl+'/generateDataset/'+curImage['image']+':'+img['image']} onClick={e=>this.removeImg(img)}></img>
                    
                )}
                </div>}
                {contourComp && <div className="row col-5  selectComp border">
                { contourList &&
                <><div className="text-center col-7 text-secondary font-weight-bold h3 ">Detection:</div>
               </>}
               <hr className="col-12"></hr>
                   {contourList && contourList.map((img,val)=>
                
                            <img   key={val} className="mb-4 selectImg col-4  c-pointer" src={pythonUrl+'/contour/'+img} onClick={e=>console.log(img,val)}></img>
                        
                    )}
                </div>}
       
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