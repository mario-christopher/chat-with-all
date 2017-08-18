import React from 'react';

export class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: '' };
    }

    componentWillReceiveProps = (nextProps) => {
        let userName = (nextProps.user && nextProps.user.name ? nextProps.user.name : '');
        this.setState({ value: userName });
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    onJoinChatClicked = () => {
        if (this.inp.value.length > 0) {
            this.props.joinChat(this.inp.value);
        }
    }

    onLeaveChatClicked = () => {
        this.props.leaveChat();
    }

    render = () => {
        let user = this.props.user;

        return (
            <div className='_row'>
                <input autoFocus
                    ref={inp => { this.inp = inp; }}
                    disabled={user.joined} className='form-control _spc'
                    placeholder='Enter your chat user name'
                    maxLength='50'
                    value={this.state.value}
                    onChange={this.handleChange} />
                {!user.joined ?
                    <button className='btn _spc btn-success' onClick={this.onJoinChatClicked} >Join Chat</button>
                    :
                    <button className='btn _spc btn-warning' onClick={this.onLeaveChatClicked} >Leave Chat</button>
                }
            </div>
        );
    }
}