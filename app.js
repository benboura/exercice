
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// configuration pour utiliser EJS comme moteur de vue
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

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



//-----suppression et modification parti client------

// Route pour supprimer un client en fonction de son ID
app.get('/clients/delete/:id', (req, res) => { 
    
    // Récupérer l'ID du client à supprimer depuis les paramètres de l'URL
    const clientId = req.params.id; 
    
    // Afficher l'ID dans la console pour le debugging
    console.log('ID à supprimer :', clientId); 

    // Requête SQL pour supprimer le client de la table "clients" où l'ID correspond
    const sql = 'DELETE FROM clients WHERE id = ?'; 

    // Exécuter la requête SQL
    db.query(sql, [clientId], (err, result) => { 
        // Vérifier s'il y a une erreur lors de l'exécution de la requête
        if (err) { 
            // Log de l'erreur en cas de problème
            console.error('Erreur lors de la suppression :', err.message); 
            // Envoyer une réponse avec un code 500 (erreur serveur)
            return res.status(500).send('Erreur serveur lors de la suppression.'); 
        }

        // Vérifier si un client a été supprimé (si l'ID existe bien)
        if (result.affectedRows === 0) { 
            // Si aucun client n'a été trouvé, envoyer une réponse avec un code 404
            return res.status(404).send('Client introuvable.'); 
        }

        // Si la suppression s'est bien déroulée, afficher un message dans la console
        console.log('Client supprimé avec succès.'); 
        
        // Rediriger l'utilisateur vers la page principale de la liste des clients
        res.redirect('/clients'); 
    });
});


// Route pour afficher le formulaire de modification d'un client
app.get('/clients/edit/:id', (req, res) => {
    // Récupère l'ID du client à modifier
    const clientId = req.params.id;

    // Requête SQL pour récupérer les données du client
    const query = 'SELECT * FROM clients WHERE id = ?';

    // Exécute la requête SQL
    db.query(query, [clientId], (err, result) => {
        if (err) throw err; // Affiche une erreur si elle survient
        // Rend la vue 'editClient.ejs' avec les données récupérées
        res.render('editClient', { client: result[0] });
    });
});


// Route pour mettre à jour un client
app.post('/clients/edit/:id', (req, res) => {
    // Récupère l'ID du client à modifier
    const clientId = req.params.id;

    // Récupère les nouvelles données envoyées via le formulaire
    const { nom, prenom, email, telephone, adresse } = req.body;

    // Requête SQL pour mettre à jour les informations du client
    const query = 'UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ?, adresse = ? WHERE id = ?';

    // Exécute la requête SQL avec les nouvelles données
    db.query(query, [nom, prenom, email, telephone, adresse, clientId], (err, result) => {
        if (err) throw err; // Affiche une erreur si elle survient
        // Redirige vers la liste des clients après la mise à jour
        res.redirect('/clients');
    });
});




// demarrage du serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});


module.exports = app;