import mongoose from 'mongoose';

const RatingsSchema = new mongoose.Schema({
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

const Ratings = mongoose.model('Ratings', RatingsSchema)
export default Ratings