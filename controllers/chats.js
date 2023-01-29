const db = require('../models')
const router = require('express').Router()


router.get('/', async function (req,res){
    try{
        const chats = await db.Chat.find({})
        res.json({msg: 'Welcome to chats 💬 ', chats})
    }catch(err){
        console.log(err)
        res.status(500).json({msg: 'server error'})
    }
})

router.get('/:id', async function (req,res){
    try{
        const findChatRoom = await db.Chat.findById(req.params.id)
        res.json(findChatRoom)
    }catch(err){
        console.log(err)
    }
})

router.post('/', async function (req,res){
    try{
        const newChatRoom = await db.Chat.create(req.body)
        res.json(newChatRoom)
    }catch(err){
        console.log(err)
    }
})

router.get('/:id/comment', async function (req,res){
    try{
        const findChatRoom = await db.Chat.findById(req.params.id)
        res.json(findChatRoom)
    }catch(err){
        console.log(err)
    }
})

router.post('/:id/comment', async function (req,res){
    try{
        const findChatRoom = await db.Chat.findById(req.params.id)
        const addComment = req.body
        findChatRoom.content.push(addComment)
        await findChatRoom.save()
        res.json(findChatRoom)
    }catch(err){
        console.log(err)
    }
})


module.exports = router