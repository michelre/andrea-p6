// SCHEMA POUR STOCKER LES SAUCES DANS LA BASE DE DONNÉ

const mongoose = require('mongoose');

// creation d'un schema de donné pour la creation des sauces
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
});

module.exports = mongoose.model('Sauce', sauceSchema); // on export le model Sauce