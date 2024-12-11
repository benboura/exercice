
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// configuration pour utiliser EJS comme moteur de vue
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


// Route pour afficher le formulaire de création de compte
app.get('/clients/add', (req, res) => {
    res.render('addClient'); // Page qui affichera le formulaire
});

// Route pour enregistrer un nouveau client
app.post('/clients/add', (req, res) => {
    const { nom, prenom, age, telephone, email, adresse } = req.body;

    const query = `
        INSERT INTO clients (nom, prenom, age, telephone, email, adresse)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [nom, prenom, age, telephone, email, adresse], (err, result) => {
        if (err) throw err;
        res.redirect('/clients'); // Redirection vers la liste des clients
    });
});


// Route pour afficher le formulaire de souscription à un abonnement
app.get('/clients/subscribe/:id', (req, res) => {
    const clientId = req.params.id;

    // Récupérer les offres disponibles pour les afficher
    db.query('SELECT * FROM abonnements', (err, offres) => {
        if (err) throw err;
        res.render('subscribe', { clientId, offres });
    });
});

// Route pour enregistrer la souscription
app.post('/clients/subscribe', (req, res) => {
    const { clientId, abonnementId } = req.body;

    const query = `
        INSERT INTO souscriptions (client_id, abonnement_id, date_souscription)
        VALUES (?, ?, NOW())
    `;
    db.query(query, [clientId, abonnementId], (err, result) => {
        if (err) throw err;
        res.redirect('/clients');
    });
});


app.get('/equipe', (req, res) => {
    db.query('SELECT * FROM equipe', (err, result) => {
        if (err) throw err;
        res.render('equipe', { equipe: result });
    });
});

// demarrage du serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});


module.exports = app;