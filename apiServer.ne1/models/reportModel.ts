import mongoose from "mongoose"

const ReportJobSchema = new mongoose.Schema({
    jobID : {
        type: String,
        ref: 'jobs',
        required : true
    },
    jobTitle: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        ref: 'users',
        required: true
    },
    freelancerID: {
        type: String,
        ref: 'users',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    reportCategory: {
        type: String,   
        required: true
    }
})

module.exports = mongoose.model('ReportJob', ReportJobSchema)