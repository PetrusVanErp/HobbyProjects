require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function userNameAvailable(userJson) {
    return await fetch(link + `/users/username/${userJson.username}`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then((response) => {
        if (response.status !== 200) {
            console.clear()
            return false
        }
        else {
            return true
        }
    })
}

async function createUser(jsonData) {
    return await fetch(link + `/users`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            user: jsonData
        }),
    }).then((response) => response.json())
}

module.exports = { userNameAvailable, createUser }