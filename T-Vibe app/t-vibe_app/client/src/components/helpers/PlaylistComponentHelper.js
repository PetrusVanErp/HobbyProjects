require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function followPlaylist(username, playlist) {
    return await fetch(link + `/users/${username}/playlist`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playlist: playlist
        }),
    })
}


async function unFollowPlaylist(username, playlist) {
    return await fetch(link + `/users/${username}/playlist`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playlist: playlist
        }),
    })
}

async function checkIfUserFollowsPlaylist(userId, playlistId) {
    return await fetch(link + `/users/${userId}/playlist/${playlistId}`, {
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

async function getPlaylistCollection(userId) {
    return await fetch(link + `/users/${userId}/playlists`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then((response) => response.json())
        .then((data) => {
            return data
        })
}

async function deletePlaylist(playlist) {
    return await fetch(link + `/playlists/${playlist._id}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
    })
}

module.exports = {followPlaylist, unFollowPlaylist, checkIfUserFollowsPlaylist, getPlaylistCollection, deletePlaylist}