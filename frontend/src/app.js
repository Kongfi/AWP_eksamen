import React, {Component} from 'react';
import './app.css';
import { Router, Link } from "@reach/router";
import MakeSuggestion from './makeSuggestion';
import Suggestion from './suggestion';
import Suggestions from './suggestions';
import Login from './login';
import AuthService from './authService';

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            suggestions: [],
            error: ''
        };
    }

    componentDidMount() {
        this.getSuggestions()
            .then(() => console.log("Suggestions received"));
    }

    async login(username, password) {
        try {
            await this.Auth.login(username, password);
            window.location.reload()
        } catch (e) {
            console.log("Login", e);
            this.setState({
                error: e.toString()
            })
        }
    }

    async logout(event) {
        try {
            await this.Auth.logout();
            window.location.reload()
        } catch (e) {
            console.log("Logout", e);
        }
    }

    async getSuggestions() {
        let url = `${this.API_URL}/suggestions`;
        let data = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.Auth.getToken()}`
            }
        });
        if (data.status > 400) {
            return
        }
        let json = await data.json();
        return this.setState({ suggestions: json});
    }

    submit(title, desc, signatures) {
        let last = this.state.suggestions[this.state.suggestions.length -1]
        const newSuggestion = {
            id: last.id +1,
            title: title,
            suggestion: desc,
            signatures: signatures
        };
        this.setState({
            suggestions: [...this.state.suggestions, newSuggestion]
        });
    }

    getSuggestion(id) {
        return this.state.suggestions.find(s => s._id === id);
    }

    render() {
        return (
            <>
                <nav>
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/make"><li>Make suggestion</li></Link>
                        {this.Auth.loggedIn() ? <button onClick={() => this.logout()}>Logout</button> : <Link to="/login"><li>Login</li></Link>}
                    </ul>
                </nav>
                <Router>
                    <MakeSuggestion path="/make" submit={(title, desc, signatures) => this.submit(title, desc, signatures)} getSuggestions={() => this.getSuggestions()} />
                    <Suggestion path="/suggestion/:id" getSuggestion={(id) => this.getSuggestion(id)} getSuggestions={() => this.getSuggestions()} submitSignature={(signature, id) => this.submitSignature(signature, id)} />
                    <Suggestions path="/" data={this.state.suggestions} />
                    <Login path="/login" login={(username, password) => this.login(username, password)} error={this.state.error}/>
                </Router>
            </>
        )
    }
}

export default App;
