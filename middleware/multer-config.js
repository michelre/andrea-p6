// CONFIGURATION DE MULTER POUR ENREGISTRER LES IMAGES

const multer = require('multer');

//pour modifier l'extension des fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ // on enregistre dans le disk
    destination: (req, file, callback) => { // dans quel dossier enregistrer les fichier 
        callback(null, 'images'); // null : pas d'erreur - 'images' : dossier de destination
    },
    filename: (req, file, callback) => { // quel nom de fichier utiliser
        // on genere le nom
        const name = file.originalname.split(' ').join('_'); // nom d'origine, remplace des espaces par des _
        const extension = MIME_TYPES[file.mimetype]; // extension a ajouter au nom
        callback(null, name + Date.now() + '.' + extension); // nom d'origine + numero unique + . + extension

    }
});

module.exports = multer({ storage: storage }).single('image');