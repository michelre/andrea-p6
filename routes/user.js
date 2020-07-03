const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); // pour envoyer les info (email + password) d'un nouveau utilisateur
router.post('/login', userCtrl.login); // pour envoyer les info d'un utilisateur deja existant

module.exports = router;