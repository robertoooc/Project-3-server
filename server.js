// require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const app = express()
// requiring things needed to incorporate socketIo
const { createServer } = require('http')
const socketIo = require('socket.io')
const server = createServer(app)
const io = socketIo(server,{
  cors: {
    // linking to react app
    origin: '*'
    //might need to include METHODS
  }
})
// config express app
const PORT = process.env.PORT || 8000 
// for debug logging 
const rowdyResults = rowdy.begin(app)
// cross origin resource sharing 
app.use(cors())
// request body parsing
app.use(express.json())
app.use((req,res,next)=>{
  req.io = io
  return next()
})
const myMiddleware = (req, res, next) => {
  // I am a middleware
  console.log('Hi 👋 the middleware has been invoked!')
  next() // makes express move on to the next route/middleware
}

io.on('connection',(socket)=>{
  //console.log(socket.id)
  // on render in react the user is sent here to join that specific room they're in so they see only the content there
  socket.on('join-chat',(chatId)=>{
    socket.join(chatId)
    console.log(chatId,"room hoined")
  })
  // when users on react decide to send a message payload it goes here and will emit that message to everyone else in that same room as them
  socket.on('send-comment',(message)=>{
    console.log(message,'here')
    console.log(message.comment)
     //socket.join(message.room)
     socket.to(`${message.room}`).emit('receive-comment',message)
  })


})
// app.use(myMiddleware)

// GET / -- test index route
// defining a function as route specific middleware
app.get('/', myMiddleware, (req, res) => {
  res.json({ msg: 'hello backend 🤖' })
})

// controllers
app.use('/users', require('./controllers/api-v1/users.js'))
app.use('/chats', require('./controllers/chats.js'))

// hey listen
server.listen(PORT, () => {
  rowdyResults.print()
  console.log(`is that port ${PORT} I hear? 🙉`)
})

