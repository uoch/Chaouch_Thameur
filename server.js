const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Set up SQLite database
const db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create a users table if it doesn't exist
        db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)');
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle user registration
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // In a real application, you should hash and salt the password before storing it in the database
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to register user' });
        }
        res.json({ message: 'User registered successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
