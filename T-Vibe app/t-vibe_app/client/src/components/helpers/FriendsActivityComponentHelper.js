async function checkFollowing(username, activeUser) {
    const result = await fetch(`http://localhost:3001/users/username/${username}`, {
        method: "get",
        headers: { "Content-Type": "application/json" }
    }).then((response) => response.json())
        .then((data) => {
            return data
        })

    const followingId = result._id

    return await fetch(`http://localhost:3001/users/${activeUser}/following/${followingId}`, {
        method: "get",
        headers: { "Content-Type": "application/json" }
    }).then((response) => {
        if (response.status === 200) return true
        else return false
    })
}

module.exports = {checkFollowing}