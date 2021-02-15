const express = require('express')
const app = express();
const port = 1234;

const { google } = require("googleapis")
const request = require("request")
const cors = require("cors")
const urlParse = require("url-parse")
const queryParse = require("query-string")
const bodyParser = require("body-parser")
const axios = require("axios")

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.get("/getURLTing", (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        //clientId
        "148393621756-48m40328u0sp0m8fvoqmp094ii4qb4eq.apps.googleusercontent.com",
        //client secret
        "ADODZAijjswrQiEwXjHwd4s1",
        //redirect to
        "http://localhost:1234/steps"
    )

    const scopes = ["https://www.googleapis.com/auth/youtube.readonly"]

    const url = oauth2Client.generateAuthUrl({
        //access_type: "offline",
        scope: scopes,
        // state: JSON.stringify({
        //     callbackUrl: req.body.callbackUrl,
        //     userID: req.body.userid
        // })
    })

    request(url, (err, response, body) => {
        console.log("error:" + err)
        console.log("statuscode:", response && response.statusCode)
        res.send({ url })
    })
})

app.get("/steps", async (req, res) => {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEY")

    const queryURL = new urlParse(req.url)
    const code = queryParse.parse(queryURL.query).code

    const oauth2Client = new google.auth.OAuth2(
        //clientId
        "148393621756-48m40328u0sp0m8fvoqmp094ii4qb4eq.apps.googleusercontent.com",
        //client secret
        "ADODZAijjswrQiEwXjHwd4s1",
        //redirect to
        "http://localhost:1234/steps"
    )

    const tokens = await oauth2Client.getToken(code);

    try {
        const result = await axios({
            method: "GET",
            headers: {
                Authorization: "Bearer " + tokens.tokens.access_token,
                Accept: "application/json"
            },
            url: "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2C%20status%2C%20contentDetails&id=hT_nvWreIhg&key=AIzaSyDrCduvm_RYFOWpU3pGSIuYrV3ll_KRVvw",
        })
        console.log(result.data)

        console.log(result.data.items[0].contentDetails)

        console.log(result.data.items[0].status)

        console.log(result.data.items[0].snippet)

        res.send("Heyo")
    } catch (e) {
        //Insufficient Permission
        console.log(e.response.data.error.errors)
    }

    
})

app.listen(port, () => console.log(`GOOGLE FIT IS LISTENING ON PORT ${port}`))