require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function loginClicked(jsonData) {
    return await fetch(link + `/users/login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            user: jsonData
        }),
    }).then((response) => {
        if (response.status !== 200) alert('Wrong credentials')
        return response.json()
    })
}

module.exports = { loginClicked }