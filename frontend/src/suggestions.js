import React, {Component} from 'react';
import { Link } from "@reach/router";

class Suggestions extends Component {
    render() {
        let suggestions = this.props.data ?? [];
        const list = suggestions
            .sort((a, b) => (a.signatures.length > b.signatures.length) ? -1 : 1)
            .map(d =>
            <li key={d._id}>
                <Link to={`/suggestion/${d._id}`}>
                    <p>{d.title}</p>
                    <p>{d.signatures.length} signatures</p>
                </Link>
            </li>
        );

        return (
            <>
                <h3>All suggestions</h3>
                <ul>
                    {list}
                </ul>
            </>
        );
    }
}

export default Suggestions