const db = require('../config/database');
require('dotenv').config();

const generateClubId = () => {
    return 'CLUB' + Math.floor(10000 + Math.random() * 90000);
};

const isClubIdUnique = async (clubId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT club_id FROM clubs WHERE club_id = ?';
        db.query(sql, [clubId], (err, results) => {
            if (err) return reject(err);
            resolve(results.length === 0);
        });
    });
};


// Get all clubs
const getAllClubs = (req, res) => {
    const query = 'SELECT * FROM clubs';
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
};

// Get a club by ID
const getClubById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM clubs WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.json(results[0]);
    });
};
//add new club
const addNewClub = async (req, res) => {
    const { name, description, category } = req.body;

    // Validate request body
    if (!name || !description || !category) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the club already exists
    const sqlCheck = 'SELECT * FROM clubs WHERE name = ?';
    db.query(sqlCheck, [name], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: 'Club already exists' });

        try {
            let clubId;
            do {
                clubId = generateClubId();
            } while (!(await isClubIdUnique(clubId)));

            const sqlInsert = `INSERT INTO clubs (club_id, name, description, category) VALUES (?, ?, ?, ?)`;
            db.query(sqlInsert, [clubId, name, description, category], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Club added successfully!', clubId });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

// Update a club
const updateClub = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    const query = 'UPDATE clubs SET name = ?, description = ? WHERE id = ?';
    db.query(query, [name, description, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.json({ message: 'Club updated successfully!' });
    });
};

module.exports = {
    getAllClubs,
    getClubById,
    addNewClub,
    updateClub
};
