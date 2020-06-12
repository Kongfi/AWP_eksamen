const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

this.loginModel = mongoose.model("Login");
const users = this.loginModel.find(function (err, users) {
    return users;
});

/*users.forEach(async user => {
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) reject(err); else resolve(hash);
        });
    });

    user.hash = hashedPassword;
    delete user.password;
    console.log(`Hash generated for ${user.username}:`, user);
});*/

module.exports = secret => {

    router.post('/authenticate', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        console.log(username);
        if (!username || !password) {
            let msg = "Username or password missing!";
            console.error(msg);
            res.status(401).json({msg: msg});
            return;
        }

        const user = await users.findOne({
            username: username
        });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const payload = { username: username };
                    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                    res.json({
                        msg: `User '${username}' authenticated successfully`,
                        token: token
                    });
                }
                else res.status(401).json({msg: "Password mismatch!"})
            });
        } else {
            res.status(404).json({msg: "User not found!"});
        }
    });

    return router;
};