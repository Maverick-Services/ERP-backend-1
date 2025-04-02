const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    createdAt:{
        type: Date,
        requierd: true,
        default: Date.now()
    },
    status:{
        type: String,
        enum: ["Pending","Resolved"],
        default: "Pending"
    },
    role:{
        type: String,
        enum: ["employee","team"],
        requierd: true
    },
    raisedBy:{
        type: mongoose.Schema.Types.ObjectId,
        requierd: true,
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
    },
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        requierd: true,
        ref: "Reply"
    }]
})

module.exports = mongoose.model('Query',querySchema);