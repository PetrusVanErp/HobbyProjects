function getPlaylistReducer (state = null, action) {
    return action.type === "PLAYLIST_OVERVIEW" ? action.payload : state
}

module.exports = getPlaylistReducer
