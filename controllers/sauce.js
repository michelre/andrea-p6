const Sauce = require('../models/sauce');
const fs = require('fs'); // files sistem

// LOGIQUE METIER

// creer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // pour transformer l'objet JSON en JS
    const sauce = new Sauce({ // creation d'une nouvelle instance du model sauce
        ...sauceObject,
        // generer l'URL de l'image
        // http://localhost:3000/image/nomdufichier 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() // pour enregistrer l'objet thing dans la base de donne
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));

    sauceObject.likes = 0;  // à l'objet sauce on ajoute like à 0
    sauceObject.dislikes = 0; // à l'objet sauce on ajoute dislike
    sauceObject.usersLiked = Array(); // déclaration tableau des utilisateur qui aiment
    sauceObject.usersDisliked = Array(); // déclaration tableau des utilisateur qui aiment pas

}

// envoyer like ou dislike
exports.likeOrDislike = (req, res, next) => {
    if (req.body.like === 1) { // utilisateur aime la sauce
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Un like de plus !' }))
            .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Un dislike de plus !' }))
            .catch(error => res.status(400).json({ error }));
    } else { //like vaut 0

        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Un like de moins !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Un dislike de moins !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
};

// modifier une sauce existante
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        // si il y a une image
        {
            ...JSON.parse(req.body.sauce), // on recupere la chaine de caracter on la transforme en objet JS
            // et on modifie l'URL de l'image
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            // si il y en a pas
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // premier argument est celui qu'on veut modifier, le deuxieme c'est la nouvelle version de l'objet 
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// effacer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // on cherche l'URL de l'image
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; // on recupere le nom precis du fichier ( 2eme element, apres /image/)
            fs.unlink(`images/${filename}`, () => { // unlink : pour effacer un fichier
                // enfin on supprime l'objet de la base de donné
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error })); // erreus server
};

// recuperer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// recuperer toutes les sauces depuis la base de donne
exports.getAllSauces = (req, res, next) => {
    Sauce.find() // nous permet de lire dans la base de donne les differentes sauces
        .then(sauces => res.status(200).json(sauces)) // on requpere le tableau de toutes les sauces et on renvoie le meme tableau
        .catch(error => res.status(400).json({ error }));
};