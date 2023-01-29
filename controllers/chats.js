const db = require('../models')
const router = require('express').Router()


router.get('/', async function (req,res){
    try{
        // in order for this to work, the axios call ping to api must be: 
        // localhost:8000/chats?search={search term from react}
        let searchFor = req.query.search
        console.log(req.query.search)
        const chats = await db.Chat.find({})
        const find = chats.find(chat => chat.title.includes(searchFor))
        if (find != undefined){
            res.json(find)
        }else{
            res.json({msg:`sorry bud, couldn't find ${searchFor}`})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({msg: 'my bad G'})
    }
})

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

router.post('/:id/comment', async function (req,res){
    try{
        const findChatRoom = await db.Chat.findById(req.params.id)
        if(!findChatRoom) return res.status(404).json({ msg: 'You messed up' });
        const addComment = req.body
        findChatRoom.content.push(addComment)
        await findChatRoom.save()
        res.json(findChatRoom)
    }catch(err){
        console.log(err.kind)
        res.status(500).json({msg: 'my bad G'})
    }
})


module.exports = router