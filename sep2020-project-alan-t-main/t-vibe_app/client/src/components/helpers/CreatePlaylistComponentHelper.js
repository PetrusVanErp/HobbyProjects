import {
    getSpotifyGenreFromArtist,
    getSpotifyTrack,
    identifyTrackId,
    initializeSpotify
} from "../connections/SpotifyHandler";
import {getSoundCloudTrack} from "../connections/SoundCloudHandler";

require('dotenv').config()

let link = process.env.REACT_APP_LINK

export async function saveTracksInPlaylist(tracks) {
    return await fetch(link + `/playlists/tracks`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            tracks: tracks,
        }),
    }).then(response => response.json())
}

export async function saveUserPlaylist(playlist) {
    return await fetch(link + `/playlists`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playlist: playlist,
        }),
    }).then(response => response.json())
}

export async function updateTracksInUserPlaylist(playlistID, playlist) {
    return await fetch(link + `/playlists/${playlistID}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            playlist: playlist
        }),
    })
}

export async function removeTrackFromUserPlaylist(playlistID, track) {
    return await fetch(link + `/playlists/${playlistID}/tracks/${track._id}`, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
    })
}

export async function getTrackByUrl(trackUrl) {
    const token = await initializeSpotify()
    let getTrack = null
    let getArtist = null
    let artistName = null
    let getGenres = null
    let getName = null
    let getPlatform = null
    let titleArray = []

    if (trackUrl.includes("open.spotify.com")) {

        trackUrl = trackUrl.split('?')[0]
        getTrack = await getSpotifyTrack(token, trackUrl)
        getArtist = await getSpotifyGenreFromArtist(token, getTrack.artists[0].id)

        getName = getTrack.name
        artistName = getTrack.artists[0].name
        getGenres = getArtist.genres
        getPlatform = getTrack.platform.toLowerCase()

    } else if (trackUrl.includes("soundcloud.com")) {
        getTrack = await getSoundCloudTrack(trackUrl)

        if (getTrack.publisher_metadata !== undefined && getTrack.publisher_metadata !== null) {
            if (getTrack.publisher_metadata.release_title !== null) {
                getName = getTrack.publisher_metadata.release_title
            }
            if (getTrack.publisher_metadata.artist !== null) {
                artistName = getTrack.publisher_metadata.artist
            }
        }

        if (getTrack.title !== null || getName === null || artistName === null) {
            getName = getTrack.title

            if (getName.includes("-")) {
                titleArray = getName.split("-")
                getName = titleArray[1]
                artistName = titleArray[0]
            } else if (getName.includes("|")) {
                titleArray = getName.split("|")
                getName = titleArray[1]
                artistName = titleArray[0]
            }

            if (artistName !== null) {
                if (typeof artistName !== "undefined" && artistName.toLowerCase().trim() === getTrack.permalink) {
                    getName = titleArray[0]
                    artistName = titleArray[1]
                }
            }

            if(getName.includes("(")){
                getName = getTrack.title

                if (getTrack.user.user_name !== null) {
                    artistName = getTrack.user.username
                }

                if (getTrack.user.full_name !== null) {
                    artistName = getTrack.user.full_name
                }

            }
        }

        if (getTrack.user !== null && !artistName) {

            if (getTrack.user.user_name !== null) {
                artistName = getTrack.user.username
            }
            if (getTrack.user.full_name !== null && !artistName) {
                artistName = getTrack.user.full_name
            }
        }

        getGenres = getTrack.genre.toLowerCase()
        getPlatform = 'soundcloud'
    } else {
        return null
    }

    return {
        name: getName,
        artist: artistName,
        genres: getGenres,
        platform: getPlatform,
        url_id: identifyTrackId(trackUrl),
        duration: getTrack.duration, //in ms
        added_on: getCurrentDate()
    }
}

function getCurrentDate(separator = '-') {

    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
}

