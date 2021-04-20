import * as types from './types';
import { pythonUrl } from '../../config';
import Axios from 'axios';

let api={
  "musicList":"musicList",
  "getSong":"getSong",
  "uploadSong":"uploadSong",
  "createUser":"createUser",
  "loginUser":"loginUser",
  "addNote":"addNote",
  "updateNote":"updateNote"
}
 


export const distributer = (data,apiName) => {
  return function action(dispatch) {
   
    let url=urlLoader("Python",apiName)
    console.log(url)
    if(url.includes(undefined)){
      url=pythonUrl+"/"+apiName
      console.log("here")
    }
    console.log(url)

    return Axios.post(url,data).then(res => {
      let response = res['data']
      return response
    }).catch(err => {
      return catchError(dispatch,err)
    })
      
  }
};
function urlLoader(backend,question) {
  let url=""
  if(backend==="Python"){
    url= pythonUrl
  }else  if(backend==="PHP"){
    url= ""
  }else{
    url= ""
  }
  url=url +"/"+ api[question]
  if(backend==="PHP"){
    url=url+".php"
  }
  return url

}


function catchError(dispatch, error) {
  if (error.response) {
    let message = error.response.data
    console.log(error.response, error.response.status);
    error.response.status = error.response.data && error.response.data === "Unauthorized" ? 400 : error.response.status
    return dispatch({ type: types.CATCH_ERROR, payload: { status: error.response.status, message } })
  } else if (error.request) {
    return dispatch({ type: types.CATCH_ERROR, payload: { status: 201, message: error.request } })
  } else {
    console.log('Error', error.message);
    return dispatch({ type: types.CATCH_ERROR, payload: { status: 201, message: error.message } })
  }
}
