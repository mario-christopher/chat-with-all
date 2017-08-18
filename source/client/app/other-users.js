import React from 'react';

import { trim } from '../funcs';

export class OtherUsers extends React.Component {

    render = () => {
        let others = this.props.others;
        let userName = (this.props.user ? this.props.user.name : '');

        return (
            <div className='others scroll-div'>
                <ul className="list-group">
                    <li className="list-group-item list-group-item-success"><b>Others in this chat</b></li>
                    {others &&
                        others.map(other => <li key={other}
                            className={`list-group-item ${userName == other ? 'current-user' : ''}`}>{trim(other, 18)}</li>)
                    }
                </ul>
            </div>
        );
    }
}