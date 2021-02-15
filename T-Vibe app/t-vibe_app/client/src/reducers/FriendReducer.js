function friendReducer (state = null, action) {
    return action.type === "PROFILE" ? action.payload : state
}

module.exports = friendReducer