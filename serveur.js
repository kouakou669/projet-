const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Configuration de la connexion à MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // remplacez par votre nom d'utilisateur
    password: '', // remplacez par votre mot de passe
    database: 'mydb'
});

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données: ' + err.stack);
        return;
    }
    console.log('Connecté à la base de données.');
});

// Route pour l'inscription d'un utilisateur
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nom, email et mot de passe requis.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'inscription.', error: err });
        }
        res.status(201).json({ message: 'Utilisateur créé.', userId: result.insertId });
    });
});

// Route pour la connexion
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user.id }, 'votre_clé_secrète', { expiresIn: '1h' });
        res.json({ message: 'Connexion réussie.', token });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
