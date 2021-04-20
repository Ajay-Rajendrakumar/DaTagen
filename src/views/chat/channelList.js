import React from 'react';
import { Channel } from './channel.js';

export class ChannelList extends React.Component {

    handleClick = (id,name) => {
        this.props.onSelectChannel(id,name);
    }

    render() {

        let list = <div className="no-content-message">There is no channels to show</div>;
        if (this.props.channels && this.props.channels.map) {
            list = this.props.channels.map((c,ind) => <Channel index={ind+1} key={c.id} id={c.id} name={c.name} participants={c.participants} onClick={this.handleClick} />);
        }
        return (
            <div className='channel-listComponent p-2'>
                {list}
            </div>);
    }

}