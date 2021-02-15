const mongoose = require('mongoose')

const userStatsSchema = new mongoose.Schema({
    tracks: {
        type: [
            {
                track: {type: String, required: true},
                count: {type: Number, required: false}
            }
        ],
        required: true
    },
    genres: {
        type: [
            {
                genre: {type: String, required: true},
                count: {type: Number, required: true}
            }
        ],
        required: true
    }
})

const UserStats = mongoose.model("userStats", userStatsSchema)


module.exports = {userStatsSchema};