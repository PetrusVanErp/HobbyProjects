require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function followUser(username, user) {
    return await fetch(link + `/users/${username}/follow`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            followedUser: user
        })
    }).then(response => response.json())
}

async function unFollowUser(username, user) {
    return await fetch(link + `/users/${username}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            unFollowedUser: user
        })
    })
}

async function checkIfUserAlreadyFollowsOtherUser(userId, followedUserId) {
    return await fetch(link + `/users/${userId}/following/${followedUserId}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then(response => {
        if (response.status === 200) {
            return true
        }
        else {
            return false
        }
    })
}

async function getUser(userId) {
    return await fetch(link + `/users/${userId}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.json())
}

async function getFavoriteTrackFromUser(favoriteTrack) {
    const foundFavoriteTrack = await fetch(link + `/tracks/track/${favoriteTrack}`, {
        method: "get",
        headers: { "Content-Type": "application/json" }
    }).then((response) => response.json())
        .then(data => {
            let track = data.name + ' - ' + data.artist + ' (' + data.platform + ')'
            return track
        })
    return foundFavoriteTrack
}

async function getClickedPlaylist(playlists) {
    return await fetch(link + `/users/followedPlaylists`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            followed_playlists: playlists
        })
    }).then((response) => response.json())
        .then(async data => {
            return data
        })
}

async function getClickedUser(userId) {
    return await fetch(link + `/users/${userId}/following`, {
        method: "get",
        headers: { "Content-Type": "application/json" }
    }).then((response) => response.json())
        .then(async data => {
            return data
        })
}

module.exports = { followUser, unFollowUser, checkIfUserAlreadyFollowsOtherUser, getUser, getFavoriteTrackFromUser, getClickedPlaylist, getClickedUser }