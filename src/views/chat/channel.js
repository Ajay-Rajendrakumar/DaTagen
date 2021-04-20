import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';


export class Channel extends React.Component {

    click = () => {
        this.props.onClick(this.props.id,this.props.name);
    }

    render() {
        return (
                <Card className='channel-item m-2' onClick={this.click}>              
                    <div>
                    <span className="text-info">
                    <div className="text-success font-weight-bold row pl-4">
                        {this.props.index + ") " + this.props.name} 
                    </div>                
                        <span className="ml-3">Participants:{this.props.participants}</span>
                    </span>
                    </div>
                </Card>
        )
    }
}