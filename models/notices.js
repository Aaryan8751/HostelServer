const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true 
    },
    description: {
        type: String, 
        required: true 
    },
    date: {
        type: Date, 
        required: true 
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostels'
    },
});

const Notices = mongoose.model("Notice", noticeSchema);

module.exports = Notices
