const bcrypt = require('bcryptjs');

class Db {
    constructor(mongoose) {
        const suggestionSchema = new mongoose.Schema({
            title: String,
            suggestion: String,
            signatures: [{
                username: String,
                Date: String
            }]
        });

        const loginSchema = new mongoose.Schema({
            username: String,
            password: String
        });

        mongoose.set('useFindAndModify', false);

        this.suggestionModel = mongoose.model('Suggestion', suggestionSchema);
        this.loginModel = mongoose.model('Login', loginSchema);
    }

    async getSuggestions() {
        try {
            return await this.suggestionModel.find({});
        } catch (e) {
            console.error("getSuggestions:", e.message);
            return{};
        }
    }

    async getSuggestion(id) {
        try {
            return await this.suggestionModel.findById(id);
        } catch(e) {
            console.error("getSuggestion:", e.message);
            return {};
        }
    }

    async createSuggestion(title, desc) {
        console.log(title, desc);
        const suggestion = new this.suggestionModel({
            title: title,
            suggestion: desc
        });
        try {
            let saveSuggestion = await suggestion.save();
            console.log("Saved suggestion", saveSuggestion);
        } catch (e) {
            console.error("createSuggestion:", e.message);
            return {};
        }
    }

    async addSignature(id, username) {
        const newSignature = {
            username: username,
            Date: Date.now().toString()
        };
        try {
            await this.suggestionModel.findByIdAndUpdate({
                _id: id
            }, {
                $push: { signatures: newSignature}
            });
            return newSignature;
        } catch (e) {
            console.error("addSignature:", e.message);
            return {};
        }
    }

    async bootstrap(count = 4) {
        const usernames = [
            { username: "lars", password: 'kodeord'},
            { username: "bjørn", password: 'password'},
            { username: "niels", password: 'sneskovl'},
            { username: "lis", password: "sikkerhed"}
        ];

        usernames.forEach(async user => {
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(user.password, 10, function(err, hash) {
                    if (err) reject(err); else resolve(hash);
                });
            });

            user.hash = hashedPassword;
            delete user.password;
        });

        let l = (await this.loginModel.find({})).length;
        if (l === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let user = new this.loginModel({
                    username: usernames[i].username,
                    password: usernames[i].hash
                });
                promises.push(user.save());
            }

            return Promise.all(promises);
        }
    }

    async suggestionData(count = 4) {
        const data = [
            { title: "suggestion title", suggestion: 'suggestion description'},
            { title: "another suggestion", suggestion: 'another suggestion description'},
            { title: "terrible suggestion", suggestion: 'terrible description og terrible suggestion'},
            { title: "top tier suggestion", suggestion: 'well-written description literal perfection'}
        ];
        const suggestions = this.suggestionModel.find({});

        let l = (await this.suggestionModel.find({})).length;

        if (l === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let suggestion = new this.suggestionModel({
                    title: data[i].title,
                    suggestion: data[i].suggestion
                });
                promises.push(suggestion.save());
            }

            return Promise.all(promises);
        }
    }
}
module.exports = mongoose => new Db(mongoose);