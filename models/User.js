// require mongoose ODM
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)