const mongoose = require('mongoose')
const playlistRouter = require("./routes/playlist")
const userRouter = require("./routes/user")
const trackRouter = require("./routes/track")
const searchRouter = require("./routes/search")

const session = require('express-session')
const express = require('express')
const cors = require('cors')               // needed for using webpack-devserver with express server
const bodyParser = require('body-parser')
const http = require('http')
const WebSocket = require('ws')
const cookieParser = require('cookie-parser')

let getPort = process.env.TEST_PORT || 3001

// database name
let dbName = process.env.DATABASE_NAME || 't-vibe'

const app = express()

// needed to make all requests from client work with this server.
app.use(cors({ origin: true, credentials: true }))
app.options("*", cors({ origin: true, credentials: true }))

app.use(bodyParser.json())
app.use(cookieParser())
// We need the same instance of the session parser in express and
// WebSocket server, to give socket-handlers access to the session.
const sessionParser = session({
  saveUninitialized: false,
  secret: 'tViBEaPpDwA',
  resave: false
})
app.use(sessionParser)

app.use('/playlists', playlistRouter)
app.use('/users', userRouter)
app.use('/tracks', trackRouter)
app.use('/search', searchRouter)

function checkConnectionAttempt(info, done) {
  console.log('Parsing session from request...')

  sessionParser(info.req, {}, () => {
    
    console.log('Session is parsed!')

    done(true)
  })
}

// Create HTTP server by ourselves, in order to attach websocket server.
const httpServer = http.createServer(app)

// Create the Web socket server.  
const websocketServer = new WebSocket.Server({
  verifyClient: checkConnectionAttempt,
  server: httpServer
})

websocketServer.on('connection', (socket, req) => {
  socket.on('message', (message) => {
    req.session.reload((err) => {   
      // if we don't call reload(), we'll get a old copy of the session, and won't see changes made by Express routes 
      message = JSON.parse(message)
      switch(message.type) {
        case "LOGIN_MESSAGE":
          socket.username = message.username
          websocketServer.clients.forEach(function(client) {
            if(client !== socket) {
              const friendOnlineMessage = {
                type: "FRIEND_ONLINE_MESSAGE",
                username: socket.username
              }
              client.send(JSON.stringify(friendOnlineMessage))
            }
          })
        break
        case "LISTENING_MESSAGE":
            websocketServer.clients.forEach(function(client) {
              if(client !== socket){
                const currentTrackMessage = {
                  type: "LISTENING_TRACK_MESSAGE",
                  username: message.username,
                  track: message.track
                }
                client.send(JSON.stringify(currentTrackMessage))
              }
            })
        break
        case "LOGOUT_MESSAGE":
          websocketServer.clients.forEach(function(client) {
            if(client !== socket){
              const friendOfflineMessage = {
                type: "FRIEND_OFFLINE_MESSAGE",
                username: message.username,
              }
              client.send(JSON.stringify(friendOfflineMessage))
            }
          })
        break
        case "FOLLOWING_MESSAGE":
          websocketServer.clients.forEach(function(client) {
            if(message.username === client.username){
              const followOnlineMessage = {
                type: "FRIEND_ONLINE_MESSAGE",
                username: message.username,
              }
              socket.send(JSON.stringify(followOnlineMessage))
            }
          })
        break
        case "REMOVED_FOLLOWER_MESSAGE":
          const removedFollower = {
            type: "FOLLOWER_REMOVED_MESSAGE",
            username: message.username,
          }
          socket.send(JSON.stringify(removedFollower))
        break
        case "ADDED_FOLLOWER_MESSAGE":
          websocketServer.clients.forEach(function(client) {
            if(message.username === client.username){
              const addedFollower = {
                type: "FRIEND_ONLINE_MESSAGE",
                username: message.username,
              }
              socket.send(JSON.stringify(addedFollower))
            }
          })
          
        break
        default:
          socket.send('Unknown message type ' + message.type)
      }   
      req.session.save()  // If we don't call save(), Express routes like '/logout' (above)
      // will not see the changes we make to the session in this socket code.
    })
  })
})

// Start the server.
httpServer.listen(getPort,
  mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true }, () => {
    console.log(`mongoose server started on port ${httpServer.address().port}`)
  }),
  () => console.log(`Listening on http://localhost:${getPort}`)
)

require('./database/model/playlist')
require('./database/model/track')
require('./database/model/user')

const Playlist = mongoose.model("playlist")
const Track = mongoose.model("track")
const User = mongoose.model("user")

async function initializeTVibeTestDatabase() {
    await seedPlaylists()
    await seedTracks()
    await seedUsers()
}

const testPlaylist = {
  name: "testPlaylistName",
  description: "testPlaylistDescription",
  owner: "testOwnerId",
  image_url: "testImageUrl",
  tracks: ["testTrackId1", "testTrackId2", "testTrackId3"]
}

const testPlaylist2 = {
  name: "testPlaylistName2",
  description: "testPlaylistDescription2",
  owner: "testOwnerId2",
  image_url: "testImageUrl2",
  tracks: ["testTrackId1"]
}

const testTrack1 = {
  name: "testTrackName1",
  artist: "testArtist1",
  genres: ["testGenre1", "testGenre2", "testGenre3"],
  platform: "testPlatform1",
  url_id: "testUrlId1",
  duration: 123,
  added_on: new Date()
}
const testTrack2 = {
  name: "testTrackName2",
  artist: "testArtist2",
  genres: ["testGenre1", "testGenre2", "testGenre3"],
  platform: "testPlatform2",
  url_id: "testUrlId2",
  duration: 456,
  added_on: new Date()
}
const testTrack3 = {
  name: "testTrackName3",
  artist: "testArtist3",
  genres: ["testGenre1", "testGenre2", "testGenre3"],
  platform: "testPlatform3",
  url_id: "testUrlId3",
  duration: 789,
  added_on: new Date()
}

const testUserStats = {
  tracks: [],
  genres: [{
      genre: "testGenre3",
      count: 7
  }]
}

const testUser = {
  name: "testUser",
  username: "testUserName",
  hashed_password: "testPassword",
  email: "testEmail",
  following: ["following1", "following2"],
  subscribed_playlists: [],
  preferred_genres: ["testGenre1", "testGenre2"],
  stats: testUserStats,
  favorite_track: ""
}

const testUser2 = {
  name: "testUser2",
  username: "testUserName2",
  hashed_password: "testPassword2",
  email: "testEmail2",
  following: [],
  subscribed_playlists: [],
  preferred_genres: ["testGenre1", "testGenre2"],
  stats: testUserStats,
  favorite_track: ""
}

async function seedPlaylists() {
    await Playlist.insertMany([testPlaylist, testPlaylist2])
}

async function seedTracks() {
    await Track.insertMany([testTrack1, testTrack2, testTrack3])
}

async function seedUsers() {
    await User.insertMany([testUser, testUser2])
}

async function clearTVibeTestDatabase() {
    await Playlist.deleteMany({})
    await Track.deleteMany({})
    await User.deleteMany({})
}

module.exports = {app, clearTVibeTestDatabase, initializeTVibeTestDatabase}

