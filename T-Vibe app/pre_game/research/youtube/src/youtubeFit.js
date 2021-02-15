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
        "148393621756-h0qbk2d24mvs9162rt767uoinsbm8coh.apps.googleusercontent.com",
        //client secret
        "BeFkeGePyvczps-YcSKf7B5r",
        //redirect to
        "http://localhost:1234/steps"
    )

    const scopes = ["https://www.googleapis.com/auth/userinfo.profile"]

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    })

    request(url, (err, response, body) => {
        console.log("error:" + err)
        console.log("statuscode:", response && response.statusCode)
        res.send({ url })
    })
})

app.get("/steps", async (req, res) => {
    const queryURL = new urlParse(req.url)
    const code = queryParse.parse(queryURL.query).code

    const oauth2Client = new google.auth.OAuth2(
        //clientId
        "148393621756-h0qbk2d24mvs9162rt767uoinsbm8coh.apps.googleusercontent.com",
        //client secret
        "BeFkeGePyvczps-YcSKf7B5r",
        //redirect to
        "http://localhost:1234/steps"
    )

    const tokens = await oauth2Client.getToken(code);

    res.send("HELLO")

    let stepArray = [];

    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + tokens.tokens.access_token
            },
            "Content-Type": "application/json",
            url: "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
            data: {
                aggregateBy: [
                    {
                        dataTypeName: "com.google.step_count.delta",
                        dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps" 
                    }
                ],
                bucketByTime: {durationMillis: 86400000},
                startTimeMillis: 1585785599000,
                endTimeMilllis: 1585990000000
            }
        })
        console.log(result)
    } catch (e) {
        console.log(e)
    }
})

app.listen(port, () => console.log(`GOOGLE FIT IS LISTENING ON PORT ${port}`))
