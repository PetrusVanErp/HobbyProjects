require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function getAllPlaylistsFromUserById(userId) {
    return await fetch(link + `/users/${userId}/playlists`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.json())
}

async function getDefaultPlaylistsByUserId(userId) {
    return await fetch(link + `/search/${userId}/random`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then(response => response.json())
}

async function logoutClicked() {
    await fetch(link + `/users/logout`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
    })
}

module.exports = { getAllPlaylistsFromUserById, getDefaultPlaylistsByUserId, logoutClicked }