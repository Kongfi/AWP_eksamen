import React, {Component} from 'react';
import Signature from "./signature";
import AuthService from './authService';

class Suggestion extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            id: this.props.id
        }
    }

    submit(signature) {
        this.setState({
            signature: signature
        }, () => {
            this.props.submitSignature(this.state.signature, this.state.id);
        });
    }

    render() {
        const id = this.props.id;
        const suggestion = this.props.getSuggestion(id);

        return (
            <>
                <h1>{suggestion?.title}</h1>
                <p>{suggestion?.suggestion}</p>

                <Signature data={this.state.id} getSuggestions={() => this.props.getSuggestions()} />

                <p>Signatures:</p>
                <ul id="signatures">
                    {suggestion?.signatures.map(x => (
                        <li key={x._id}>
                            <p>{x.username} - {new Date(parseInt(x.Date)).toUTCString()}</p>
                        </li>
                    ))}
                </ul>
            </>
        );
    }
}

export default Suggestion;