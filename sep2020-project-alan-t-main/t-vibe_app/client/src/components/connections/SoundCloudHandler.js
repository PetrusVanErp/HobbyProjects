require('dotenv').config()

let clientId = process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID

export async function getSoundCloudTrack(uri){
    let soundCloudTrack = {
        clientId: clientId,
        trackUri: uri
    }
    return await fetch(`http://localhost:3001/tracks/soundCloudTrack`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            soundCloudTrack : soundCloudTrack
        })
    }).then(response => response.json())
}

export async function getSoundCloudTrackUri(uri){

    const widgetUrl = "https://w.soundcloud.com/player/?url="

    return await getSoundCloudTrack(uri).then(result => {
        return widgetUrl + result.uri
    })
}

