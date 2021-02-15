require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function getTracksByChosenGenre(radioGenre) {
    return await fetch(link + `/tracks/genres/${radioGenre}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.json())
}

async function getTracksByArtist(artist) {
    return await fetch(link + `/tracks/artists/${artist}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.json())
}

async function updateUserStats(userId, trackId) {
    await fetch(link + `/users/${userId}/stats`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            track_id: trackId
        }),
    })
}

module.exports = { getTracksByChosenGenre, getTracksByArtist, updateUserStats }
