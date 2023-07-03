import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    freeLancerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    transactionID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    paymentDetails: {
        type: String,
        required: true,
        default: "Paid"
    },
})

const Invoice = mongoose.model("Invoice", invoiceSchema)
export default Invoice