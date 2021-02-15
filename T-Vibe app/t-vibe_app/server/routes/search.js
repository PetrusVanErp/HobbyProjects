const mongoose = require('mongoose')
require('../database/model/playlist')
require('../database/model/user')
require('../database/model/track')
const Playlist = mongoose.model('playlist')
const User = mongoose.model('user')
const Track = mongoose.model('track')

const express = require('express')
const bodyParser = require('body-parser')
const searchRouter = express.Router()

searchRouter.use(bodyParser.json())

/**
 * GET PLAYLISTS AND USERS BY SEARCHTERM
 * 
 * Endpoint: GET - /search/[searchTerm]
 * Body: none
 * Response: Statuscode 200, search results object (JSON)
 */

searchRouter.get("/:searchTerm", async function (req, res) {
    try {
        if (req.params.searchTerm === "") {
            throw "Searchterm is empty"
        }
        else {
            const searchTerm = req.params.searchTerm

            const playlistResponse = await Playlist.find({ name: { $regex: new RegExp(searchTerm, "i") } })
            const userResponse = await User.find({ username: { $regex: new RegExp(searchTerm, "i") } })
            if (playlistResponse == null && userResponse == null) {
                throw "There are no playlists and users found"
            }
            else {
                const playlistArray = await getPlaylistArray(playlistResponse)
                let searchResults = {
                    playlists: playlistArray,
                    users: userResponse
                }
                res.status(200).send(searchResults)
            }
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }

})

/**
 * GET RANDOM PLAYLISTS
 * 
 * Endpoint: GET - /search/[userID]/random
 * Body: none
 * Response: Statuscode 200, playlists object (JSON)
 */
searchRouter.get('/:userID/random', async function (req, res) {
    try {
        if (req.params.userID != null) {
            const randomPlaylists = await Playlist.aggregate(
                [{ $match: { owner: { $ne: req.params.userID } } },
                { $sample: { size: 5 } }]
            )

            if (randomPlaylists == null) {
                throw "There are no playlists, with the specified searchterm, found"
            }
            else {
                const randomPlaylistsArray = await getPlaylistArray(randomPlaylists)

                res.status(200).send(randomPlaylistsArray)
            }
        }
        else {
            throw "No current user has been given"
        }
    }
    catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

//Get playlist array
async function getPlaylistArray(playlists) {
    let playlistArray = []

    for (let i = 0; i < playlists.length; i++) {

        let trackArray = []
        let tracks = playlists[i].tracks

        let tracksArray = Object.values(tracks)

        for (let j = 0; j < tracksArray.length; j++) {
            await Track.findById(tracksArray[j]).then(response => {
                if (response !== null) {
                    trackArray.push(response)
                }
            })
        }

        let playlist = {
            _id: playlists[i]._id,
            name: playlists[i].name,
            description: playlists[i].description,
            owner: playlists[i].owner,
            image_url: playlists[i].image_url,
            tracks: trackArray
        }

        playlistArray.push(playlist)
    }

    return playlistArray
}

module.exports = searchRouter;