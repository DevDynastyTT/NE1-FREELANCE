import mongoose from 'mongoose'
import Messages from '../models/messagesModel'
import User from '../models/userModel'
const AWS = require('aws-sdk')
const bucketName = 'ne1-freelance' // Replace with your Wasabi bucket name

// Configure Wasabi credentials
AWS.config.update({
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY_ID,
})

// Create a new instance of the S3 client
const s3 = new AWS.S3({
  endpoint: process.env.SECRET_ENDPOINT,
})
const sendMessage = async (request, response)=> {
    const { sender, senderID, receiver, receiverID, content } = request.body
    const file = request.file

    try{
        const user = await User.findById({ _id: senderID })

        if(!user){
            console.log("User not found")
            return response.status(404).json({error: 'You aren\'t Authorized to send a message'})
        }
    

        //Check if a chat between sender and receiver already exists
        const existingChat = await Messages.findOne({
          $or: [
            { senderID: senderID, receiverID: receiverID },
            { senderID: receiverID, receiverID: senderID }
          ]
        })

        let chatID = existingChat ? existingChat.chatID : new mongoose.Types.ObjectId()
         
        let newMessageData:any = {
          chatID,
          sender,
          senderID,
          receiver,
          receiverID,
          content,
        }
    
        // If there is a file, add it to the newMessageData and upload to wasabi
        if (file) {
           // Upload the file to Wasabi
           const params = {
            Bucket: bucketName,
            Key: Date.now() + '-' + request.file.originalname,
            Body: request.file.buffer,
          }
          const uploadResult = await s3.upload(params).promise()
          newMessageData.file = uploadResult.Key
        }
    
        const newMessage = await Messages.create(newMessageData)
    

        if(!newMessage){
            console.log("Message not sent")
            return response.status(500).json({error: 'Internal Server Error'})
        }
    
        const messageWithFileUrl = await Messages.findOne({_id: newMessage._id})
        newMessage.file = await getFileUrl(newMessageData.file)

        return response.status(200).json({ fileName: newMessageData.file, fileUrl: newMessage.file })

    }catch(error){
        console.log(error.message)
        return response.status(500).json({error: "Internal Server Error"})
    }
   
}
const receiveMessage = async (request, response)=> {
    //Sender wud be the opener of the chat, receiver wud be the person to message
    const { senderID, receiverID } = request.params
    if(!senderID || senderID == 'undefined' || !receiverID || receiverID == 'undefined'){
        console.error('Missing sender/receiver')
        return response.status(400).json({error: 'Missing sender/receiver'})
    }

    try{
        //Fetch the messages that matches the sender and receiver IDs, and return them in order of date sent
        const chatMessages:any = await Messages.aggregate([
            {
              $match: {
                $or: [
                  { senderID: { $eq: new mongoose.Types.ObjectId(senderID) }, receiverID: { $eq: new mongoose.Types.ObjectId(receiverID) } },
                  { senderID: { $eq: new mongoose.Types.ObjectId(receiverID) }, receiverID: { $eq: new mongoose.Types.ObjectId(senderID) } }
                ],
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'senderID',
                foreignField: '_id',
                as: 'sender',
              },
            },
            {$unwind:  '$sender'},
            {
              $lookup: {
                from: 'users',
                localField: 'receiverID',
                foreignField: '_id',
                as: 'receiver',
              },
            },
            {$unwind:  '$receiver'},
            {
              $project: {
                "_id": 0,
                "senderID": 1,
                "sender": "$sender.username",
                "receiverID": 1,
                "receiver": "$receiver.username",
                "content": 1,
                "file": 1,
                "sentAt": 1,
              },
            },
            { $sort: { sentAt: 1 } },
        ])

         
        //  console.log(chatMessages)
        const newMessages = await Promise.all (chatMessages.map(async (message: any) => {
          if(message.file){
            message.file = {
              name: message.file,
              url: await getFileUrl(message.file)
            }
          }
          return message
        }))

        return response.status(200).json({messages: newMessages})
        
    }catch(error){
        console.log(error.message)
        return response.status(500).json({error: "Internal Server Error"})
    }

}

const getFileUrl = async (fileName:string): Promise<string> => {
  try {
    const bucketName = 'ne1-freelance' // Replace with your Wasabi bucket name
    // Generate a pre-signed URL for the profile picture
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 3600, // URL expiration time in seconds (e.g., 1 hour)
    }

    const signedUrl = await s3.getSignedUrlPromise('getObject', params)
    // Return the pre-signed URL in the response
    return signedUrl
  } catch (error) {
    console.error(error)
    return 'undefined'
  }
}
const searchUsers = async (request, response) => {
  const { keyword } = request.params
  try {
    const userInfo = await User.find({ username: { $regex: keyword, $options: 'i' } })

    if(!userInfo){
      console.log('Users not found')
      return response.status(404).json({ error: 'Users not found' })
    }
    return response.status(200).json({userInfo})
  } catch (error) {
    console.error(error.message)
    return response.status(500).json({ error: 'Internal Server Error' })
  }
}

const getReceiver = async (request, response) => {
  const { id } = request.params
  try {
    const user = await User.findById({ _id: new mongoose.Types.ObjectId(id) })
    if(!user){
      console.log('Receiver not found')
      return response.status(404).json({ error: 'Receiver not found' })
    }

    return response.status(200).json({receiver:user})
  }catch(error){
    console.error(error.message)
    return response.status(500).json({ error: 'Internal Server Error' })
  }
}

export {
    sendMessage,
    receiveMessage,
    searchUsers,
    getReceiver
}