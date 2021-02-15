const { app, clearTVibeTestDatabase, initializeTVibeTestDatabase } = require("../server")

require('dotenv').config({ path: ".env" })

const request = require('supertest')
const mongoose = require('mongoose')
require('../database/model/playlist')
require('../database/model/track')
require('../database/model/user')
require('../database/model/connections')

const Playlist = mongoose.model("playlist")
const Track = mongoose.model("track")
const User = mongoose.model("user")

describe('T-Vibe tests', () => {
    beforeEach(async () => {
        await initializeTVibeTestDatabase()
        jest.setTimeout(10000)
    })

    afterEach(async () => {
        await clearTVibeTestDatabase()
    })

    // playlist.js
    test('POST - SAVE NEW TRACKS', async () => {
        const testTrack = {
            name: "testTrackName4",
            artist: "testArtist1",
            genres: ["testGenre1", "testGenre2", "testGenre3"],
            platform: "testPlatform1",
            url_id: "testUrlId1",
            duration: 123,
            added_on: new Date()
        }
        const res = await request(app)
            .post('/playlists/tracks')
            .send({ tracks: [testTrack] })

        expect(res.statusCode).toBe(200)
    })

    test('POST - SAVE NEW TRACKS - ATTEMPT TO ADD EMPTY TRACK', async () => {
        const testTrack = {}
        const res = await request(app)
            .post('/playlists/tracks')
            .send({ tracks: [testTrack] })

        expect(res.statusCode).not.toEqual(200)
        expect(res.statusCode).toBe(500)
    })


    test('POST - CREATE NEW PLAYLIST', async () => {
        const testPlaylist = {
            name: "testPlaylistName2",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }

        const res = await request(app)
            .post('/playlists')
            .send({ playlist: testPlaylist })

        expect(res.statusCode).toBe(200)
    })

    test('POST - CREATE NEW PLAYLIST - ATTEMPT TO ADD EMPTY PLAYLIST', async () => {
        const testPlaylist = {}

        const res = await request(app)
            .post('/playlists')
            .send({ playlist: testPlaylist })

        expect(res.statusCode).not.toEqual(200)
        expect(res.statusCode).toBe(500)
    })

    test('PUT - UPDATE PLAYLIST', async () => {
        const testPlaylist2 = {
            name: "testPlaylistName2",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            image_url: "testImageUrl",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }
        const testPlaylist = {
            name: "testPlaylistName",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            image_url: "testImageUrl",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }

        const playlistName = testPlaylist.name
        const owner = testPlaylist.owner
        const playlist = await Playlist.findOne({ name: playlistName, owner: owner }).then((response) => {
            return response
        })

        const res = await request(app)
            .put('/playlists/' + playlist._id)
            .send({ playlist: testPlaylist2, original: testPlaylist })

        expect(res.statusCode).toBe(200)
    })

    test('PUT - UPDATE PLAYLIST - EMPTY PATH PARAMETER', async () => {
        const testPlaylist2 = {
            name: "newPlaylistName",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            image_url: "testImageUrl",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }

        const res = await request(app)
            .put('/playlists/' + null)
            .send({ playlist: testPlaylist2 })

            expect(res.statusCode).not.toEqual(200)
            expect(res.statusCode).toBe(500)
    })

    test('POST - ADD TRACK TO PLAYLIST', async () => {
        const testTrack = {
            name: "testTrackName1",
            artist: "testArtist1",
            genres: ["testGenre1", "testGenre2", "testGenre3"],
            platform: "testPlatform1",
            url_id: "testUrlId1",
            duration: 123,
            added_on: new Date()
        }

        const testPlaylistName = "testPlaylistName"
        const testOwnerId = "testOwnerId"

        const playlist = await Playlist.findOne({ name: testPlaylistName, owner: testOwnerId }).then((response) => {
            return response
        })

        const res = await request(app)
            .post('/playlists/' + playlist._id + '/tracks')
            .send({ track: testTrack })

        expect(res.statusCode).toBe(200)
    })

    test('POST - ADD TRACK TO PLAYLIST - EMPTY TRACK BODY', async () => {
        const testTrack = null

        const testPlaylistName = "testPlaylistName"
        const testOwnerId = "testOwnerId"

        const playlist = await Playlist.findOne({ name: testPlaylistName, owner: testOwnerId }).then((response) => {
            return response
        })

        const res = await request(app)
            .post('/playlists/' + playlist._id + '/tracks')
            .send({ track: testTrack })

            expect(res.statusCode).not.toEqual(200)
            expect(res.statusCode).toBe(500)
    })

    test('DELETE - REMOVE TRACK FROM PLAYLIST', async () => {
        const testPlaylistName = "testPlaylistName"
        const testOwnerId = "testOwnerId"

        const playlist = await Playlist.findOne({ name: testPlaylistName, owner: testOwnerId }).then((response) => {
            return response
        })
        const testTrackName = "testTrackName1"
        const track = await Track.findOne({ name: testTrackName}).then((response) => {
            return response
        })

        const res = await request(app)
            .delete('/playlists/' + playlist._id + '/tracks/' + track._id)

        expect(res.statusCode).toBe(200)
    })

    test('DELETE - REMOVE TRACK FROM PLAYLIST - EMPTY PLAYLIST PATH PARAM', async () => {
        const testTrackName = "testTrackName1"
        const track = await Track.findOne({ name: testTrackName}).then((response) => {
            return response
        })

        const res = await request(app)
            .delete('/playlists/' + null + '/tracks/' + track._id)

        expect(res.statusCode).not.toEqual(200)
        expect(res.statusCode).toBe(500)
    })

    test('DELETE - DELETE PLAYLIST', async () => {
        const testPlaylistName = "testPlaylistName"
        const testOwnerId = "testOwnerId"

        const playlist = await Playlist.findOne({ name: testPlaylistName, owner: testOwnerId }).then((response) => {
            return response
        })

        const res = await request(app)
            .delete('/playlists/' + playlist._id)

        expect(res.statusCode).toBe(200)
    })

    test('DELETE - DELETE PLAYLIST - EMPTY PLAYLIST PATH PARAM', async () => {
        const playlistId = null

        const res = await request(app)
            .delete('/playlists/' + playlistId)

        expect(res.statusCode).not.toEqual(200)
        expect(res.statusCode).toBe(500)
    })

    test('GET - GET PLAYLIST BY ID', async () => {
        const testPlaylistName = "testPlaylistName"
        const testOwnerId = "testOwnerId"

        const playlist = await Playlist.findOne({ name: testPlaylistName, owner: testOwnerId }).then((response) => {
            return response
        })

        const res = await request(app)
            .get('/playlists/' + playlist._id)

        expect(res.statusCode).toBe(200)
    })

    test('GET - GET PLAYLIST BY ID - WRONG PLAYLIST_ID', async () => {
        const playlistId = "wrongPlaylistId"

        const res = await request(app)
            .get('/playlists/' + playlistId)

        expect(res.statusCode).not.toEqual(200)
        expect(res.statusCode).toBe(500)
    })


    // Functions
    test('Getting a playlist', async () => {
        const testPlaylist = {
            _id: "testPlaylistID",
            name: "testPlaylistName",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            image_url: "testImageUrl",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }
        const expectedResult = testPlaylist

        const playlistName = testPlaylist.name
        const owner = testPlaylist.owner
        const actualResult = await Playlist.findOne({ name: playlistName, owner: owner }).then((response) => {
            return {
                name: response.name,
                description: response.description,
                owner: response.owner,
                image_url: response.image_url,
                tracks: Array.from(response.tracks)
            }
        })

        expect(actualResult.name).toBe(expectedResult.name)
        expect(actualResult.description).toBe(expectedResult.description)
        expect(actualResult.owner).toBe(expectedResult.owner)
        expect(actualResult.image_url).toBe(expectedResult.image_url)
        expect(actualResult.tracks).toStrictEqual(expectedResult.tracks)

    })

    test('Cannot get the specified playlist', async () => {
        const testPlaylist = {
            name: "testPlaylistName4",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            image_url: "testImageUrl",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }

        const playlistName = testPlaylist.name
        const owner = testPlaylist.owner
        const actualResult = await Playlist.findOne({ name: playlistName, owner: owner })

        expect(actualResult).toBeNull()

    })

    test('Can get the specified track', async () => {
        const testTrack = {
            name: "testTrackName1",
            artist: "testArtist1",
            genres: ["testGenre1", "testGenre2", "testGenre3"],
            platform: "testPlatform1",
            url_id: "testUrlId1",
            duration: 123
        }
        const expectedResult = testTrack

        const url_id = testTrack.url_id
        const platform = testTrack.platform
        const actualResult = await Track.findOne({ url_id: url_id, platform: platform }).then((response) => {
            return {
                name: response.name,
                artist: response.artist,
                genres: Array.from(response.genres),
                platform: response.platform,
                url_id: response.url_id,
                duration: response.duration
            }
        })

        expect(actualResult.name).toBe(expectedResult.name)
        expect(actualResult.artist).toBe(expectedResult.artist)
        expect(actualResult.genres).toStrictEqual(expectedResult.genres)
        expect(actualResult.platform).toBe(expectedResult.platform)
        expect(actualResult.url_id).toBe(expectedResult.url_id)
        expect(actualResult.duration).toBe(expectedResult.duration)
    })

    test('Cannot get the specified track', async () => {
        const testTrack = {
            name: "testTrackName4",
            artist: "testArtist1",
            genres: ["testGenre1", "testGenre2", "testGenre3"],
            platform: "testPlatform1",
            url_id: "testUrlId4",
            duration: 123
        }

        const url_id = testTrack.url_id
        const platform = testTrack.platform
        const actualResult = await Track.findOne({ url_id: url_id, platform: platform })

        expect(actualResult).toBeNull()
    })

    /**
     * user.js
     */

    //The code in this test is used in other tests, 
    //so the other tests should always fail when this part doesn't return a useful result.
    test('Cannot get the specified user', async () => {
        const testUser = "testUserName3"
        const user = await User.findOne({ username: testUser }).then((response) => {
            return response
        })

        expect(user).toBeNull()
    })

    test('Can get the specified user', async () => {
        const testUser = {
            name: "testUser",
            username: "testUserName",
            hashed_password: "testPassword",
            email: "testEmail",
            connections: [],
            following: ["following1", "following2"],
            subscribed_playlists: [],
            preferred_genres: ["testGenre1", "testGenre2"]
        }
        const expectedResult = testUser

        const testUserName = testUser.username

        const actualResult = await User.findOne({ username: testUserName }).then((response) => {
            return {
                name: response.name,
                username: response.username,
                hashed_password: response.hashed_password,
                email: response.email,
                connections: Array.from(response.connections),
                following: Array.from(response.following),
                subscribed_playlists: Array.from(response.subscribed_playlists),
                preferred_genres: Array.from(response.preferred_genres),
            }
        })

        expect(actualResult.name).toBe(expectedResult.name)
        expect(actualResult.username).toBe(expectedResult.username)
        expect(actualResult.hashed_password).toBe(expectedResult.hashed_password)
        expect(actualResult.email).toBe(expectedResult.email)
        expect(actualResult.connections).toStrictEqual(expectedResult.connections)
        expect(actualResult.following).toStrictEqual(expectedResult.following)
        expect(actualResult.subscribed_playlists).toStrictEqual(expectedResult.subscribed_playlists)
        expect(actualResult.preferred_genres).toStrictEqual(expectedResult.preferred_genres)
    })

    test('GET - GET TRACKS FROM USER', async () => {
        const testUser = "testUserName"
        const user = await User.findOne({ username: testUser }).then((response) => {
            return response
        })
        const res = await request(app)
            .get('/users/' + user._id + '/tracks')
    
        expect(res.statusCode).toBe(200)
    })

    test('GET - GET TRACKS FROM USER - USER_ID IS NULL ', async () => {
        const testUserId = null
        const res = await request(app)
            .get('/users/' + testUserId + '/tracks')

        expect(res.statusCode).not.toEqual(200)
        expect(res.statusCode).toBe(500)
    })

    test('GET - GET PLAYLISTS BY USER', async () => {
        const testUser = "testUserName"
        const user = await User.findOne({ username: testUser }).then((response) => {
            return response
        })
        const res = await request(app)
            .get('/users/' + user._id + '/playlists')

        expect(res.statusCode).toBe(200)
    })

    test('GET - GET PLAYLISTS BY USER - EMPTY USER ID', async () => {
        const userId = null
        const res = await request(app)
            .get('/users/' + userId + '/playlists')

        expect(res.statusCode).not.toEqual(200)
        expect(res.statusCode).toBe(500)
    })

    test('POST - CREATE USER', async () => {
        const testUser = {
            name: "testUserName",
            username: "testUserUsername",
            hashed_password: "testUserSomeHashedPassword",
            email: "testUser@email.com"
        }
        const response = await request(app)
            .post('/users')
            .send({ user: testUser })
        expect(response.statusCode).toEqual(200)

    })

    test('POST - CREATE USER - ATTEMPT TO CREATE AN EMPTY USER', async () => {
        const testUser = {}
        const response = await request(app)
            .post('/users')
            .send({ user: testUser })

        expect(response.statusCode).not.toEqual(200)
        expect(response.statusCode).toEqual(500)

    })

    test('PUT - UPDATE A USER', async () => {
        const updatedData = {
            name: 'updatedName',
            email: 'updated@email.com'
        }

        const testUserName = 'testUserName2'

        const user = await User.findOne({ username: testUserName }).then((response) => {
            return response
        })

        const response = await request(app)
            .put(`/users/${user._id}`)
            .send({ user: updatedData })

        expect(response.statusCode).toEqual(200)
    })

    test('PUT - UPDATE A USER - USER IS NULL', async () => {
        const updatedData = null
        const testUserName = 'testUserName2'

        const user = await User.findOne({ username: testUserName }).then((response) => {
            return response
        })

        const response = await request(app)
            .put(`/users/${user._id}`)
            .send({ user: updatedData })

        expect(response.statusCode).toEqual(500)
    })

    test('POST - ADD CONNECTION TO USER', async () => {
        const testConnection = {
            platform: 'spotify',
            access_token: 'testAccessToken',
            refresh_token: 'testRefreshToken'
        }

        const testUserName = 'testUserName2'
        const user = await User.findOne({ username: testUserName }).then((response) => {
            return response
        })

        const response = await request(app)
            .post(`/users/${user._id}/connections`)
            .send({ connection: testConnection })

        expect(response.statusCode).toEqual(200)
    })

    test('POST - ADD CONNECTION TO USER - ACCESS_TOKEN IS NULL', async () => {
        const testConnection = {
            platform: 'spotify',
            access_token: null,
            refresh_token: 'testRefreshToken'
        }

        const testUserName = 'testUserName2'
        const user = await User.findOne({ username: testUserName }).then((response) => {
            return response
        })

        const response = await request(app)
            .post(`/users/${user._id}/connections`)
            .send({ connection: testConnection })

            expect(response.statusCode).not.toEqual(200)
            expect(response.statusCode).toEqual(500)
    })

    test('POST - LOG IN A USER', async () => {
        const testUser = {
            name: "testUser",
            username: "testUserName",
            hashed_password: "testPassword",
            email: "testEmail",
        }

        const response = await request(app)
            .post('/users/login')
            .send({ user: testUser })

        expect(response.statusCode).toEqual(200)

    })

    test('GET - GET ACTIVE USER - NOT LOGGED IN', async () => {

        const response = await request(app)
            .get('/users/login')

        expect(response.statusCode).not.toBe(200)
        expect(response.statusCode).toEqual(500)

    })


    test('DELETE - LOG OUT A USER', async () => {

        const response = await request(app)
            .delete('/users/logout')

        expect(response.statusCode).toEqual(200)

    })


    test('GET - GET USER BY ID', async () => {
        const testUser = "testUserName"
        const user = await User.findOne({ username: testUser }).then((response) => {
            return response
        })

        const response = await request(app)
            .get('/users/' + user._id)

        expect(response.statusCode).toEqual(200)

    })

    test('GET - GET USER BY ID - WRONG USER ID', async () => {
        const userId = "testUserId"
        const response = await request(app)
            .get('/users/' + userId)

        expect(response.statusCode).not.toBe(200)
        expect(response.statusCode).toEqual(500)

    })


    test('GET FOLLOWING USERS BASED ON USER ID', async () => {
        const testUser = "testUserName"
        const user = await User.findOne({ username: testUser}).then((response) => {
            return response
        })

        const testUser2 = "testUserName2"
        await request(app).put('/users/' + testUser2 + '/follow').send({ followedUser: user._id })

        const user2 = await User.findOne({ username: testUser2}).then((response) => {
            return response
        })

        const response = await request(app).get('/users/' + user2._id + '/following')

        expect(response.statusCode).toEqual(200)
    })

    test('GET FOLLOWING USERS BASED ON USER ID - WRONG USER ID', async () => {
        const userId = "testUserId"
        const response = await request(app)
            .get('/users/' + userId + '/following')


        expect(response.statusCode).not.toBe(200)
        expect(response.statusCode).toEqual(500)
    })


    test('GET - GET USER BY USERNAME', async () => {
        const testUserId = "testUserName"

        const user = await request(app)
            .get('/users/username/' + testUserId).then(response => {
                return JSON.parse(response.text)
            })

        const response = await request(app)
            .get('/users/' + user._id)

        expect(response.statusCode).toEqual(200)

    })

    test('GET - GET USER BY USERNAME - WRONG USERNAME', async () => {
        const testUserName = "wrongUserName"

        const response = await request(app)
            .get('/users/username/' + testUserName)

        expect(response.statusCode).not.toBe(200)
        expect(response.statusCode).toEqual(500)

    })

    test('PUT - FOLLOW PLAYLIST', async () => {
        const testPlaylist = {
            name: "testPlaylistName",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            image_url: "testImageUrl",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }

        const testUserName = "testUserName"

        const response = await request(app)
            .put('/users/' + testUserName + '/playlist')
            .send({ playlist: testPlaylist })

        expect(response.statusCode).toEqual(200)

    })

    test('PUT - FOLLOW PLAYLIST - PLAYLIST TO FOLLOW DOES NOT EXIST', async () => {
        const testPlaylist = {
            name: "testPlaylistName4",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            image_url: "testImageUrl",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }

        const testUserName = "testUserName"

        const response = await request(app)
            .put('/users/' + testUserName + '/playlist')
            .send({ playlist: testPlaylist })

        expect(response.statusCode).not.toEqual(200)
        expect(response.statusCode).toEqual(500)
    })

    test('DELETE - UNFOLLOW PLAYLIST', async () => {
        const testPlaylistName = "testPlaylistName"
        const testUserName = "testUserName"

        const testPlaylist = await Playlist.findOne({ name: testPlaylistName }).then((response) => {
            return response
        })

        const response = await request(app)
            .delete('/users/' + testUserName + '/playlist')
            .send({ playlist: testPlaylist })

        expect(response.statusCode).toEqual(200)

    })

    test('DELETE - UNFOLLOW PLAYLIST - GIVEN PLAYLIST DOES NOT EXIST', async () => {
        const testPlaylistName = "wrongPlaylistName"
        const testUserName = "testUserName"

        const testPlaylist = await Playlist.findOne({ name: testPlaylistName }).then((response) => {
            return response
        })

        const response = await request(app)
            .delete('/users/' + testUserName + '/playlist')
            .send({ playlist: testPlaylist })

        expect(response.statusCode).not.toEqual(200)
        expect(response.statusCode).toEqual(500)

    })

    test('GET - CHECK IF USER FOLLOWS THE PLAYLIST', async () => {
        const testPlaylist = {
            name: "testPlaylistName",
            description: "testPlaylistDescription",
            owner: "testOwnerId",
            image_url: "testImageUrl",
            tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
        }

        const foundPlaylist = await Playlist.findOne({ name: testPlaylist.name }).then((response) => {
            return response
        })

        const testUserName = "testUserName2"

        const foundUser = await User.findOne({ username: testUserName }).then((response) => {
            return response
        })

        await request(app)
            .put('/users/' + testUserName + '/playlist')
            .send({ playlist: foundPlaylist })

        const response = await request(app)
            .get('/users/' + foundUser._id + '/playlist/' + foundPlaylist._id)

        expect(response.statusCode).toEqual(200)
    })

    test('GET - CHECK IF USER FOLLOWS THE PLAYLIST - GIVEN PLAYLIST DOES NOT EXIST', async () => {
        const testPlaylistId = "WrongTesTPlaylist34"

        const testUserName = "testUserName2"

        const foundUser = await User.findOne({ username: testUserName }).then((response) => {
            return response
        })

        const response = await request(app)
            .get('/users/' + foundUser._id + '/playlist/' + testPlaylistId)

        expect(response.statusCode).not.toEqual(200)
        expect(response.statusCode).toEqual(500)

    })

    test('PUT - FOLLOW USER', async () => {
        const nameOfUserToFollow = "testUserName"
        const userToFollow = await User.findOne({ username: nameOfUserToFollow }).then((response) => {
            return response
        })

        const testUserName = "testUserName2"

        const response = await request(app)
            .put('/users/' + testUserName + '/follow')
            .send({ followedUser: userToFollow })

        expect(response.statusCode).toEqual(200)
    })

    test('PUT - FOLLOW USER - NO BODY', async () => {
        const testUserName = "testUserName2"

        const response = await request(app)
            .put('/users/' + testUserName + '/follow')
            .send()

        expect(response.statusCode).toEqual(500)
    })

    test('DELETE - UNFOLLOW USER', async () => {
        const nameOfUserToUnfollow = "testUserName"
        const userToUnfollow = await User.findOne({ username: nameOfUserToUnfollow }).then((response) => {
            return response
        })

        const testUserName = "testUserName2"

        const response = await request(app)
            .delete('/users/' + testUserName)
            .send({ unFollowedUser: userToUnfollow })

        expect(response.statusCode).toEqual(200)
    })

    test('DELETE - UNFOLLOW USER - NO BODY', async () => {
        const testUserName = "testUserName2"

        const response = await request(app)
            .delete('/users/' + testUserName)
            .send(null)

        expect(response.statusCode).toEqual(500)
    })

    test('GET - CHECK IF USER FOLLOWS SOMEONE', async () => {
        const testUser = {
            name: "testUser",
            username: "testUserName",
            hashed_password: "testPassword",
            email: "testEmail",
        }

        const testUserName = "testUserName2"

        const followedUser = await request(app)
            .get('/users/username/' + testUser.username).then(response => {
                return JSON.parse(response.text)
            })

        await request(app)
            .put('/users/' + testUserName)
            .send({ followedUser: followedUser })

        const user = await User.findOne({ username: testUserName }).then((response) => {
            return response
        })

        const response = await request(app)
            .get('/users/' + user._id + '/stats')

        expect(response.statusCode).toEqual(200)

    })

    test('GET - CHECK IF USER FOLLOWS SOMEONE - WRONG IDS', async () => {
        const response = await request(app)
            .get('/users/' + 'Not a user id' + '/following/' + 'another fake id')

        expect(response.statusCode).toEqual(500)

    })

    test('GET - GET STATS FROM A USER', async () => {
        const testUser = "testUserName"
        const user = await User.findOne({ username: testUser }).then((response) => {
            return response
        })

        const response = await request(app)
            .get('/users/' + user._id + '/stats')

        expect(response.statusCode).toEqual(200)
    })

    test('GET - GET STATS FROM A USER - WRONG ID', async () => {
        const response = await request(app)
            .get('/users/' + 'this is not a user id' + '/stats')

        expect(response.statusCode).toEqual(500)
    })

    test('PUT - ADD A TRACK TO USER STATS AND/OR RAISE THE COUNT', async () => {
        const trackToBeInserted =
            {
                _id : "5fc8f3b01ff46839f8ab1bd2",
                genres : ["Pop", "Hip Hop", "EDM"],
                name : "Won't Ever Let You Go",
                artist : "Zayde Wølf",
                platform : "Spotify",
                url_id : "22XrlIZYjtdixS9M9kA7A3",
                duration : 237067,
                added_on : "2020-12-02T23:00:00.000Z"
            }
        const body = trackToBeInserted._id
        await Track.create(trackToBeInserted)

        const testUser = "testUserName"
        const user = await User.findOne({username: testUser}).then((response) => {
            return response
        })

        const response = await request(app)
            .put('/users/' + user._id + '/stats')
            .send({track_id : body})

        expect(response.statusCode).toEqual(200)
    })

    test('PUT - ADD A TRACK TO USER STATS AND/OR RAISE THE COUNT - EMPTY BODY', async () => {
        const testUser = "testUserName"
        const user = await User.findOne({username: testUser}).then((response) => {
            return response
        })

        const response = await request(app)
            .put('/users/' + user._id + '/stats')
            .send({track_id : null})

        expect(response.statusCode).toEqual(500)
    })


    test('PUT - SET FAVORITE TRACK FOR USER', async () => {
        const testUser = "testUserName"
        const user = await User.findOne({ username: testUser }).then((response) => {
            return response
        })

        const testTrackName = "testTrackName2"
        const track = await Track.findOne({ name: testTrackName}).then((response) => {
            return response
        })

        const res = await request(app)
            .put('/users/' + user._id + '/favoriteTrack')
            .send({favorite_track : track})

        expect(res.statusCode).toBe(200)
    })

    test('PUT - SET FAVORITE TRACK FOR USER - EMPTY BODY', async () => {
        const testUser = "testUserName"
        const user = await User.findOne({ username: testUser }).then((response) => {
            return response
        })

        const res = await request(app)
            .put('/users/' + user._id + '/favoriteTrack')
            .send({favorite_track : null})

        expect(res.statusCode).toBe(500)
    })

    //track.js
    test('GET - GET TRACK', async () => {
        const testTrackName = "testTrackName2"
        const track = await Track.findOne({ name: testTrackName}).then((response) => {
            return response
        })

        const res = await request(app)
            .get('/tracks/track/' + track._id)

        expect(res.statusCode).toBe(200)
    })

    test('GET - GET TRACK - INVALID TRACK ID GIVEN', async () => {
        const res = await request(app)
            .get('/tracks/track/nonExistentId')

        expect(res.statusCode).toBe(500)
    })

    test('GET - GET ALL GENRES', async () => {
        const testGenres = ["testGenre1", "testGenre2", "testGenre3"]

        const res = await request(app)
            .get('/tracks/genres')

        expect(res.body).toEqual(testGenres)
        expect(res.statusCode).toBe(200)
    })

    test('GET - GET TRACKS BY GENRE', async () => {
        const testGenre = "testGenre1"

        const res = await request(app)
            .get('/tracks/genres/' + testGenre)

        expect(res.statusCode).toBe(200)
    })

    test('GET - GET TRACKS BY GENRE - NO VALID GENRE GIVEN', async () => {
        //NOTE: you can not test with an empty genre, because it will go to a different endpoint
        const testGenre = "-"

        const res = await request(app)
            .get('/tracks/genres/' + testGenre)

        expect(res.body).toEqual([])
    })

    test('GET - GET TOP 10 TRENDING SONGS, ARTISTS AND GENRES', async () => {
        const res = await request(app)
            .get('/tracks/trending')

        expect(res.statusCode).toBe(200)
    })

    test('GET - GET TRACKS BY ARTIST', async () => {
        const testArtist = "testArtist2"
        const res = await request(app)
            .get('/tracks/artists/' + testArtist)

        expect(res.statusCode).toBe(200)
    })

    test('GET - GET TRACKS BY ARTIST - NO ARTIST GIVEN', async () => {
        const testArtist = ""
        const res = await request(app)
            .get('/tracks/artists/' + testArtist)

        expect(res.statusCode).toBe(404)
    })

    test('GET - GET SOUNDCLOUD TRACK', async () => {
        const trackUri = "https://soundcloud.com/octobersveryown/drake-laugh-now-cry-later-feat"
        const clientId = process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID

        const soundCloudTrack = {trackUri : trackUri, clientId: clientId}

        const res = await request(app)
            .post('/tracks/soundCloudTrack').send({soundCloudTrack: soundCloudTrack})

        expect(res.statusCode).toBe(200)
    })

    test('GET - GET SOUNDCLOUD TRACK - INVALID CLIENT ID', async () => {
        const trackUri = "https://soundcloud.com/octobersveryown/drake-laugh-now-cry-later-feat"
        const clientId = "invalidClientId"

        const soundCloudTrack = {trackUri : trackUri, clientId: clientId}

        const res = await request(app)
            .post('/tracks/soundCloudTrack').send({soundCloudTrack: soundCloudTrack})

        expect(res.statusCode).toBe(500)
    })

    test('GET - GET SOUNDCLOUD TRACK - INVALID TRACK URI', async () => {
        const trackUri = "https://soundcloud.com/invalidTrackURI"
        const clientId = process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID

        const soundCloudTrack = {trackUri : trackUri, clientId: clientId}

        const res = await request(app)
            .post('/tracks/soundCloudTrack').send({soundCloudTrack: soundCloudTrack})

        expect(res.statusCode).toBe(500)
    })

    //search.js

    test('GET - GET PLAYLISTS AND USERS BY SEARCH TERM', async () => {
        const searchTerm = "test"
        const res = await request(app)
            .get('/search/' + searchTerm)

            const expectedResult = {
                playlists:[
                {
                    _id:"5ffc5bfb8cf5453becdc5479",
                    name:"testPlaylistName",
                    description:"testPlaylistDescription",
                    owner:"testOwnerId",
                    image_url:"testImageUrl",
                    tracks:[]
                },
                {   _id:"5ffc5bfb8cf5453becdc547a",
                    name:"testPlaylistName2",
                    description:"testPlaylistDescription2",
                    owner:"testOwnerId2",
                    image_url:"testImageUrl2",
                    tracks:[]
                }
                ],
                users:[
                {
                    connections:[],
                    following:["following1","following2"],
                    subscribed_playlists:[],
                    preferred_genres:["testGenre1","testGenre2"],
                    _id:"5ffc5bfb8cf5453becdc547e",
                    name:"testUser",
                    username:"testUserName",
                    hashed_password:"testPassword",
                    email:"testEmail",
                    stats:{
                        _id:"5ffc5bfb8cf5453becdc547f",
                        tracks:[],
                        genres:[
                            {
                                _id:"5ffc5bfb8cf5453becdc5480",
                                genre:"testGenre3",
                                count:7
                            }
                        ]
                    },
                    favorite_track:""
                },
                {
                    connections:[],
                    following:[],
                    subscribed_playlists:[],
                    preferred_genres:["testGenre1","testGenre2"],
                    _id:"5ffc5bfb8cf5453becdc5481",
                    name:"testUser2",
                    username:"testUserName2",
                    hashed_password:"testPassword2",
                    email:"testEmail2",
                    stats:{
                        _id:"5ffc5bfb8cf5453becdc5482",
                        tracks:[],
                        genres:[
                            {
                                _id:"5ffc5bfb8cf5453becdc5483",
                                genre:"testGenre3",
                                count:7
                            }
                        ]
                    },
                    favorite_track:""
                }
            ]
        }

        expect(res.statusCode).toBe(200)
        expect(res.body.playlists[0].description).toEqual(expectedResult.playlists[0].description)
        expect(res.body.playlists[0].image_url).toEqual(expectedResult.playlists[0].image_url)
        expect(res.body.playlists[0].name).toEqual(expectedResult.playlists[0].name)
        expect(res.body.playlists[0].owner).toEqual(expectedResult.playlists[0].owner)
        expect(res.body.playlists[0].tracks).toEqual(expectedResult.playlists[0].tracks)
        expect(res.body.playlists[1].description).toEqual(expectedResult.playlists[1].description)
        expect(res.body.playlists[1].image_url).toEqual(expectedResult.playlists[1].image_url)
        expect(res.body.playlists[1].name).toEqual(expectedResult.playlists[1].name)
        expect(res.body.playlists[1].owner).toEqual(expectedResult.playlists[1].owner)
        expect(res.body.playlists[1].tracks).toEqual(expectedResult.playlists[1].tracks)
        expect(res.body.users[0].name).toEqual(expectedResult.users[0].name)
        expect(res.body.users[0].username).toEqual(expectedResult.users[0].username)
        expect(res.body.users[0].favorite_track).toEqual(expectedResult.users[0].favorite_track)
        expect(res.body.users[0].email).toEqual(expectedResult.users[0].email)
        expect(res.body.users[0].preferred_genres).toEqual(expectedResult.users[0].preferred_genres)
        expect(res.body.users[0].subscribed_playlists).toEqual(expectedResult.users[0].subscribed_playlists)
        expect(res.body.users[0].following).toEqual(expectedResult.users[0].following)
        expect(res.body.users[0].connections).toEqual(expectedResult.users[0].connections)
        expect(res.body.users[1].name).toEqual(expectedResult.users[1].name)
        expect(res.body.users[1].username).toEqual(expectedResult.users[1].username)
        expect(res.body.users[1].favorite_track).toEqual(expectedResult.users[1].favorite_track)
        expect(res.body.users[1].email).toEqual(expectedResult.users[1].email)
        expect(res.body.users[1].preferred_genres).toEqual(expectedResult.users[1].preferred_genres)
        expect(res.body.users[1].subscribed_playlists).toEqual(expectedResult.users[1].subscribed_playlists)
        expect(res.body.users[1].following).toEqual(expectedResult.users[1].following)
        expect(res.body.users[1].connections).toEqual(expectedResult.users[1].connections)
    })

    test('GET - GET PLAYLISTS AND USERS BY SEARCH TERM - USING EMPTY SEARCHTERM', async () => {
        const searchTerm = ""
        const res = await request(app)
            .get('/search/' + searchTerm)

        expect(res.statusCode).toBe(404)
    })

    test('GET - GET RANDOM PLAYLISTS', async () => {

        const testUserName = "testUserName2"

        const user = await User.findOne({ username: testUserName }).then((response) => {
            return response
        })

        const res = await request(app)
            .get('/search/' + user._id + '/random')

        expect(res.statusCode).toBe(200)
    })

})
