const db = require('../config/database');

const getAllEvents = (req, res) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const addNewEvent = (req, res) => {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = 'INSERT INTO events (title, description, date) VALUES (?, ?, ?)';
    db.query(sql, [title, description, date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Event added successfully!' });
    });
};

const updateEvent = (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = 'UPDATE events SET title = ?, description = ?, date = ? WHERE id = ?';
    db.query(sql, [title, description, date, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event updated successfully!' });
    });
};

const deleteEvent = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM events WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully!' });
    });
};

const getEventById = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM events WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Event not found' });
        res.json(results[0]);
    });
};

module.exports = {
    getAllEvents,
    addNewEvent,
    updateEvent,
    deleteEvent,
    getEventById
};