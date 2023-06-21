const mongoose = require('mongoose');

const RatingsSchema = mongoose.Schema({
        jobID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jobs',
            required: true
        },
        freeLancerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        ratings: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        feedback: {
            type: String,
            maxlength: 255,
            required: false
        },
        date: {
            type: Date,
            default: Date.now
        }

        
    }
)

module.exports = mongoose.model('Ratings', RatingsSchema)