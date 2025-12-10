require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection using your TiDB credentials
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: { rejectUnauthorized: true } // Essential for TiDB
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to TiDB MySQL Database');
        const sql = `CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT false
        )`;
        db.query(sql, (err) => {
            if (err) console.error('Table creation failed:', err);
            else console.log('✅ Tasks table ready');
        });
    }
});

// Routes
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) { console.log ("some error occured "); return res.status(500).json(err)};
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, title, completed: false });
    });
});

app.put('/tasks/:id', (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;
    db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Task updated' });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Task deleted' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));