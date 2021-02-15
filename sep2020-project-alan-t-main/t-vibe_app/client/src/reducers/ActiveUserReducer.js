function loginReducer (state = null, action) {
    return action.type === "LOGIN" ? action.payload : state
}

module.exports = loginReducer
