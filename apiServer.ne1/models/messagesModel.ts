import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: [true, 'Sender must be authenticated to send a message']
    },
    senderID: {
        type: String,
        required: [true, 'Sender must be authenticated to send a message']
    },
    receiver: {
        type: String,
        required: [true, 'Receiver must be authenticated to send a message']
    },
    receiverID: {
        type: String,
        required: [true, 'Receiver must be authenticated to send a message']
    },
    content: {
        type: String,
        required: [true, 'Cannot send a blank message']
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
})

const Messages = mongoose.model('Messages', messageSchema)
export default Messages
