require('dotenv').config()

let link = process.env.REACT_APP_LINK

async function getTrendings(){
    return await fetch(link + `/tracks/trending`, {
        method: "get",
        headers: { "Content-Type": "application/json" },
    }).then((response) => response.json())
}

module.exports = {getTrendings}