function selectedPlaylistReducer (state = null, action) {
    return action.type === "PLAYLIST_SELECTED" ? action.payload : state
}

module.exports = selectedPlaylistReducer
