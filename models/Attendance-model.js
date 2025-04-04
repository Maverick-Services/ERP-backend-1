const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    entry:{
        type: Date,
        required: true,
        default: Date.now
    },
    exit:{
        type: Date,
    },
    dateField: { 
        type: Date, 
        // required: true 
    }
});

module.exports = mongoose.model('Attendance',attendanceSchema);