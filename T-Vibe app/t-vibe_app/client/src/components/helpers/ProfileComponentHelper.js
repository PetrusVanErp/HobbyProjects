require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function getUserTracks(userID) {
    return await fetch(link + `/users/${userID}/tracks`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.json())
}

async function favoriteTrackChange(userID, track) {
    return await fetch(link + `/users/${userID}/favoriteTrack`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            favorite_track: track
        })
    })
}

module.exports = { getUserTracks, favoriteTrackChange }