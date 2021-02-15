const mongoose = require('mongoose')

const musicTrackSchema = new mongoose.Schema({
    name: {type: String, required: true},
    artist: {type: String, required: true},
    genres: {type: [String], required: false},
    platform: {type: String, required: true},
    url_id: {type: String, required: true},
    duration: {type: Number, required: true}, //in ms
    added_on: {type: Date, required: false}
})

const Track = mongoose.model("track", musicTrackSchema)

module.exports = {musicTrackSchema};