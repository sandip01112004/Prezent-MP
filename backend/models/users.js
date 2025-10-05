const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // PRN
    mac: { type: String, required: true }, // Store hashed MAC address
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    roll: { type: String, required: true },
    year: { type: String, required: true },
    branch: { type: String, required: true },
    division: { type: String, required: true },
    bluetoothAvailable: { type: String, required: true },
    deviceUsed: { type: String, default: "" },
    role: { type: String, default: "student" },
});

// Middleware to hash MAC address before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('mac')) {
        this.mac = await bcrypt.hash(this.mac, 10);
    }
    next();
});

// Method to compare entered MAC address with stored hashed MAC address
userSchema.methods.compareMAC = async function(mac) {
    return await bcrypt.compare(mac, this.mac);
};

module.exports = mongoose.model('User', userSchema);
