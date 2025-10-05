const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
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

    // Basic validation
    if (!id || !email || !name || !gender || !roll || !year || !branch || !division || !bluetoothAvailable) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (bluetoothAvailable === 'Yes' && !mac) {
        let hashedMac = '';
        hashedMac = await bcrypt.hash(mac.toLowerCase(), 10);
        return res.status(400).json({ success: false, message: 'MAC address is required when Bluetooth is available' });
    }

    try {
        // Check if user with same PRN exists
        const existingId = await User.findOne({ id });
        if (existingId) {
            return res.status(409).json({ success: false, message: 'PRN number already exists' });
        }
        // Check for existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email is already registered." });
        }
        // Check for duplicate MAC address (if BT is available)
        if (bluetoothAvailable === 'Yes') {
            const existingMac = await User.findOne({ mac });
            if (existingMac) {
                return res.status(409).json({ success: false, message: 'MAC address already registered' });
            }
        }

        // Save new user
        const newUser = new User({
            id,
            mac: bluetoothAvailable === 'Yes' ? mac : null, // Store MAC address if Bluetooth is available, else store null
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
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to check uniqueness
router.post('/check-unique', async (req, res) => {
    const { id, mac } = req.body;

    try {
        if (id) {
            const exists = await User.findOne({ id });
            if (exists) {
                return res.json({ success: false, message: 'PRN number already exists' });
            }
        }

        if (mac) {
            const exists = await User.findOne({ mac });
            if (exists) {
                return res.json({ success: false, message: 'MAC address already registered' });
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Uniqueness check error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
