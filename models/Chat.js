// require mongoose ODM
const mongoose = require('mongoose')

// Child Schema
const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userName: { type: String, required: true},
    userId: { type: String, required: true}
}, {
    timestamps: true
})

// Parent Schema
const ChatSchema = new mongoose.Schema({
    title: { type: String, lowercase: true, required: true },
    content: [CommentSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
}
)

module.exports = mongoose.model('Chat', ChatSchema)



