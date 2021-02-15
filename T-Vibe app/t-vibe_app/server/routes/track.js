const mongoose = require('mongoose')
require('../database/model/playlist')
require('../database/model/track')
require('../database/model/user')
const Track = mongoose.model('track')
const User = mongoose.model('user')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const trackRouter = express.Router()

trackRouter.use(cors())
trackRouter.use(bodyParser.json())

/**
 * GET TRACK
 *
 * Endpoint: GET - /tracks/track/[trackID]
 * Body: Favorite Track (JSON)
 * Response: Statuscode 200
 */

trackRouter.get('/track/:trackID', async function (req, res) {
    try {
        if (req.params.trackID != null) {
            const track = await Track.findById(req.params.trackID)

            if (track != null) {
                res.status(200).send(track)
            }
            else {
                res.status(404).send("Could not find track with that id")
            }
        }
        else {
            throw "No id for a track was given";
        }
    }
    catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET GENRES FROM ALL TRACKS
 *
 * Endpoint: GET - /tracks/genres
 * Body: None
 * Response: Array of Genres (JSON)
 */

trackRouter.get('/genres', async function (req, res) {
    try {
        let genres = []
        const tracks = await Track.find({})

        tracks.forEach(track => {
            track.genres.forEach(genre => {
                genres.push(genre)
            })
        })

        genres = genres.reduce((unique, item) => {
            return unique.includes(item) ? unique : [...unique, item]
        }, [])

        if (tracks === null) {
            throw "Tracks not found!"
        }

        res.status(200).send(genres)
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET TRACKS BY GENRE
 *
 * Endpoint: GET - /tracks/genres/[genre]
 * Body: None
 * Response: Array of Tracks (JSON)
 */
trackRouter.get('/genres/:genre', async function (req, res) {
    try {
        if (req.params.genre != null) {

            const tracks = await Track.find({ "genres": { "$in": req.params.genre } })

            if (tracks === null) {
                throw "Tracks not found!"
            }
            res.status(200).send(tracks)
        } else {
            throw "No genre to get tracks has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET SOUNDCLOUD TRACK
 *
 * Endpoint: POST - /tracks/soundCloudTrack
 * Body: soundCloudTrack
 * Response: A track (JSON)
 */
trackRouter.post('/soundCloudTrack', async function (req, res) {
    try {
        const trackUri = req.body.soundCloudTrack.trackUri
        const clientId = req.body.soundCloudTrack.clientId

        const trackInfoUrl = "http://api-v2.soundcloud.com/resolve?url=" + trackUri + "&client_id=" + clientId

        const data = await axios.get(trackInfoUrl).then(response => {
            return response.data
        })

        if (data != null) {
            res.status(200).send(data)
        } else {
            throw "SoundCloud API can't give a response back right now"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET TOP 10 TRENDINGS
 *
 * Endpoint: GET - /tracks/trending
 * Body: None
 * Response: An object consisting of an array of tracks, array of artists, array of genres (JSON)
 */
trackRouter.get('/trending', async function (req, res) {
    try {
        const users = await User.find()

        let allTracks = []

        for (const user of users) {
            const userTracks = user.stats.tracks
            for (const trackStat of userTracks) {
                let foundIndexOfTrack = allTracks.findIndex((element, index) => {
                    return element.track === trackStat.track
                })

                if (foundIndexOfTrack === -1) {
                    allTracks.push(trackStat)
                } else {
                    allTracks[foundIndexOfTrack].count += trackStat.count
                }
            }
        }

        let top10tracks = []
        let trackList = insertionSort(allTracks)

        for (const track of trackList) {
            let foundTrack = await Track.findById(track.track)
            if(foundTrack){
                foundTrack = foundTrack.toObject()
                foundTrack.count = track.count
                if(!top10tracks.some(track => track.url_id === foundTrack.url_id)){
                    top10tracks.push(foundTrack)
                }
            }
        }

        let top10artists = []

        for (const track of top10tracks) {
            let foundIndexOfArtist = top10artists.findIndex((element, index) => {
                return element.artist === track.artist
            })

            if (foundIndexOfArtist === -1) {
                top10artists.push({
                    artist: track.artist,
                    count: track.count
                })
            } else {
                top10artists[foundIndexOfArtist].count += track.count
            }
        }

        top10artists = insertionSort(top10artists)

        let top10genres = []

        for (const track of top10tracks) {
            track.genres.forEach(genre => {
                let foundIndexOfGenre = top10genres.findIndex((element, index) => {
                    return element.genre === genre
                })

                if (foundIndexOfGenre === -1) {
                    top10genres.push({
                        genre: genre,
                        count: track.count
                    })
                } else {
                    top10genres[foundIndexOfGenre].count += track.count
                }
            })
        }

        top10genres = insertionSort(top10genres)

        const result = {
            tracks: top10tracks,
            artists: top10artists,
            genres: top10genres
        }
        res.status(200).send(result)
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})


/**
 * GET TRACKS BY ARTIST
 *
 * Endpoint: GET - /tracks/artists/[artist]
 * Body: None
 * Response: Array of Tracks (JSON)
 */
trackRouter.get('/artists/:artist', async function (req, res) {
    try {
        if (req.params.artist != null) {
            const tracks = await Track.find({ "artist": req.params.artist })

            if (tracks === null) {
                throw "Tracks not found!"
            } else {
                res.status(200).send(tracks)
            }
        } else {
            throw "No artist to get tracks has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})


function insertionSort(inputArr) {
    let n = inputArr.length
    for (let i = 1; i < n; i++) {
        // Choosing the first element in our unsorted subarray
        let current = inputArr[i]
        // The last element of our sorted subarray
        let j = i - 1
        while ((j > -1) && (current.count > inputArr[j].count)) {
            inputArr[j + 1] = inputArr[j]
            j--
        }
        inputArr[j + 1] = current
    }
    return inputArr
}


module.exports = trackRouter;