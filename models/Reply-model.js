const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    queryId:{
        type: mongoose.Schema.Types.ObjectId,
        requierd: true,
        ref: "Query"
    },
    replyBy:{
        type: mongoose.Schema.Types.ObjectId,
        requierd: true,
        refPath: "replyByModel"
    },
    replyByModel:{
        type: String,
        requierd: true,
        enum:["User","Team"]
    },
    message:{
        type: String,
        requierd: true
    },
})

module.exports = mongoose.model('Reply',replySchema);