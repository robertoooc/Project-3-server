const db = require('../models')
const router = require('express').Router()
const socketIo = require('socket.io')
const { createServer } = require('http')
const server = createServer(router)
const io = socketIo(server,{
    cors: {
      // linking to react app
      origin: 'http://localhost:3000'
      //might need to include METHODS
    }
  })


router.get('/', async function (req,res){
    try{
        // in order for this to work, the axios call ping to api must be: 
        // localhost:8000/chats?search={search term from react}
        let searchFor = req.query.search
        console.log(req.query.search)
        const chats = await db.Chat.find({})
        const findAll = chats.filter(chat=>chat.title.includes(searchFor))
        //const find = chats.find(chat => chat.title.includes(searchFor))
        if (findAll.length > 0){
            res.json(findAll)
        }else{
            res.json({msg:`sorry bud, couldn't find ${searchFor}`})
        }

    }catch(err){
        console.log(err)
        res.status(500).json({msg: 'my bad G'})
    }
})

// finds specific chat room and it's content
router.get('/:id', async function (req,res){
    try{
        const findChatRoom = await db.Chat.findById(req.params.id)
        if(!findChatRoom) return res.status(404).json({ msg: "You messed up" });
        res.json(findChatRoom)
    }catch(err){
        console.log(err)
        res.status(500).json({msg: 'my bad G'})
    }
})

// creates new chat room
router.post('/', async function (req,res){
    try{
        const newChatRoom = await db.Chat.create(req.body)
        res.json(newChatRoom)
    }catch(err){
        console.log(err._message)
        if (err._message == 'Chat validation failed') return res.status(400).json({msg:"You messed up, User's fault"})
        res.status(500).json({msg: 'my bad G'})
    }
})

// finds all comments within a specific chat room
router.get('/:id/comment', async function (req,res){
    try{
        const findChatRoom = await db.Chat.findById(req.params.id)
        if(!findChatRoom) return res.status(404).json({ msg: 'You messed up' });
        res.json(findChatRoom)
    }catch(err){
        console.log(err)
        res.status(500).json({msg: 'my bad G'})
    }
})

// posts a new comment to a specific chat room to store message history
router.post('/:id/comment', async function (req,res){
    try{
        const findChatRoom = await db.Chat.findById(req.params.id)
        if(!findChatRoom) return res.status(404).json({ msg: 'You messed up' });
        const addComment = req.body
        console.log(req.body)
        findChatRoom.content.push(addComment)
        await findChatRoom.save()
        let chatId = req.params.id
        let content = req.body.content
        console.log(findChatRoom)
        // io.on('connection',(socket)=>{
        //     socket.on('join-chat',(chatId)=>{
        //         socket.join(chatId)
        //       })
        //     socket.on('send-comment',(content)=>{
        //         socket.to(chatId).emit('receive-comment',content)
        //       })
        //     //io.to(message.room).emit('receive-comment',message)

        // })
        res.json(findChatRoom)
    }catch(err){
        console.log(err._message)
        console.log(req.body)
        res.status(500).json({msg: 'my bad G'})
    }
})


module.exports = router