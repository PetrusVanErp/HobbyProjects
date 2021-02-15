const mongoose = require('mongoose')
require('../database/model/playlist')
require('../database/model/track')
require('../database/model/user')
require('./playlist')
const Playlist = mongoose.model('playlist')
const Track = mongoose.model('track')
const User = mongoose.model('user')

const request = require('request')
const axios = require('axios')
const express = require('express')
const bodyParser = require('body-parser')
const userRouter = express.Router()

require('dotenv').config({ path: `.env.production` })

userRouter.use(bodyParser.json())

/**
 * GET TRACKS FROM USER
 *
 * Endpoint: GET - /users/[userID]/tracks
 * Body: None
 * Response: Array of Tracks from User (JSON)
 */
userRouter.get('/:userID/tracks', async function (req, res) {
    try {
        if (req.params.userID != null) {
            const playlists = await axios.get(process.env.LINK + `/users/${req.params.userID}/playlists`).then(response => {
                return response.data
            })

            const userTracks = []

            for (var i = 0; i < playlists.length; i++) {
                const tracks = playlists[i].tracks
                for (var j = 0; j < tracks.length; j++) {
                    if (tracks[j] != null) {
                        if (!userTracks.some(track => track._id === tracks[j]._id)) {
                            userTracks.push(tracks[j])
                        }
                    }
                }
            }
            res.status(200).send(userTracks)
        }
        else {
            throw "There is no user to get tracks from"
        }
    }
    catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET PLAYLISTS BY USER
 *
 * Endpoint: GET - /users/[userID]/playlists
 * Body: None
 * Response: Array of Playlists (JSON)
 */
userRouter.get('/:userID/playlists', async function (req, res) {
    try {
        if (req.params.userID != null) {
            const userID = req.params.userID

            let subscribedPlaylistsArray = []

            await User.findById(userID).then(async user => {
                for (let i = 0; i < user.subscribed_playlists.length; i++) {
                    let subscribedPlaylist = await Playlist.findById(user.subscribed_playlists[i])
                    subscribedPlaylistsArray.push(subscribedPlaylist)
                }
            })

            const ownedPlaylists = await Playlist.find({ owner: userID }).then(playlists => {
                return playlists
            })

            const playlists = ownedPlaylists.concat(subscribedPlaylistsArray)

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
            res.status(200).send(playlistArray)
        } else {
            throw "No user to get all the playlists has been given"
        }

    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * CREATE USER
 *
 * Endpoint: POST - /users
 * Body: User (JSON)
 * Response: User (JSON)
 */
userRouter.post('/', async function (req, res) {
    try {
        if (req.body.user != null) {
            const newUser = req.body.user

            const userStats = {
                tracks: [],
                genres: []
            }

            const user = await User.create({
                name: newUser.name,
                username: newUser.username,
                hashed_password: newUser.hashed_password,
                email: newUser.email,
                following: [],
                subscribed_playlist: [],
                preferred_genres: [],
                stats: userStats
            }).catch(err => {
                throw err
            })
            req.session.user = user
            req.session.save()
            res.status(200).send(user)
        }
        else {
            throw "The data to create an user is empty"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * UPDATE USER
 *
 * Endpoint: PUT - /users/[userId]
 * Body: User (JSON)
 * Response: User (JSON)
 */
userRouter.put('/:userId', async function (req, res) {
    try {
        if (req.body.user != null) {
            const updatedUserData = req.body.user

            const user = await User.findById(req.params.userId)

            if (updatedUserData.name)
                user.name = updatedUserData.name

            if (updatedUserData.email)
                user.email = updatedUserData.email

            if (updatedUserData.hashed_password)
                user.hashed_password = updatedUserData.hashed_password

            await user.save()

            req.session.user = user
            req.session.save()
            res.status(200).send(user)
        }
        else {
            throw "No updated user data has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * ADD CONNECTION TO USER
 *
 * Endpoint: POST - /users/[userId]connections
 * Body: Connection (JSON)
 * Response: User (JSON)
 */
userRouter.post('/:userId/connections', async function (req, res) {
    try {
        if (req.body.connection != null) {
            const newConnection = req.body.connection

            const user = await User.findById(req.params.userId)

            if (newConnection.access_token != null && newConnection.refresh_token != null) {
                user.connections.forEach(c => {
                    if (c.platform.toLowerCase() === newConnection.platform.toLowerCase())
                        throw "Connection for platform " + c.platform + " already set"
                })

                user.connections.push(newConnection)
                await user.save()
                req.session.user = user
                req.session.save()

                res.status(200).send(user)
            }
            else {
                throw "One (or more) of the specified tokens are empty"
            }
        } else {
            throw "No new connection has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * LOG IN A USER
 *
 * Endpoint: POST - /users/login
 * Body: User (JSON)
 * Response: User (JSON)
 */
userRouter.post('/login', async function (req, res) {
    try {
        delete req.session.user

        if (req.body.user != null) {
            const userLoggingIn = req.body.user
            const user = await User.findOne({ username: userLoggingIn.username })
            const correctPassword = user.hashed_password === userLoggingIn.hashed_password

            if (correctPassword) {
                req.session.user = user
                req.session.save()
                res.status(200).send(user)
            } else {
                throw "Could not log in. Wrong credentials"
            }
        }
        else {
            throw "No user to log in has been given"
        }

    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * LOG OUT A USER
 *
 * Endpoint: DELETE - /users/logout
 * Body: None
 * Response: Statuscode 200
 */
userRouter.delete('/logout', async function (req, res) {
    try {
        delete req.session.user
        res.status(200).send("User logged out")
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET THE LOGGED IN USER
 *
 * Endpoint: GET - /users/active
 * Body: None
 * Response: User (JSON)
 */
userRouter.get('/active', function (req, res) {
    try {
        if (req.session.user !== undefined) res.status(200).send(req.session.user)
        else throw "Could not get the current user. You are probably not logged in"
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET USER BY ID
 *
 * Endpoint: GET - /users/[userID]
 * Body: None
 * Response: User (JSON)
 */
userRouter.get('/:userID', async function (req, res) {
    try {
        if (req.params.userID != null) {
            const user = await User.findById(req.params.userID)

            if (user == null) {
                throw "User not found!"
            }
            else {
                res.status(200).send(user.toJSON())
            }
        }
        else {
            throw "No user ID has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET FOLLOWING USERS BY USER ID
 *
 * Endpoint: GET - /users/[userID]/following
 * Body: None
 * Response: User (JSON)
 */
userRouter.get('/:userID/following', async function (req, res) {
    try {
        if (req.params.userID != null) {
            const user = await User.findById(req.params.userID)

            if (user == null) {
                throw "User not found!"
            }
            else {
                //get all following users
                let friends = []
                let friend = {}
                for (let i = 0; i < user.following.length; i++) {
                    friend = await User.findById(user.following[i])
                    friends.push(friend)
                }

                res.status(200).send(friends)
            }
        }
        else {
            throw "No user ID has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET USER BY USERNAME
 *
 * Endpoint: GET - /users/username/[username]
 * Body: None
 * Response: User (JSON)
 */
userRouter.get('/username/:username', async function (req, res) {
    try {
        if (req.params.username != null) {
            const user = await User.findOne({ username: req.params.username })

            if (user === null) {
                throw "User not found!"
            }
            else {
                res.status(200).send(user.toJSON())
            }
        }
        else {
            throw "No username has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * FOLLOW PLAYLIST
 *
 * Endpoint: PUT - /users/[username]/playlist
 * Body: Playlist (JSON)
 * Response: Statuscode 200
 */
userRouter.put('/:username/playlist', async function (req, res) {
    try {
        if (req.body.playlist != null) {
            const playlist = req.body.playlist
            if (req.params.username != null) {
                const user = await User.findOne({ username: req.params.username }).then(async user => {
                    if (await checkIfPlaylistExists(playlist)) {
                        user.subscribed_playlists.push(playlist._id)
                        user.save()
                        return user
                    }
                    else {
                        throw "The followed playlist does not exist"
                    }
                })

                if (user !== null) {
                    req.session.user = user
                    req.session.save()
                    res.status(200).send()
                }
                else {
                    throw "This user does not exist"
                }
            }
            else {
                throw "The current user has not been given"
            }
        }
        else {
            throw "No playlist has been given to follow"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * UNFOLLOW PLAYLIST
 *
 * Endpoint: DELETE - /users/[username]/playlist
 * Body: Playlist (JSON)
 * Response: Statuscode 200
 */

userRouter.delete('/:username/playlist', async function (req, res) {
    try {
        if (req.body.playlist != null) {
            const playlist = req.body.playlist
            if (await checkIfPlaylistExists(playlist)) {
                const user = await User.updateOne({ username: req.params.username }, { $pull: { "subscribed_playlists": playlist._id } })
                if (user != null) {
                    req.session.user = user
                    req.session.save()
                    res.status(200).send()
                }
                else {
                    throw "The user to unfollow this playlist does not exist"
                }
            }
            else {
                throw "The playlist does not exist"
            }
        } else {
            throw "No playlist has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * CHECK IF USER FOLLOWS THE PLAYLIST
 *
 * Endpoint: GET - /users/[userId]/playlist/[playlistId]
 * Body: none
 * Response: Statuscode 200
 */

userRouter.get('/:userId/playlist/:playlistId', async function (req, res) {
    try {
        if (req.params.userId != null) {
            if (req.params.playlistId != null) {
                const playlistId = req.params.playlistId
                const response = await User.findOne({ _id: req.params.userId, subscribed_playlists: { $in: [playlistId] } })
                if (response != null) {
                    res.status(200).send()
                }
                else {
                    throw "Playlist does not exist"
                }
            }
            else {
                throw "No playlist has been given"
            }
        }
        else {
            throw "Current user has not been given"
        }
    }
    catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * FOLLOW USER
 *
 * Endpoint: PUT - /users/[username]/follow
 * Body: followedUser (JSON)
 * Response: Statuscode 200 + Object (user)
 */
userRouter.put('/:username/follow', async function (req, res) {
    try {
        if (req.params.username != null) {
            if (req.body.followedUser._id != null) {
                const user = await User.findOne({ username: req.params.username }).then(user => {
                    user.following.push(req.body.followedUser._id)
                    user.save()
                    return user
                })

                if (user != null) {
                    req.session.user = user
                    req.session.save()
                    res.status(200).send(user)
                }
                else {
                    throw "User does not exist"
                }
            }
            else {
                throw "No user to follow has been given"
            }
        }
        else {
            throw "No username of the current user has been given"
        }
    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * UNFOLLOW USER
 *
 * Endpoint: DELETE - /users/:username
 * Body: The unfollowed user (JSON)
 * Response: Statuscode 200
 */
userRouter.delete('/:username', async function (req, res) {
    try {
        if (req.params.username != null) {
            if (req.body.unFollowedUser._id != null) {
                const user = await User.updateOne({ username: req.params.username }, { $pull: { "following": req.body.unFollowedUser._id } })
                if (user != null) {
                    req.session.user = user
                    req.session.save()
                    res.status(200).send()
                }
                else {
                    throw "The user to unfollow does not exist"
                }
            }
            else {
                throw "No user to unfollow has been given"
            }
        }
        else {
            throw "No username of the current user has been given"
        }

    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * CHECK IF USER FOLLOWS SOMEONE
 *
 * Endpoint: GET - /users/[userId]/following/[followedUserId]
 * Body: none
 * Response: Statuscode 200
 */

userRouter.get('/:userId/following/:followedUserId', async function (req, res) {
    try {
        if (req.params.userId != null) {
            if (req.params.followedUserId != null) {
                const response = await User.findOne({ _id: req.params.userId, following: { $in: [req.params.followedUserId] } })
                if (response != null) {
                    res.status(200).send()
                }
                else {
                    res.status(204).send()
                }
            }
            else {
                throw "No followed user has been given"
            }
        }
        else {
            throw "No userID of the current user has been given"
        }
    }
    catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})


/**
 * SPOTIFY TOKEN REQUEST
 *
 * Endpoint: POST - /users/token
 * Body: none
 * Response: Statuscode 200
 */
userRouter.post('/token', async function (req, res) {
    try {
        const data = req.body.data
        await request({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + data.authorization,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code&code=${data.code}&redirect_uri=${data.redirect_uri}`
        }, function (error, response, data) {
            if (error) throw 'Spotify API token request error' + error
            res.status(200).send(data)
        })
    }
    catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET STATS FROM A USER
 *
 * Endpoint: GET - /users/[userId]/stats
 * Body: none
 * Response: userStats (JSON)
 */
userRouter.get('/:userId/stats', async function (req, res) {
    try {
        const user = await User.findById(req.params.userId)
        if (user === null) throw "User not found"
        const userStats = user.stats
        const genres = userStats.genres
        const tracks = userStats.tracks

        //Artists
        let artists = []
        let allTracks = []
        for (let track of tracks) {
            let foundTrack = await Track.findById(track.track)
            if (foundTrack != null) {
                foundTrack = foundTrack.toObject()
                foundTrack.count = track.count
                allTracks.push(foundTrack)
            }
        }

        allTracks.forEach(track => {
            let foundIndexOfArtist = artists.findIndex(function (element, index) {
                return element.artist === track.artist
            })

            if (foundIndexOfArtist === -1) {
                artists.push({
                    artist: track.artist,
                    count: track.count
                })
            }
            else {
                artists[foundIndexOfArtist].count += track.count
            }
        })

        let top10Artists = insertionSort(artists).splice(-10)

        //Genres
        let top10Genres = insertionSort(genres).splice(-10)

        //Tracks
        let trackList = insertionSort(tracks).splice(-10)
        let top10Tracks = []

        for (const track of trackList) {
            let foundTrack = await Track.findById(track.track)
            foundTrack = foundTrack.toObject()
            foundTrack.count = track.count
            top10Tracks.push(foundTrack)
        }

        let responseObject = {
            genres: top10Genres,
            tracks: top10Tracks,
            artists: top10Artists
        }
        res.status(200).send(responseObject)

    }
    catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * ADD A TRACK TO USER STATS AND/OR RAISE THE COUNT
 *
 * Endpoint: PUT - /users/[userId]/stats
 * Body: The ID of the specified track (track_id) (JSON)
 * Response: Statuscode 200
 */
userRouter.put('/:userId/stats', async function (req, res) {
    try {
        const user = await User.findById(req.params.userId)
        if (user == null) throw "Cannot find user"
        if (req.body.track_id == null) throw "No track specified in the body"

        const track = await Track.findById(req.body.track_id)
        let userStatsTracks = user.stats.tracks

        //Track
        let foundIndexOfTrack = userStatsTracks.findIndex(function (element, index) {
            return element.track == track._id
        })

        if (foundIndexOfTrack === -1) {
            user.stats.tracks.push({ track: track._id, count: 1 })
        }
        else {
            user.stats.tracks[foundIndexOfTrack].track = track._id
            user.stats.tracks[foundIndexOfTrack].count += 1
        }

        //Genres
        track.genres.forEach(async (trackGenre) => {
            let foundIndexOfGenre = user.stats.genres.findIndex(function (element, index) {
                return element.genre == trackGenre
            })

            if (foundIndexOfGenre === -1) {
                user.stats.genres.push({ genre: trackGenre, count: 1 })
            }
            else {
                user.stats.genres[foundIndexOfGenre].genre = trackGenre
                user.stats.genres[foundIndexOfGenre].count += 1
            }
        })

        await user.save()
        req.session.user = user
        req.session.save()
        res.status(200).send()

    } catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * SET FAVORITE TRACK FOR USER
 *
 * Endpoint: PUT - /users/[userID]/favoriteTrack
 * Body: Favorite Track (JSON)
 * Response: Statuscode 200
 */

userRouter.put('/:userID/favoriteTrack', async function (req, res) {
    try {
        if (req.params.userID != null) {
            const user = await User.findById(req.params.userID)

            user.favorite_track = req.body.favorite_track._id
            await user.save()

            res.status(200).send("New favorite track has been successfully set")
        }
        else {
            throw "No user has been given to set a favorite track"
        }
    }
    catch (err) {
        res.status(500).send("Whoops, something went wrong: " + err)
    }
})

/**
 * GET FOLLOWED PLAYLISTS
 *
 * Endpoint: POST - /users/followedPlaylists
 * Body: Array of playlist-IDs (JSON)
 * Response: Array of playlists (JSON)
 */

userRouter.post('/followedPlaylists', async function (req, res) {
    try {
        const playlistIDs = req.body.followed_playlists
        if (playlistIDs) {
            const playlists = []
            for (var i = 0; i < playlistIDs.length; i++) {
                let playlist = await axios.get(process.env.LINK + `/playlists/${playlistIDs[i]}`).then(response => {
                    return response.data
                })

                let playlistOwner = await axios.get(process.env.LINK + `/users/${playlist.owner}`).then(response => {
                    return response.data
                })

                playlist.ownerName = playlistOwner.username
                playlists.push(playlist)
            }
            res.status(200).send(playlists)
        }
        else {
            throw "No followed playlists to get data of"
        }
    }
    catch (err) {
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


async function checkIfPlaylistExists(playlist) {
    const getPlaylist = await Playlist.findOne({ name: playlist.name, owner: playlist.owner })
    if (getPlaylist != null) {
        return true
    }
    else {
        return false
    }
}


module.exports = userRouter;
