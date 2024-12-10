const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    githubRepo: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    githubPath: {
        type: String,
        required: true,
        trim: true
    },
    altText: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const ModuleSchema = new Schema({
    moduleName: {
        type: String,
        required: true,
        trim: true
    },
    images: [ImageSchema]
});

const Module = mongoose.model('Module', ModuleSchema);

module.exports = Module;
