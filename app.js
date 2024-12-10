const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Benraphael@1',
    database: 'streaming_platform'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL.');
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});


app.get('/offres', (req, res) => {
    db.query('SELECT * FROM abonnements', (err, result) => {
        if (err) throw err;
        res.render('offres', { offres: result });
    });
});

app.get('/clients', (req, res) => {
    db.query('SELECT * FROM clients', (err, result) => {
        if (err) throw err;
        res.render('clients', { clients: result });
    });
});

app.get('/equipe', (req, res) => {
    db.query('SELECT * FROM equipe', (err, result) => {
        if (err) throw err;
        res.render('equipe', { equipe: result });
    });
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});


module.exports = app;