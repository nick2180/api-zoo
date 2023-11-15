const express = require('express');
const mysql = require('mysql');
const app = express();

// Importation de body-parser et cors
const bodyParser = require('body-parser');
const cors = require('cors');


// Configuration de body-parser pour récupérer les données en JSON 
app.use(bodyParser.json());

// Configuration de body-parser pour récupérer les données d'un formulaire
app.use(express.json());

// Configuration de cors pour autoriser les requêtes HTTP depuis n'importe quel domaine
app.use(cors({
    origin: '*',
}));

// Configuration de cors pour autoriser toutes les méthodes HTTP
app.options('*', cors());

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connexion à la base de données
db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL');
});

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon serveur');
});

// Création d'une route pour récupérer tous les films
// GET http://localhost:3000/api/movies
app.get('/api/movies', (req, res) => {

    // Utilisation d'un try/catch pour gérer les erreurs
    try {
        // Récupération des films dans la base de données
        db.query('SELECT * FROM movies', (err, results) => {
            // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
            if (err) {
                console.log(err);
                return res.status(400).send(results);
            } else {
                // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
                return res.status(200).send(results);
            }
        });
    } catch (error) {
        // Gestion des erreurs génériques/techniques
        console.log(error);
        return res.status(500).send(error);
    }
});

// Création d'une route pour ajouter un film avec la méthode POST
app.post('/api/movies', (req, res) => {
    // Récupération des données envoyées
    const { title, picture, release_date } = req.body;


    // Création de la requête SQL préparée
    const INSERT_MOVIE_QUERY = `INSERT INTO movies (title, picture, release_date) VALUES (?, ?, ?)`;

    try {
        // Exécution de la requête SQL préparée
        db.query(INSERT_MOVIE_QUERY,
            // Passage des données reçues dans le corps de la requête
            [title, picture, release_date], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send(results);
                } else {
                    return res.status(201).send(results);
                }
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
