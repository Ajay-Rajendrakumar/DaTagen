import React from 'react';
import moment from 'moment'

export class Message extends React.Component {

    render() {
        return (
            <div className='message-item card m-1 p-1 row'>
                <div className="row">
                           <div className="col-12 row">
                            <span className={"message-name font-weight-bold col-9 ml-3"+(this.props.senderName===this.props.Senderid?" text-danger":" text-primary ")}>{this.props.senderName===this.props.Senderid? " You":this.props.user}</span> 
                           <span className="message-time text-dark floatRight ">{moment().format('LT')}</span> 
                           </div>     
                           <div className="col-12 row mt-n1">          
                            <span className={"message-body font-weight-bold col-12 text-dark"+(this.props.senderName===this.props.Senderid? " floatRight":" ml-3")}>{this.props.text}</span> 
                           </div>
                </div>
            </div>
        )
    }
}