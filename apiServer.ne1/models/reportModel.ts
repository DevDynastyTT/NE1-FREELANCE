import mongoose from "mongoose"

const ReportJobSchema = new mongoose.Schema({
    job_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs',
        required : true
    },
    jobTitle: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
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