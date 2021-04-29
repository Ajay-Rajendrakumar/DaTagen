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
import { Multiselect } from 'multiselect-react-dropdown';
class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notepad:false,
            formdata:{
               "note":""
            },
            options: [
                {key: 'Scale', id: 1},
                {key: 'Rotate', id: 2},
                {key: 'Translate', id: 3},
                {key: 'Shear', id: 4},
                {key: 'Reflection', id: 5},
                {key: 'Color', id: 6},
                {key: 'Blur', id: 7},
                {key: 'Bright', id: 8},
            
            
            ],
            generateOptions:[],
            selectedFile:"",
            dataSet:true,
            imgInfo:true,
            selectComp:true,
            contourComp:false,
            selectedData:[],
            imgCount:"10",
        }
    }
    componentDidMount(){
    this.getset(this.props.curImage)
     console.log(this.props.curImage)
     
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.curImage !== this.props.curImage) {
            this.getset(this.props.curImage)
            this.setState({selectedData:[],contourList:[]})
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
        fd.append("count",this.state.imgCount)
        fd.append("options",this.state.generateOptions)
        this.setState({generateloading:true})
        this.props.distributer(fd,"generateDataset").then(response => {
             if(response.status===200){ 
                let data=response['data']
                this.setState({DataList:[]})
                this.getset(this.props.curImage)
                this.setState({generateloading:false,generateModel:false,generateOptions:[]})
                
                console.log(data)

            }else{                
              this.toasterHandler("error", "Cant reach the server")
              this.setState({generateloading:false})
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
            this.setState({generateloading:false})
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
        
            let { imgCount } = { ...this.state }
            console.log(imgCount,e.target.value)
            imgCount= e.target.value       
            this.setState({ imgCount })
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
            fd.append("option",this.state.contourOption)
            let ids=[]
            file.forEach(element => {
                    ids.push(element['id'])    
            });
            fd.append("imgId",ids)
            this.setState({testloading:true,contourList:[]})
        this.props.distributer(fd,"testImage").then(response => {
             if(response.status===200){ 
                let data=response['data']
                console.log(response['data'])
                this.setState({contourList:data,contourComp:true,dataSet:false,imgInfo:false,generateTestModel:false})
            this.setState({testloading:false})

            }else{                
              this.toasterHandler("error", "Cant reach the server")
            this.setState({testloading:false})
                
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
            this.setState({testloading:false})
            
        })
        }
        zip=(file)=>{
            let {curImage,logUser}={...this.props}
            let fd = new FormData()
            fd.append("orgName",curImage.image)
            fd.append("orgId",curImage.id)
            fd.append("user",logUser)
            fd.append("reciever",this.state.reciever)
            let ids=[]
            file.forEach(element => {
                    ids.push(element['id'])    
            });
            fd.append("imgId",ids)
            this.setState({ziploading:false})
            
        this.props.distributer(fd,"sendzip").then(response => {
             if(response.status===200){ 
                let data=response['data']
                this.setState({zipMail:!this.state.zipMail})
                this.toasterHandler("success", "Mail Sent Successfully")
                this.setState({ziploading:false})

            }else{                
              this.toasterHandler("error", "Cant reach the server")
            this.setState({ziploading:false})
                
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
            this.setState({ziploading:false})
            
        })
        }
        onSelect(selectedList, selectedItem) {
            console.log(selectedItem)
            let { generateOptions } = { ...this.state }
            generateOptions.push(selectedItem.key)     
            this.setState({ generateOptions })
        }
        
        onRemove(selectedList, removedItem) {
            let { generateOptions } = { ...this.state }
            let ind=generateOptions.indexOf(removedItem.key)
            generateOptions.slice(ind,1)     
            this.setState({ generateOptions })
        }
    
    render() {
        let {DataList,dataSet,generateModel,imgInfo,selectComp,contourOption,generateTestModel,selectedData,contourList,contourComp,imgCount,zipMail,reciever,generateloading,testloading,ziploading}={...this.state}
        let {curImage}={...this.props}
        return (
            <div className="row imageComponent border ">

                  <div className="iconbar  border text-center d-flex align-items-center">
                            <span className="m-1"><i className={"fa fa-info-circle  fa-2x c-pointer "+(!dataSet?" text-danger":" text-primary")} onClick={e=>this.setState({dataSet:!dataSet,contourComp:false})}></i></span>
                            <span className="m-1"><i className={"fa fa-file-image-o  fa-2x c-pointer "+(!imgInfo?"text-danger":"text-primary")} onClick={e=>this.setState({imgInfo:!imgInfo,contourComp:false})}></i></span>
                            <span className="m-1"><i className={"fa fa-table  fa-2x c-pointer "+(!selectComp?"text-danger":"text-primary")} onClick={e=>this.setState({selectComp:!selectComp})}></i></span>
                            <span className="m-1"><i className={"fa fa-user-circle  fa-2x c-pointer "+(!contourComp?"text-danger":"text-primary")} onClick={e=>this.setState({contourComp:!contourComp,dataSet:false,imgInfo:false})}></i></span>
                        
                  </div>
                {dataSet && <div className="col-2  uploadImage ">
                        <div className=" p-1">{curImage && <img className="showImage col-12 m-2 " src={pythonUrl+'/originalImage/'+curImage['image']}></img>}</div>
                        
                        <div className="imgText">
                                {curImage && <div className=" row h6 font-weight-bold  text-center border">
                                    <div className="col-12 ">
                                        <td className="text-primary">Name</td><td>:</td><td className=" p-1 overflow-auto">{curImage['image'].split('.')[0]}</td>
                                    </div>
                                    <div className="col-12">
                                        <td className="text-primary">Creator</td><td>:</td><td className=" p-1">{curImage['creator']}</td>
                                    </div>
                                    <div className=" col-12">
                                        <td className="text-primary">Date</td><td>:</td><td className=" p-1">{curImage['date']+" "+curImage['time']}</td>
                                    </div>
                                    <div className=" col-12 row text-center m-2">
                                    <button disabled={generateloading} className={"col-9 c-pointer font-weight-bold btn btn-primary text-center "} onClick={e=>(this.setState({generateModel:true}))} >
                                          Generate Data
                                    </button>
                                   
                                    </div>
                                </div>}

                        </div>
                </div>}
                {imgInfo && <div className="col-3 imageDisplay border ">
                {DataList &&  <>
                        <div className="text-center col-12 text-secondary font-weight-bold h3 mt-n4">Dataset</div>
                    <hr></hr>
                {DataList.map((img,val)=>
                        <span key={val}>
                            
                        <span>{val+1}</span> 
                        <img className={"dataImg col-12 m-1 c-pointer"+(selectedData && selectedData.includes(img)?" imgSucborder":"")} src={pythonUrl+'/generateDataset/'+curImage['image']+':'+img['image']} onClick={e=>this.selectImage(img)}></img>
                        <hr></hr>
                        </span>
                )}</>}
                </div>}
                {selectComp && <div className="row col-5  selectComp border">
               { selectedData &&
                <><div className="text-center col-7 text-secondary font-weight-bold h3 ">Selected:</div>
               </>}
               {selectedData && curImage && 
                        <div className=" btnRow ">
                        <button className=" text-center text-light font-weight-bold btn btn-info " disabled={testloading} onClick={e=>this.setState({generateTestModel:true})}>
                        {!testloading?"Test Detection":
                        <div class="spinner-border text-light" role="status">
                        <span class="visually-hidden"></span>
                        </div>}</button>
                        <button className="ml-3 text-center text-light font-weight-bold btn btn-primary " onClick={e=>this.setState({zipMail:!zipMail})}>Mail</button>
                        </div>
                }
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
                
                            <img   key={val} className="mb-4 selectImg col-4  c-pointer" src={pythonUrl+'/contour/'+img+"?t=" + new Date().getTime()} onClick={e=>console.log(img,val)}></img>
                        
                    )}
                </div>}

                {zipMail && 
                    <div className="zipMail">
                            <div className="zipModel row">
                            <span className="text-light font-weight-bold col-11">Selected Images {"("+(selectedData.length)+")"}</span>
                            <button className="col-1 text-center text-light font-weight-bold btn btn-danger " onClick={e=>this.setState({zipMail:!zipMail})}>Close</button>

                                    <div className="zipContent col-12">
                                    {selectedData && selectedData.map((img,val)=>
                          
                                                <img   key={val} className="mb-4 zipImg col-4  c-pointer" src={pythonUrl+'/generateDataset/'+curImage['image']+':'+img['image']} onClick={e=>this.removeImg(img)}></img>
                                                
                                        )}
                                    </div>
                               
                                    <div className="zipInput row col-12">
                                            
                                            <div className="col-11 text-center"><input placeholder="Recievers:samp@gmail.com,samp2.gmail.com" type="text" className="form-control" name="email" onChange={e=>this.setState({reciever:e.target.value})} value={reciever}></input></div>
                                            <div className="col-1 text-center"><button className="btn btn-success" disabled={ziploading} onClick={e=>this.zip(selectedData)}> {!ziploading?"Send Mail":
                                            <div class="spinner-border text-light" role="status">
                                            <span class="visually-hidden"></span>
                                            </div>}</button></div>
                                       
                                    </div>
                            
                            
                            
                            </div>
                    </div>

                }
                {generateModel && 
                    <div className="zipMail row text-center justify-content-center">
                           <div className="card inputCard col-5">
                                        <div className="row text-center"><span className="h4 col-10 text-primary font-weight-bold">Filter</span><span className="col-2"><i className={"fa fa-close  fa-lg c-pointer text-danger"} onClick={e=>this.setState({generateModel:false})} ></i></span></div>
                                        <hr></hr>
                                        <div className="row mb-2">
                                        <div className="col-5">Image Count</div>
                                            <div className="col-5">
                                            <select className="form-control" value={imgCount} onChange={e=>this.handleChange(e)}>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option  value="50">50</option>
                                            </select>
                                        </div>
                                        </div>
                                        <div className="row mb-5">
                                        <div className="col-5">Filter Options</div>
                                            <div className="col-5">
                                                <Multiselect
                                                    options={this.state.options} 
                                                    selectedValues={this.state.selectedValue}
                                                    onSelect={(a,b)=>this.onSelect(a,b)} 
                                                    onRemove={(a,b)=>this.onRemove(a,b)}
                                                    displayValue="key" 
                                                >
                                                </Multiselect>
                                            </div>
                                        </div>
                                         
                                        <button disabled={generateloading} className={" c-pointer font-weight-bold btn btn-primary text-center "} onClick={e=>(this.generateSet(curImage))} >
                                            {!generateloading?
                                            <span>{"Generate DataSet"}</span>
                                            :
                                            <div class="spinner-border text-light" role="status">
                                            <span class="visually-hidden"></span>
                                            </div>}
                                        </button>
                            
                            </div>
                        </div>
             

                }
                {generateTestModel && 
                    <div className="zipMail row text-center justify-content-center">
                           <div className="card inputCard col-5">
                                        <div className="row text-center"><span className="h4 col-10 text-primary font-weight-bold">Detection Filter</span><span className="col-2"><i className={"fa fa-close  fa-lg c-pointer text-danger"} onClick={e=>this.setState({generateTestModel:false})} ></i></span></div>
                                        <hr></hr>
                                        
                                        <div className="row mb-5">
                                        <div className="col-5">Detection Option</div>
                                            <div className="col-5">
                                            <select className="form-control" value={contourOption} onChange={e=>this.setState({contourOption:e.target.value})}>
                                                <option value="10">Face</option>
                                                <option value="20">Contour</option>
                                                <option  value="50">Both</option>
                                            </select>
                                        </div>
                                        </div>
                                       
                                         
                                        <button className=" text-center text-light font-weight-bold btn btn-info " disabled={testloading} onClick={e=>this.test(selectedData)}>
                                        {!testloading?"Test Detection":
                                        <div class="spinner-border text-light" role="status">
                                        <span class="visually-hidden"></span>
                                        </div>}</button>
                            
                            </div>
                        </div>
             

                }
       
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