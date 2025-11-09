const {Server} = require('socket.io')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiService = require('../services/ai.service')
const messageModel = require('../models/message.model')
const {createMemory , queryMemory} = require('../services/vector.service')
function initSocketServer(httpServer){
    const io = new Server(httpServer, {
        // cors:{
        //     origin: process.env.FRONTEND_URL || "http://localhost:5173", // Use FRONTEND_URL in production
        //     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        //     credentials: true,
        //     methods: ["GET", "POST", "OPTIONS"]
        // }
    })
  
    /* middleware */
    io.use(async(socket , next)=>{
    
    console.log('Socket connection attempt from:', socket.handshake.headers.origin);
    console.log('Socket headers:', socket.handshake.headers);
    
    const cookies = cookie.parse(socket.handshake.headers?.cookie || '')
    console.log('Cookies received:', cookies);

    if (!cookies.token) {
        console.log('No token provided in cookies');
        return next(new Error("Authentication Error: No token provided"));
    } 

    try {
        const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)
        
        if (!user) {
            console.log('User not found for token');
            return next(new Error("Authentication Error: User not found"));
        }
        
        socket.user = user
        console.log('Socket authenticated for user:', user._id);
        next()

    } catch (error) {
        console.log('Token verification failed:', error.message);
        next(new Error("Authentication Error: Invalid token"));
    }

    })
    io.on('connection', (socket) => {
     console.log("Client connected successfully:", socket.user._id);
     
     // Handle socket errors
     socket.on('error', (error) => {
         console.error('Socket error:', error);
     });
     
     socket.on('disconnect', (reason) => {
         console.log('Client disconnected:', socket.user._id, 'Reason:', reason);
     });
       socket.on("ai-message" , async(messagePayload)=>{
        try {
            console.log('Processing AI message:', messagePayload);
            
            if (!messagePayload || !messagePayload.message || !messagePayload.chat) {
                throw new Error('Invalid message payload');
            }
        


       /*const message = await messageModel.create({
            user : socket.user._id,
            chat : messagePayload.chat,
            content : messagePayload.message,
            role : 'user'
        })

        const vectors = await aiService.generateVector(messagePayload.message)  //before optimization 5sec time le raha tha upar ka 2 and neeche ka 3sec */

        const[message , vectors] = await Promise.all([

        messageModel.create({
            user : socket.user._id,
            chat : messagePayload.chat,
            content : messagePayload.message,
            role : 'user'
        }),

        aiService.generateVector(messagePayload.message), //after optimization kyuki neeche wala jada time le raha tha 3sec therefore ye ab 3sec lega . Ab ye dono ko hum ek sath start kaise kar sakte hai ? kyuki dono tasks independent hai dono ek dusre pe pepend nahi karte database me save karna and vectors generate karna ye dur dur tak ek dusre se alag hai therefore we can start both task in one time and koi bhi tasks jo dusre task pe depend karta hai usko hum ek sath start nahi kar sakte
    ])

    await createMemory({
            vectors,
            messageId : message._id,
            metadata:{
                chat : messagePayload.chat,
                user : socket.user._id,
                text : messagePayload.message
            }
        })


      /* const memory = await queryMemory({
            queryVector: vectors , 
            limit:3,
            metadata:{
                user:socket.user._id
            }
        })
        
         // console.log("memory" , memory)

        const chatHistory = (await messageModel.find({ //apne user ne jo ai se baat kari this usko yeha pe read kiya jayega then usko console kiya jayega 
            chat : messagePayload.chat
        }).sort({ createdAt : -1 }).limit(20).lean()).reverse() //basically iske andar likha hua hai last ke kitne messages hum yaad rakhte hai but yeh itna chota number nahi hota yeh somewhere around 20 ke aas pass hota hai and rest of the earlier message hum summary me consider karte hai. why we use limit because ai token ke basis pe kaam karta hai toh jitne jada messages utne jada tokens toh utne jada paise hume kharch karne padenge that's why we use limit.  */
 
       const[memory , chatHistory] = await Promise.all([
           queryMemory({
            queryVector: vectors , 
            limit:3,
            metadata:{
                user:socket.user._id
            }
        }),
          messageModel.find({  
            chat : messagePayload.chat
        }).sort({ createdAt : -1 }).limit(20).lean().then(messages => messages.reverse())
       ])


        const stm = chatHistory.map(item =>{
            return {
                role : item.role,
                parts :[{text : item.content}]
            }  
        })

        const ltm = [
            {
                role:'user',
                parts : [{
                    text : `
                     these are some previous messages from the chat use them to create the response
                     ${memory.map(item => item.metadata.text).join('\n')}
                `}]
            }
        ]

        console.log(ltm[0])
        console.log(stm)

        const response = await aiService.generateResponse([...ltm , ...stm])
        console.log(response)

     /*  const responseMessage = await messageModel.create({
            user : socket.user._id,
            chat : messagePayload.chat,
            content : response,
            role : 'model'
        })

        const responseVectors = await aiService.generateVector(response) */

        
        socket.emit('ai-response' , {
            content : response,
            chat : messagePayload.chat
        })

       const[responseMessage , responseVectors] = await Promise.all([
          messageModel.create({
            user : socket.user._id,
            chat : messagePayload.chat,
            content : response,
            role : 'model'
        }),
        aiService.generateVector(response)
       ])

        await createMemory({
            vectors:responseVectors,
            messageId : responseMessage._id,
            metadata:{
                chat: messagePayload.chat,
                user : socket.user._id,
                text: response
            }

        })
        
        console.log('AI message processed successfully');
        
        } catch (error) {
            console.error('Error processing AI message:', error);
            
            // Send error response to client
            socket.emit('ai-response', {
                content: `Sorry, there was an error processing your message: ${error.message}`,
                chat: messagePayload.chat,
                error: true
            });
        }
       })

    })
}


module.exports = initSocketServer
















//  What is socket.id?

// Every client connection gets a unique ID automatically generated by Socket.IO.

// socket.id is like a roll number for that client in the classroom.

// Example:

// Client 1 connects → socket.id = "abcd1234"

// Client 2 connects → socket.id = "efgh5678"

// Even if the same client disconnects and reconnects, it will get a new socket.id.