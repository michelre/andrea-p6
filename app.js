const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const stuffRoutes = require('./routes/stuff');
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

app.use(bodyParser.json());

// creation des middleware
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; // on export l'application