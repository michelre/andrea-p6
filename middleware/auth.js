// VERIFICATION DE USER ID PAR RAPPORT AU TOKEN

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // on recuper juste le token (bearer token)
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // on verify le token
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) { // si il y un userId il faut qu'il corresponde à celui du token
            throw 'Invalid user ID'; // si le token ne correspond pas au userId : erreur
        } else {
            next(); // si tout est valide on passe au prochain middleware
        }
    } catch {
        res.status(401).json({ // probleme d'autentification
            error: new Error('Invalid request!')
        });
    }
};