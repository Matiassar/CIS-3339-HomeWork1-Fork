const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('Course', studentSchema);