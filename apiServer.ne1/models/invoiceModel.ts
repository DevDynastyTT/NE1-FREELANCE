import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    payment_details: {
        type: String,
        required: true,
        default: "Paid"
    },
})

const Invoice = mongoose.model("Invoice", invoiceSchema)
export default Invoice