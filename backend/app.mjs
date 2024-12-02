import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from './db.mjs';
import cors from 'cors'; 

const app = express();
app.use(cors()); 
app.use(express.json()); 
const PORT = 5000;
const SECRET_KEY = 'secret';

let db;


(async () => {
    db = await getDb();
})();

// Signup Route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ message: 'Email already exists.' });
        } else {
            res.status(500).json({ message: 'Server error.' });
        }
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
            expiresIn: '1h',
        });
        res.status(200).json({ message: 'Login successful.', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get all users Route
app.get('/users', async (req, res) => {
    try {
        const users = await db.all('SELECT * FROM users');
        res.status(200).json(users); // Return all users as a JSON response
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
