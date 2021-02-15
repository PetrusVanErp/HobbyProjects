require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function getResultsBasedOnSearchTerm(searchTerm) {
    return await fetch(link + `/search/${searchTerm}`, {
        method: "get",
        headers: { "Content-Type": "application/json" }
    }).then((response) => response.json())
}

async function getRandomPlaylistsByUserId(userId) {
    return await fetch(link + `/search/${userId}/random`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then((response) => response.json())
}

module.exports = { getResultsBasedOnSearchTerm, getRandomPlaylistsByUserId }
