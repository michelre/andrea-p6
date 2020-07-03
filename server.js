// creation d'un programme qui va ecouter des requetes http et qui va y repondre
const http = require('http'); // importer le paquage de http de node
const app = require('./app'); // importer l'app

// la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // dans quel PORT l'app express doit tourner

// la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée.
// Elle est ensuite enregistrée dans le serveur ;
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app); // creation du server, comme parametre on mets l'app

// un écouteur d'évènements est également enregistré,
// consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port); //le server ecoute le requete envoyé
