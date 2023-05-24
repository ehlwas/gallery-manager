const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const colorSchema = new Schema({
    navColor: {
        type: String,
    },
    bodyColor: {
        type: String,
    },
    googleDriveFolderId: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Color', colorSchema)