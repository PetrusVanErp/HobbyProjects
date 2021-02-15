const mongoose = require('mongoose')

const {playlistSchema} = require("./track.js")
const {connectionsSchema} = require("./connections.js")
const {userStatsSchema} = require("./userStats.js")

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true},
    hashed_password: {type: String, required: true},
    email: {type: String, required: false},
    connections: {type: [connectionsSchema], required: false},
    following: {type: [String], required: false},
    subscribed_playlists: {type: [String], required: false},
    preferred_genres: {type: [String], required: false},
    stats: {type: userStatsSchema, required: false},
    favorite_track: {type: String, required: false}
})

const User = mongoose.model("user", userSchema)

module.exports = userSchema;