import mongoose from 'mongoose';

const aboutUsSchema = new mongoose.Schema({
    information: {
        type: String,
        required: true
    },
    update: {
        type: Number,
        required: true
    }
});
const AboutUs = mongoose.model('AboutUs',aboutUsSchema);
export default AboutUs