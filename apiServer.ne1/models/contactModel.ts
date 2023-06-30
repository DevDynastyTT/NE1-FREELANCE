import mongoose from 'mongoose';

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Contact', contactUsSchema);
