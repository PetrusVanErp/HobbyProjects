function currentPageReducer (state = "HOMEPAGE", action) {
    return action.type === "REDIRECT" ? action.payload : state
}

module.exports = currentPageReducer