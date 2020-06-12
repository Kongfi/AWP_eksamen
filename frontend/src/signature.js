import React, {Component} from 'react';
import AuthService from './authService';

class Signature extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            username: localStorage.getItem("username"),
            error: ''
        }
    }

    onChange(event) {
        this.setState({
            id: this.props.data,
            [event.target.name]: event.target.value
        })
    }

    async onSubmit() {
        if (this.state.signature === this.state.username){
            let data = await fetch(`${this.API_URL}/suggestions/${this.state.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.Auth.getToken()}`
                },
                method: 'PUT',
                mode: 'cors',
                body: JSON.stringify({
                    id: this.state.id,
                    signature: this.state.signature,
                    username: this.state.username
                })
            });
            this.props.getSuggestions();
            if (data.status === 409) {
                this.setState({
                    error: 'User already signed.'
                })
            } else {
                this.setState({
                    error: ''
                })
            }
        } else {
            this.setState({
                error: 'The signature must match the username.'
            })
        }
    }

    render() {
        return(
            <>
                <label>{this.state.error}</label>
                <input
                    placeholder="Write your usename here"
                    autoComplete="off"
                    name="signature"
                    onChange={event => this.onChange(event)}
                    type="text"
                />
                <button onClick={_ => this.onSubmit()}>Sign suggestion</button>
            </>
        )
    }
}

export default Signature;