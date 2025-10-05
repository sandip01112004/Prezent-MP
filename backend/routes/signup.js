const express = require('express');
const router = express.Router();
const User = require('../models/users');
// Note: bcrypt is imported in the router but the User model handles the hashing via middleware.

// Route to handle signup
router.post('/signup', async (req, res) => {
    const {
        id,
        mac,
        email,
        name,
        gender,
        roll,
        year,
        branch,
        division,
        bluetoothAvailable,
        deviceUsed
    } = req.body;

    // Basic validation for required fields
    if (!id || !email || !name || !gender || !roll || !year || !branch || !division || !bluetoothAvailable) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Ensure MAC is present if Bluetooth is required
    if (bluetoothAvailable === 'Yes' && !mac) {
        return res.status(400).json({ success: false, message: 'MAC address is required when Bluetooth is available' });
    }

    try {
        // Find if a user already exists with the same PRN (id) OR email.
        const existingUser = await User.findOne({ $or: [{ id }, { email }] });
        
        if (existingUser) {
            if (existingUser.id === id) {
                return res.status(409).json({ success: false, message: 'PRN number already exists' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ success: false, message: 'Email is already registered.' });
            }
        }

        // Note: Duplicate MAC address checking is not feasible when the MAC is stored as a hash.
        // For production, a non-hashed unique device ID should be considered.
        
        // Save new user
        const newUser = new User({
            id,
            // Pass the MAC address to the model, where the pre-save middleware will hash it.
            // We ensure it is lowercased for consistency before hashing.
            mac: bluetoothAvailable === 'Yes' ? mac.toLowerCase() : null, 
            email,
            name,
            gender,
            roll,
            year,
            branch,
            division,
            bluetoothAvailable,
            deviceUsed,
            role: 'student'
        });

        await newUser.save();
        res.json({ success: true, message: 'User created successfully', user: newUser });
    } catch (err) {
        // Handle Mongoose duplicate key error (code 11000) for unique fields (id, email)
        if (err.code === 11000) {
            if (err.keyPattern.id) {
                return res.status(409).json({ success: false, message: 'PRN number already exists' });
            }
            if (err.keyPattern.email) {
                return res.status(400).json({ success: false, message: 'Email is already registered.' });
            }
        }
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to check uniqueness
router.post('/check-unique', async (req, res) => {
    const { id } = req.body;
    // Client-side can send MAC but the server ignores it due to the hashing issue.
    
    try {
        if (id) {
            const exists = await User.findOne({ id });
            if (exists) {
                return res.json({ success: false, message: 'PRN number already exists' });
            }
        }
        
        // MAC check is intentionally skipped here due to being stored as a hash.

        res.json({ success: true });
    } catch (err) {
        console.error('Uniqueness check error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;