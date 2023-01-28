const bcrypt = require('bcryptjs')
const { createHash, verify } = require('crypto') // part node, like the fs
const jwt = require('jsonwebtoken')
const db = require('./models')

// try {
//     // run some code
//     throw new Error('think fast, node!')
// } catch(err) {
//     // gracefully handle any erroros that occur in the try
//     console.log(err)
// }

// throw new Error('node does not like things being thrown at it')

const jwtTest = () => {
    try {
        // when a user is being logged in, we create a token:

        // payload of data
        const payload = {
            name: 'Weston',
            id: '12345',
            email: 'w@b.com'
            // DO NOT PUT THE USER'S PASSWORD
        }
        // secret to sign the jwt with -- like a password that only our server knows
        const secret = 'my super big secret'
        const token = jwt.sign(payload, secret)
        console.log(token)
        // user is requesting to perform a action and they authorization to do so
        const decode = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FiZSIsImlkIjoiMzQ1NiIsImVtYWlsIjoiZ2FiZUBsZWV0aGFja2Vyei5jb20iLCJpYXQiOjE2NzQ2NzgwOTV9.gPPzzHXPMZX0U9JaAq74H7jFuvfuf0Lptfhd2pGWYSU', secret)
        console.log(decode)
    } catch (err) {
        // jwt will kick us down here if there is a problem with a token
        console.log(err)
    }
}

// jwtTest()

// simple hashing exmaples with sha256
const hash = createHash('sha256')

hash.update('{ name: gabe, id: 12345 }' + 'server secret')

const digest = hash.digest('hex')

console.log('sha256:', digest)

// function sendFile() {
//     const hash = createHash('sha256')

//     hash.update('hello i am the contents of a text file')

//     const digest = hash.digest('hex')

//     const fileThatIsSent = {
//         text: 'hello i am the contents of a text file',
//         hash: digest
//     }

// }

// function recieveFile(file) {
//     const hash = createHash('sha256')
//     hash.update(file.text)
//     const digest = hash.digest('hex')
//     if (file.hash != digest) {
//         // something went wrong
//     }
// }

const testBcrypt = async () => {
    try {
        // when a user is registering, we need to make a hash of their password
        const newPassword = 'hello' // coming from the req.body
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
        console.log('hashed password:', hashedPassword)

        // when a user is logging in, we need to test the password that the user supplies against the hash that is in the database
        const matchPasswords = await bcrypt.compare('wrong password', hashedPassword)
        console.log('does the password match the hash?', matchPasswords)
    } catch (err) {
        console.log(err)
    }
}

// testBcrypt()


async function testChat() {
    try {
        // const newChat = await db.Chat.findOneAndUpdate(
        //     { title: 'test' },
        //     { upsert: true, new: true }
        // )

        // const newComment = {
        //     content: 'this is a test comment'
        // }
        // newChat.content.push(newComment)

        // await newChat.save()
        // console.log(newChat)

        const foundChat = await db.Chat.findOne({}).populate('owner')
        const foundUser = await db.User.findById('63d1a828acd93e41a42922a9').populate('chats')
        // foundUser.chats.push(foundChat._id)
        // foundChat.owner = foundUser._id
        // await foundChat.save()
        // await foundUser.save()

        console.log(foundChat)
        console.log(foundUser)
    } catch (err) {
        console.log(err)
    }
}
testChat()