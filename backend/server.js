require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth'); // Authentication routes
const signupRoute = require('./routes/signup'); // Signup routes
const Teacher = require('./models/teachers');  // Import Teacher model for querying

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// Routes
app.use('/api', authRoutes); // Authentication-related routes
app.use('/api', signupRoute); // Signup-related routes

// Endpoint to receive scan data from ESP32
app.post("/api/scan", (req, res) => {
    console.log("Received scan data from ESP32:", req.body);

    // Assuming you want to save this scan data in MongoDB or process it further here
    // Example: Save scan data into a database or perform any operations

    res.status(200).send({ message: "Scan data received" });
});

// Endpoint to send teacher's MAC address to ESP32 at the start of the lecture
// Endpoint to send teacher's MAC address to ESP32
app.post('/api/start-lecture', (req, res) => {
    const hardcodedMac = "d4:8a:39:96:23:e7";
    return res.json({ teacherMac: hardcodedMac });
});




// Health check route
app.get("/", (req, res) => {
    res.send("ESP32 Bluetooth Scan API is running!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
