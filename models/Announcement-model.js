const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    createdAt:{
        type: Date,
        requierd: true,
        default: Date.now()
    },
    role:{
        type: String,
        enum: ["admin","team"],
        requierd: true
    },
    raisedBy:{
        type: mongoose.Schema.Types.ObjectId,
        // requierd: true,
        refPath: "raisedByModel"
    },
    raisedByModel:{
        type: String,
        requierd: true,
        enum:["User","Team"]
    },
    subject:{
        type: String,
        requierd: true
    },
    description:{
        type: String,
        requierd: true
    }
})

module.exports = mongoose.model('Announcement',announcementSchema);