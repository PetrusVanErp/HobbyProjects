const mongoose = require('mongoose')
const promiseWrappers = require('../promise-wrappers.js')

//require models
require('./model/track.js')
require('./model/track.js')
require('./model/user.js')

const dbName = 't-vibe'

const db = mongoose.connection

const track = mongoose.model('track')
const user = mongoose.model('user')

async function fillDatabase(){
    await seedMusicTracks()
}

mongoose.connect(`mongodb://localhost:27017/${dbName}`,  {useNewUrlParser: true } ).then(() => {
    return fillDatabase()
}).catch(err => {
    throw new Error(err)
}).then(() => {
    db.close()
})

async function seedMusicTracks(){
    var musicTracksInJson = await promiseWrappers.readFileP("../MusicTracks.json")
    var musicTracks = JSON.parse(musicTracksInJson)
    await track.deleteMany()
    await track.insertMany(musicTracks)
}

