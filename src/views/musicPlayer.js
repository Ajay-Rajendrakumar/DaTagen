import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../assets/css/login.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
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
               
            },
            selectedFile:"",
            result_data:[],
            result_collection:[],
        }
    }
    componentDidMount(){
       
        this.musicList()
        this.setState({expandMusicPlayer:false,playing:false})
    }
    musicList=()=>{
        let fd = new FormData()
        this.props.distributer(fd,"musicList").then(response => {
            if(response.status===200){ 
             let data=response['data']
                this.setState({musicList:_.sortedUniq(data)})
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

    onFileChange = event => {
        let file=event.target.files[0]
        this.setState({ selectedFile: file, fileName:file.name });
      };

    onFileUpload=e=>{
        let { selectedFile } = { ...this.state }
        let fd = new FormData()
        fd.append("song",selectedFile)
        this.props.distributer(fd,"uploadSong").then(response => {
             if(response.status===200){ 
              let data=response['data']
              this.toasterHandler("success", "Song Added")
              this.setState({selectedFile:"",fileName:""})
              this.musicList()

            }else{                
              this.toasterHandler("error", "Cant reach the server")
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
          })
        }
        play=(song,key)=>{
            let {currentSongSrc,currentPlaying,playing}={...this.state}
            let fd = new FormData()
            if(currentPlaying===song){               
               this.PlayPause()
            } else{
                this.setState({currentSongSrc:""})
            fd.append("song",song)
            this.props.distributer(fd,song).then(response => {
             if(response){ 
                 console.log(response)
              this.setState({currentPlaying:song,currentSongSrc:pythonUrl+"/"+song,playing:true},()=>{
            document.getElementById("musicElement").play()

              })

            }else{                
              this.toasterHandler("error", "Cant reach the server")
            }
          }).catch((err)=>{
            this.toasterHandler("error", err)
          })
            }
        }

        PlayPause=()=>{
            let {playing}={...this.state}

            if(playing){
                document.getElementById("musicElement").pause()
                this.setState({playing:false})
                }else{
                document.getElementById("musicElement").play()   
                this.setState({playing:true})

                }      
        }
    render() {
        let {musicList,selectedFile,fileName,currentPlaying,currentSongSrc,expandMusicPlayer,playing}={...this.state}
        return (
                <div className="">
                 {currentSongSrc && <audio  id="musicElement" controls autoplay hidden >
                    <source src={currentSongSrc} type="audio/mpeg"/>
                </audio>}
            { expandMusicPlayer?
            
            <div className="music-component">
               <div className="row m-1">
                <div className="col-11 d-flex justify-content-center"><span className="font-weight-bold text-white h3">Music</span>
                    {currentSongSrc?
                         playing?
                        <i className="fa fa-pause fa-2x text-white ml-3 mt-1" aria-hidden="true" onClick={e=>this.PlayPause()}></i>:
                        <i className="fa fa-play fa-2x text-white ml-3 mt-1" aria-hidden="true" onClick={e=>this.PlayPause()}></i>
                        :""
                    }
                
                </div>
                    <div className="col-1" ><i className="text-white fa fa-minus-square fa-lg c-pointer" aria-hidden="true" onClick={e=>this.setState({expandMusicPlayer:!expandMusicPlayer})}></i></div>
                </div> 
               

                
                <div className="m-2">
                <div className="music-list overflowScroll noscroll row border border-light ">
                        {musicList && musicList.map((song,key)=>(
                                <div key={key} className={(currentPlaying===song?"text-danger font-weight-bold":"")+ "col-10 card bg-dark c-pointer text-white m-1"} onClick={e=>this.play(song,key)}>
                                        {(key+1) + ")  "+song}
                                    </div>
                        ))
                        }
                </div>
                <div className="row mt-2 d-flex justify-content-center">
                    <input id='selectSong' type="file" onChange={this.onFileChange} hidden/>
                    {fileName && <div className="overflowScroll noscroll  col-lg-8 border border-light">
                        <span className="text-white">{ fileName}</span>
                    </div>}
                    <div className={(selectedFile ? "col-2":"col-4")}>
                        <button className={"font-weight-bold "+ (selectedFile ? " btn btn-success":" btn btn-primary")} onClick={e=>(selectedFile ? this.onFileUpload() : document.getElementById("selectSong").click())}>
                        <span>{selectedFile ? "Upload" :"Add new Song"}</span>
                        </button>
                      
                    </div>
                    {selectedFile &&<div className={(selectedFile ? "col-2":"")}>
                        <button className={"font-weight-bold btn btn-danger"} >
                                 
                                 <i className="fa fa-trash text-white" aria-hidden="true" onClick={e=>this.setState({selectedFile:"",fileName:""})}></i>
                        </button>
                        </div>}
                </div>
                
                </div>
            </div>:""
            }
        
                <i className={"fa fa-music fa-2x "+(playing?" text-danger":" text-white")} aria-hidden="true" onClick={e=>this.setState({expandMusicPlayer:!expandMusicPlayer})}></i>
           
            
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