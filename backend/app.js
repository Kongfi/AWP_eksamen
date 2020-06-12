// libraries
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const checkJwt = require('express-jwt');

// config
const appName = "Suggestions";
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors());
app.use(express.static('../frontend/build'));

// db
const db = require('./db.js')(mongoose);

let openPaths = [
    { url: '/api/users/authenticate', methods: ['POST'] }
];

// validate
const secret = process.env.SECRET || "hemmelighed";
app.use(checkJwt({ secret: secret }).unless({ path : openPaths }));

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: err.message });
    } else {
        next();
    }
});

// routes
const usersRouter = require('./routers/users_router')(secret);
app.use('/api/users', usersRouter);

app.get('/api/suggestions', async (req, res) => {
    const suggestions = await db.getSuggestions();
    res.json(suggestions);
});

app.get('/api/suggestions/:id', async (req, res) => {
    let id = req.params.id;
    const suggestion = await db.getSuggestion(id);
    res.json(suggestion);
});

app.put('/api/suggestions/:id', async (req, res) => {
    const id = req.body.id;
    const newSignature = req.body.signature;
    const username = req.body.username;
    const suggestion = await db.getSuggestion(id);
    const filter = suggestion.signatures.filter(x => x.username === username);
    async function addSignature() {
        const signature = await db.addSignature(id, newSignature);
    }
    if (filter.length === 0) {
        addSignature();
        res.status(204).send();
    } else {
        res.status(409).send();
    }
});

app.put('/api/newSuggestion', (req, res) => {
    let title = req.body.title;
    let desc = req.body.desc;
    async function addSuggestion() {
        await db.createSuggestion(title, desc);
    }
    addSuggestion();
    res.status(204).send();
});

// Redirect
app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'frontend', 'build', 'index.html'))
);

// start
const url = process.env.MONGO_URL || 'mongodb://localhost/suggestions_db';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await db.bootstrap();
        await db.suggestionData();
        await app.listen(port);
        console.log(`Suggestions API running on port ${port}!`)
    })
    .catch(error => console.error(error));