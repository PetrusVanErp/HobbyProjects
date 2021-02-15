const mongoose = require('mongoose')
require('../database/model/playlist')
require('../database/model/track')
require('../database/model/user')
const Playlist = mongoose.model('playlist')
const Track = mongoose.model('track')
const User = mongoose.model('user')

const express = require('express')
const bodyParser = require('body-parser')
const playlistRouter = express.Router()

playlistRouter.use(bodyParser.json())

/**
 * SAVE NEW TRACKS
 *
 * Endpoint: POST - /playlists/tracks
 * Body: Array of Tracks (JSON)
 * Response: Array of Tracks (JSON)
 */
playlistRouter.post('/tracks', async function (req, res) {
    try {
        const tracks = req.body.tracks

        let trackList = []

        for (let i = 0; i < tracks.length; i++) {
            let foundTrack = await getTrack(tracks[i])

            if (foundTrack === null) {
                const dbTrack = await Track.create({
                    name: tracks[i].name.trim(),
                    artist: tracks[i].artist.trim(),
                    genres: tracks[i].genres,
                    platform: tracks[i].platform.trim().toLowerCase(),
                    url_id: tracks[i].url_id.trim(),
                    duration: tracks[i].duration,
                    added_on: tracks[i].added_on
                }).catch(() => {
                    throw "Could not create track"
                })
                trackList.push(dbTrack)
            } else {
                trackList.push(foundTrack)
            }
        }

        res.status(200).send(trackList)
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * CREATE NEW PLAYLIST
 *
 * Endpoint: POST - /playlists
 * Body: Array of Tracks (JSON)
 * Response: Array of Tracks (JSON)
 */
playlistRouter.post('/', async function (req, res) {
    try {
        if (req.body.playlist != null) {
            const playlist = req.body.playlist
            let foundPlaylist = await getPlaylist(playlist)

            let dbPlaylist = {}

            if (foundPlaylist === null) {
                const newPlaylist = await Playlist.create({
                    name: playlist.name,
                    description: playlist.description,
                    owner: playlist.owner,
                    tracks: playlist.tracks
                }).catch(() => {
                    throw "Could not create playlist"
                })
                dbPlaylist = newPlaylist

                res.status(200).send(dbPlaylist)
            } else {
                throw "Playlist already exists!"
            }
        }
        else {
            throw "No playlist to create has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * UPDATE PLAYLIST
 *
 * Endpoint: PUT - /playlists/[playlistID]
 * Body: Playlist (JSON)
 * Response: Statuscode 200
 */
playlistRouter.put('/:playlistID', async function (req, res) {
    try {
        if (req.params.playlistID != null) {
            const playlistID = req.params.playlistID
            const playlist = req.body.playlist
            const originalPlaylist = await Playlist.findById(playlistID)

            if (originalPlaylist !== null) {
                await Playlist.findByIdAndUpdate(originalPlaylist._id, {
                    $set: {
                        name: playlist.name,
                        description: playlist.description,
                        image_url: playlist.image_url,
                        tracks: playlist.tracks
                    }
                }).then(() => {
                    res.status(200).send("Playlist updated")
                }).catch(err => {
                    throw "Couldn't update playlist, because of: " + err
                })
            } else {
                throw "Couldn't find playlist with _id " + playlistID
            }
        }
        else {
            throw "No playlist to update has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * ADD TRACK TO PLAYLIST
 *
 * Endpoint: POST - /playlists/[playlistID]/tracks
 * Body: Playlist (JSON)
 * Response: Statuscode 200
 */
playlistRouter.post('/:playlistID/tracks', async function (req, res) {
    try {
        if (req.params.playlistID != null) {
            const playlistID = req.params.playlistID
            const track = req.body.track

            if (track != null) {
                const foundTrack = await getTrack(track)

                let trackID = null

                if (foundTrack === null) {
                    const dbTrack = await Track.create({
                        name: track.name,
                        artist: track.artist,
                        genres: track.genres,
                        platform: track.platform,
                        url_id: track.url_id,
                        duration: track.duration,
                        added_on: track.added_on
                    }).catch(err => {
                        throw "Could not create track, because of: " + err
                    })
                    trackID = dbTrack._id
                } else {
                    trackID = foundTrack._id
                }

                const filter = { _id: playlistID }
                const update = { $push: { tracks: trackID } }

                await Playlist.findOneAndUpdate(filter, update).then(() => {
                    res.status(200).send("Track added to playlist")
                }).catch(() => {
                    throw "Couldn't add track(s) to the specified playlist"
                })
            }
            else {
                throw "No track has been given"
            }
        }
        else {
            throw "No playlist to add a track has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * REMOVE TRACK FROM PLAYLIST
 *
 * Endpoint: DELETE - /playlists/[playlistID]/tracks/[trackID]
 * Body: None
 * Response: Statuscode 200
 */
playlistRouter.delete('/:playlistID/tracks/:trackID', async function (req, res) {
    try {
        if (req.params.playlistID != null) {
            const playlistID = req.params.playlistID
            if (req.params.trackID != null) {
                const trackID = req.params.trackID

                await Playlist.updateOne({ _id: playlistID },
                    { $pull: { "tracks": trackID } }).then(() => {
                        res.status(200).send("Track removed")
                    }).catch(err => {
                        throw "Cannot remove the track from the playlist: " + err
                    })
            }
            else {
                throw "No track to remove has been given"
            }
        }
        else {
            throw "No playlist to remove a track from has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * DELETE PLAYLIST
 *
 * Endpoint: DELETE - /playlists/[playlistID]
 * Body: None
 * Response: Statuscode 200
 */
playlistRouter.delete('/:playlistID', async function (req, res) {
    try {
        if (req.params.playlistID != null) {
            const playlistID = req.params.playlistID
            await Playlist.findByIdAndDelete(playlistID)

            await User.updateOne({ subscribed_playlists: { $in: [playlistID] } },
                { $pull: { "subscribed_playlists": playlistID } }).catch(() => {
                    throw "Subscribed playlist of a user to delete doesn't exist"
                })

            res.status(200).send("Playlist deleted")
        }
        else {
            throw "No playlist to delete has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET PLAYLIST BY ID
 *
 * Endpoint: GET - /playlists/[playlistID]
 * Body: None
 * Response: Playlist (JSON)
 */
playlistRouter.get('/:playlistID', async function (req, res) {
    try {
        if (req.params.playlistID != null) {
            let playlistInfo = {}
            const playlistID = req.params.playlistID

            const playlist = await Playlist.findById(playlistID).then(playlist => {
                return playlist
            })

            if (playlist != null) {
                const trackIds = playlist.tracks

                let tracks = []

                for (let i = 0; i < trackIds.length; i++) {
                    await Track.findById(trackIds[i]).then(track => {
                        tracks.push(track)
                    })
                }

                playlistInfo = {
                    _id: playlist._id,
                    name: playlist.name,
                    description: playlist.description,
                    owner: playlist.owner,
                    tracks: tracks
                }

                res.status(200).send(playlistInfo)
            }
            else {
                throw "The specified playlist cannot be found in the database"
            }
        }
        else {
            throw "No playlist has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})


//Get track
async function getTrack(track) {

    const url_id = track.url_id
    const platform = track.platform
    return await Track.findOne({ url_id: url_id, platform: platform })
}

//Get playlist
async function getPlaylist(playlist) {

    const playlistName = playlist.name
    const owner = playlist.owner
    return await Playlist.findOne({ name: playlistName, owner: owner })
}

module.exports = playlistRouter;