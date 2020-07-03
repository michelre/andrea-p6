// CREATION ET AUTENTIFICATION UTILISATEURS

const bcrypt = require('bcrypt'); // package de criptage pour les mots de passe
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// pour l'enregistrement de nouveux utilisaterus
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // on va hasher (cripter) le mot de passe, 10 tour pour l'algoritme de hashage pour securiser le mot de passe
        .then(hash => {
            const user = new User({ // nouveu utilisateur
                email: req.body.email, // email: addresse email qui est fourni dans le corp de la requete
                password: hash // password: mot de passe cripté
            });
            user.save() // sauvegarde le nouveau user en base de donné
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// pour connecter un utilisateur deja existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // pour trouver un utilisateur dans la base de donné
        .then(user => {
            if (!user) { // si on trouve pas de user 
                return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // return un error 401 ( non autorisé )
            }
            bcrypt.compare(req.body.password, user.password) // pour comparer le mot de passe envoyer avec la requete, avec le hash enregistré dans notre user 
                .then(valid => {
                    if (!valid) { // si la comparaison est pas bonne ( mot de passe false )
                        return res.status(401).json({ error: 'Mot de passe incorrect !' }); // return un error 401 ( non autorisé )
                    }
                    res.status(200).json({ // comparaison : true (200 : requete OK)
                        userId: user._id, // identifiant de l'user dans la base
                        token: jwt.sign( // on appelle la fonction sign de jason web token
                            { userId: user._id }, // en encode le userId pourque un utilisateur ne puisse pas modifier les sauces d'autres utilisateurs
                            'RANDOM_TOKEN_SECRET', // clef secrete pour securiser l'encodage
                            { expiresIn: '24h' } // expiration pour le token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // probleme de connection : erreur server
        })
        .catch(error => res.status(500).json({ error })); // probleme de connection : erreur server
};