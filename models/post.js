const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    picture: {
        type: String,
        required: true
    },

    likes: [{
        type: ObjectId,
        ref: "User"
    }],

    comments: [{
        postedBy: {
            type: ObjectId,
            ref: "User"
        },
        text: String
    }],

    postedBy: {
        type: ObjectId,
        ref: "User"
    },

}, {timestamps: true})

mongoose.model("Post", postSchema)