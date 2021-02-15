import axios from 'axios';

require('dotenv').config()

let clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID
let ClientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET

export async function initializeSpotify() {
    let token = null

    return await axios('https://accounts.spotify.com/api/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + ClientSecret)
        },
        data: 'grant_type=client_credentials',
        method: 'POST'
    })
        .then(tokenResponse => {
            token = tokenResponse.data.access_token
            return token
        })
}

export function identifyTrackId(URI) {
    let trackIndex = null
    let trackId = null
    let beginTrackIDIndex = null
    if(URI.includes("open.spotify.com")){
        trackIndex = URI.indexOf("track")
        beginTrackIDIndex = trackIndex + 6
    }
    else if(URI.includes("soundcloud.com")){
        trackIndex = URI.indexOf("soundcloud.com")
        beginTrackIDIndex = trackIndex + 15
    }
    trackId = URI.slice(beginTrackIDIndex)
    return trackId
}

export async function getSpotifyTrack(token, trackUrl) {
    const trackId = identifyTrackId(trackUrl)

    let spotifyTrack = await axios(`https://api.spotify.com/v1/tracks/${trackId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(tracksResponse => {
            let spotifyTrackDetails = {
                name: tracksResponse.data.name,
                album: tracksResponse.data.album,
                artists: tracksResponse.data.artists,
                duration: tracksResponse.data.duration_ms,
                platform: "Spotify"
            }
            return spotifyTrackDetails
        })

    return spotifyTrack
}

export async function getSpotifyGenreFromArtist(token, artistId) {
    let spotifyArtist = await axios(`https://api.spotify.com/v1/artists/${artistId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(artistResponse => {
            let spotifyArtistDetails = {
                genres: artistResponse.data.genres
            }
            return spotifyArtistDetails
        })

    return spotifyArtist
}

//Spotify user authorization
export function getUserAccess(response_type = 'code', redirect_uri = 'http://localhost:3000/spotify-api', scope = 'streaming') {
    redirect_uri = encodeURI(redirect_uri)
    window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=${response_type}&redirect_uri=${redirect_uri}&scope=${scope}`)
}

export async function saveUserCode(user, uriCode, redirect_uri = 'http://localhost:3000/spotify-api'){
    //Slice the parameter code from the uri
    const codeIndex = uriCode.indexOf("code=")
    const code = uriCode.slice((codeIndex + 5))
    redirect_uri = encodeURI(redirect_uri)

    const authorizationHeader = btoa(clientId + ':' + ClientSecret)

    //Retrieve the access- and refresh-token
    const response = await fetch(`http://localhost:3001/users/token`, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({
            data: {
                authorization: authorizationHeader,
                code: code,
                redirect_uri: redirect_uri
            }
        })
    }).then(result => result.json())    

    //Add the connection to the user.connections in the database
    const result = await fetch(`http://localhost:3001/users/${user._id}/connections`, {
            method: "post",
            headers: {"Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify({
                connection: {
                    platform: 'spotify',
                    access_token: response.access_token,
                    refresh_token: response.refresh_token
                }
            }),
        }).then((response) => response.json())

    return result
}

export async function getEmbeddedTrackUri(URI) {
    const embed = "embed/"
    const baseUrl = "https://open.spotify.com/"
    const embeddedURI = baseUrl + embed + 'track/' + URI
    return embeddedURI
}
