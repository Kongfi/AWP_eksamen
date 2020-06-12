import React, {Component} from 'react';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    handleLogin(event) {
        event.preventDefault();
        console.log("login", this.state.username, this.state.password);
        this.props.login(this.state.username, this.state.password);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <>
                <label>{this.props.error}</label>
                <h3>Login</h3>
                <form onSubmit={event => this.handleLogin(event)}>
                    <input
                        onChange={event => this.handleChange(event)}
                        name="username" type="text" placeholder="username"></input><br/>
                    <input
                        onChange={event => this.handleChange(event)}
                        name="password" type="password" placeholder="password"></input><br/>
                    <button type="submit">Login</button>
                </form>
            </>
        );
    }
}

export default Login;