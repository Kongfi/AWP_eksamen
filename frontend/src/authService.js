class AuthService {
    constructor(auth_api_url) {
        this.auth_api_url = auth_api_url;
    }

    async login(username, password) {
        const res = await this.fetch(this.auth_api_url, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        });
        let json = await res.json();
        if ([401, 404].includes(parseInt(res.status))) {
            throw Error(json.msg);
        }
        this.setToken(json.token);
        this.setUsername(username);
        return json;
    }

    loggedIn() {
        var token = this.getToken();
        return token !== null;
    }

    setToken(token) {
        localStorage.setItem("token", token);
    }

    setUsername(username) {
        localStorage.setItem("username", username);
    }

    getUsername() {
        return localStorage.getItem("username");
    }

    getToken() {
        return localStorage.getItem("token");
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    }

    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        });
    }
}

export default AuthService;