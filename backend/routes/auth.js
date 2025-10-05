    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const User = require('../models/users');
    const Teacher = require('../models/teachers'); // ✅ Use the Teacher model, not JSON

    // Student login
    router.post('/login/student', async (req, res) => {
        const { id, mac } = req.body;

        if (!id || !mac) {
            return res.status(400).json({ success: false, message: "ID and MAC address are required" });
        }

        try {
            const student = await User.findOne({ id });

            if (!student) {
                return res.status(401).json({ success: false, message: "Invalid ID or MAC address" });
            }

            const isMacValid = await bcrypt.compare(mac.toLowerCase(), student.mac);

            if (!isMacValid) {
                return res.status(401).json({ success: false, message: "Invalid ID or MAC address" });
            }

            return res.json({
                success: true,
                token: `token-${student.id}`
            });

        } catch (err) {
            console.error("Error during student authentication:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });

    // ✅ Teacher login using hashed password
    router.post('/login/teacher', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        try {
            const teacher = await Teacher.findOne({ email });
            if (!teacher) {
                return res.status(401).json({ success: false, message: "Invalid email " });
            }
            const isPasswordValid = await bcrypt.compare(password, teacher.password);
            console.log(password);
            console.log(teacher.password);
            console.log('Password valid:', isPasswordValid);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: "Invalid  password" });
            }
            return res.json({
                success: true,
                token: `teacher-token-${teacher.email}`
            });
        } catch (err) {
            console.error("Error during teacher authentication:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });

    module.exports = router;
