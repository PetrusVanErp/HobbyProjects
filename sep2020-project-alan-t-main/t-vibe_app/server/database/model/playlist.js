const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    owner: {type: String, required: true},
    image_url: {type: String, required: false},
    tracks: {type: [String], required: false},
})

const Playlist = mongoose.model("playlist", playlistSchema)

module.exports = {playlistSchema};