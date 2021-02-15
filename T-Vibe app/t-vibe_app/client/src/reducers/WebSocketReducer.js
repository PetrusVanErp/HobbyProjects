function WebSocketReducer (state = null, action) {
    return action.type === "WEBSOCKET" ? action.payload : state
}

module.exports = WebSocketReducer