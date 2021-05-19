const mongoose = require('mongoose');

const Playlist = mongoose.model('Playlist', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    songs:{
        type: Array,
        required: true
    },
    dateCreated: {
        type: String, 
        default: "1970"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = Playlist;