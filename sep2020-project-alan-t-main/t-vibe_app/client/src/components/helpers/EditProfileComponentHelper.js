require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function saveChanges(userId, updatedUserInformation) {
    return await fetch(link + `/users/${userId}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user: updatedUserInformation
        }),
    }).then((response) => {
        if (response.status === 200) {
            return response.json()
        }
        else{
            alert("Cannot save changes")
        }
    })
}

module.exports = { saveChanges }