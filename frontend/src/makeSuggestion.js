import React, {Component} from 'react';
import AuthService from './authService';

class MakeSuggestion extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            title: "",
            desc: "",
            signatures: []
        }
    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async onSubmit() {
        await fetch(`${this.API_URL}/newSuggestion`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.Auth.getToken()}`
            },
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify({
                title: this.state.title,
                desc: this.state.desc
            })
        });
        this.props.getSuggestions();
    }

    render() {
        return (
            <>
                <input
                    placeholder="Write a title here"
                    name="title"
                    onChange={event => this.onChange(event)}
                    type="text"
                />
                <input
                    placeholder="Write your suggestion here"
                    name="desc"
                    onChange={event => this.onChange(event)}
                    type="text"
                />
                <button onClick={_ => this.onSubmit()}>Make Suggestion</button>
            </>
        );
    }
}

export default MakeSuggestion