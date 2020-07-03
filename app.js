const express = require('express');
const bodyParser = require('body-parser'); // transforme le corp des requetes en objet JS utilisable
const mongoose = require('mongoose');
const path = require('path'); // nous donne access au chemin des fichiers

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://andre:AndreaG@cluster0-4bten.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// pour eviter les ERRORS de CORS, pourque tout le monde puisse faire des requete depuis son navigateur 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // tout le monde a le droit d'acceder à notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // on donne l'autorisation de utiliser certaines entete
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // et aussi sur certaines methodes
    next(); // j'appelle next() pour passer au middleware d'apres
});

app.use(bodyParser.json()); // json c'est une methode de l'objet bodyParser

// creation des middleware
app.use('/images', express.static(path.join(__dirname, 'images'))); // pourque app.js serve le dossier /images 
app.use('/api/sauces', sauceRoutes); // pour le CRUD des sauces - se refer à ./routes/sauces.js
app.use('/api/auth', userRoutes); // pour l'autentification de l'utilisateur - se refer à ./routes/user.js

module.exports = app; // on export l'application