// LOGIQUE ROUTING

const express = require('express');
const router = express.Router(); // creation d'un router

const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCtrl.createSauce); // creer une nouvelle sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce); // effacer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // recuperer une sauce
router.get('/', auth, sauceCtrl.getAllSauces); // recuperer toutes les sauces depuis la base de donne
router.post('/:id/like', auth, sauceCtrl.likeOrDislike); // envoyer like ou dislike

module.exports = router;