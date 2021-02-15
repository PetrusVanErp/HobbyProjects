export const selectPlaylist = (playlist) => {
    return {
        type: "PLAYLIST_SELECTED",
        payload: playlist
    }
}

export const getPlaylists = (playlists) => {
    return {
        type: "PLAYLIST_OVERVIEW",
        payload: playlists
    }
}

export const redirect = (page) => {
    return {
        type: "REDIRECT",
        payload: page
    }
}

export const logIn = (user) => {
    return {
        type: "LOGIN",
        payload: user
    }
}

export const logOut = () => {
    return {
        type: "LOGIN",
        payload: null
    }
}

export const friends = (friends) => {
    return {
        type: "MY_FRIENDS",
        payload: friends
    }
}

export const friend = (friend) => {
    return {
        type: "PROFILE",
        payload: friend
    }
}

export const webSocket = (webSocket) => {
    return {
        type: "WEBSOCKET",
        payload: webSocket
    }
}
