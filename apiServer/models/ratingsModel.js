const mongoose = require('mongoose');

const RatingsSchema = mongoose.Schema({
        jobID: {
            type: String,
            ref: 'jobs',
            required: true
        },
        freeLancerID: {
            type: String,
            ref: 'users',
            required: true
        },
        userID: {
            type: String,
            ref: 'users',
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