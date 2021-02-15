const mongoose = require('mongoose')

const connectionsSchema = new mongoose.Schema({
    platform: { type: String, required: true },
    access_token: { type: String, required: true},
    refresh_token: { type: String, required: false}
})

const Connection = mongoose.model("connection", connectionsSchema)

module.exports = connectionsSchema;

