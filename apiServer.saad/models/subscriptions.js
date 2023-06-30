const mongoose = require("mongoose");

// Define the subscription schema
const subscriptionSchema = new mongoose.Schema({
    // The email field of the subscription
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

// Export the subscription model
module.exports = mongoose.model('subscription', subscriptionSchema);
