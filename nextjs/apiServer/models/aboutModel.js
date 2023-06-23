const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
    information: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('AboutUs',aboutUsSchema);