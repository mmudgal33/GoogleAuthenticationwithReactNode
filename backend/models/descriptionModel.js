
const mongoose = require('mongoose');

const descriptionSchema = new mongoose.Schema({
    
    descriptionlog: {
        type: Object,
        required: true,
    },
    
    
});

const Description = mongoose.model('description', descriptionSchema);

module.exports = Description;





// id: {
    //     type: String,
    //     required: true,
    // },
    // description: {
    //     type: String,
    //     required: true,
    // },
    // title: {
    //     type: String,
    //     required: true,
    // },