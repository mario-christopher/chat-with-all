import React from 'react';

export class OtherUsers extends React.Component {

    render = () => {
        let others = this.props.others;

        return (
            <div className='_row'>
                <span className='_spc-right'>Others :</span>
                {others &&
                    others.map(other => <span className='_spc-right' key={other.socketId}>{other.userName},</span>)
                }
            </div>
        );
    }
}