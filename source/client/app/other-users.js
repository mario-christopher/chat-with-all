import React from 'react';

import { trim } from '../funcs';

export class OtherUsers extends React.Component {

    render = () => {
        let others = this.props.others;

        return (
            <div className='others scroll-div'>
                <ul className="list-group">
                    <li className="list-group-item list-group-item-success"><b>Others in this chat</b></li>
                    {others &&
                        others.map(other => <li key={other.socketId}
                            className="list-group-item">{trim(other.userName, 18)}</li>)
                    }
                </ul>
            </div>
        );
    }
}