function friendsReducer (state = null, action) {
    return action.type === "MY_FRIENDS" ? action.payload : state
}

module.exports = friendsReducer