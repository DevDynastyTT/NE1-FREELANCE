import Messages from '../models/messagesModel'
import User from '../models/userModel'

const sendMessage = async (request, response)=> {
    const { sender, senderID, receiver, receiverID, content } = request.body;
    try{
        const user = await User.findById({ _id: senderID });

        if(!user){
            console.log("User not found")
            return response.status(404).json({error: 'You aren\'t Authorized to send a message'});
        }
    
        const newMessage = await Messages.create({
            sender, senderID,
            receiver, receiverID,
            content, 
        });

        if(!newMessage){
            console.log("Message not sent")
            return response.status(500).json({error: 'Internal Server Error'});
        }
    
        return response.status(200).json({message : 'Message sent successfully'});

    }catch(error){
        console.log(error.message);
        return response.status(500).json({error: "Internal Server Error"});
    }
   
}

const receiveMessage = async (request, response)=> {
    //Sender wud be the opener of the chat, receiver wud be the person to message
    const { senderID, receiverID } = request.params;
    if(!senderID || senderID == 'undefined' || !receiverID || receiverID == 'undefined'){
        console.error('Missing sender/receiver');
        return response.status(400).json({error: 'Missing sender/receiver'});
    }

    try{

        const sender = await User.findById({ _id: senderID });
        const receiver = await User.findById({ _id: receiverID });

        //Fetch the messages that matches the sender and receiver IDs, and return them in order of date sent
        const chatMessages = await Messages.aggregate([
            {
              $match: {
                $or: [
                  { "senderID": senderID, "receiverID": receiverID },
                  { "senderID": receiverID, "receiverID": senderID },
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
            {
              $lookup: {
                from: 'users',
                localField: 'receiverID',
                foreignField: '_id',
                as: 'receiver',
              },
            },
            {
              $project: {
                "_id": 0,
                // "senderID": 1,
                "sender.username": 1,
                // "receiverID": 1,
                "receiver.username": 1,
                "content": 1,
                "sentAt": 1,
              },
            },
            { $sort: { sentAt: 1 } },
        ]);

        /*If no messages were found, we're assuming that the current chat is new and the user 
        is going to send a message */
        if (!chatMessages || chatMessages.length === 0) {
            console.log('No messages found. New chat created');
            return response.status(404).json({ message: 'Say Hello' });
          }

        let messages:any = []

        chatMessages.forEach(message => {
            message.sender = sender.username
            message.receiver = receiver.username

            messages.push(message)
        })
        return response.status(200).json({messages: chatMessages});
        
    }catch(error){
        console.log(error.message);
        return response.status(500).json({error: "Internal Server Error"});
    }

}

export {
    sendMessage,
    receiveMessage
}

// db.messages.aggregate([
//     {
//       $match: {
//         $or: [{
//           "sender": { $eq: "user1" },
//         }, {
//           "receiver": { $eq: "user2" },
//         }]
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "sender",
//         foreignField: "_id",
//         as: "sender"
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "receiver",
//         foreignField: "_id",
//         as: "receiver"
//       }
//     },
//     {
//       $project: {
//         "_id": 1,
//         "sender.name": 1,
//         "receiver.name": 1,
//         "message": 1
//       }
//     }
//   ])
  