require('dotenv').config()

let link = process.env.REACT_APP_LINK

export async function getFollowingUsers(user) {
    return await fetch(link + `/users/${user._id}/following`, {
        method: "get",
        headers: { "Content-Type": "application/json" }
    }).then(response => response.json())
}
