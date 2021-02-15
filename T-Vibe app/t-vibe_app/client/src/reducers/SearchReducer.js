function searchReducer (state = "SEARCH", action) {
    return action.type === "REDIRECT" ? action.payload : state
}

module.exports = searchReducer