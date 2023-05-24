const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logoSchema = new Schema({
    imageId: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    googleDriveFolderId: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Logo', logoSchema)