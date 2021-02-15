const port = 3001
const serverHostname = `localhost:${port}`

let theSocket

export function openWebSocket() {
  if(theSocket) {
    theSocket.onerror = null
    theSocket.onopen  = null
    theSocket.onclose = null
    theSocket.close()
  }
  console.log("Opening socket for", `ws://${serverHostname}`)
  theSocket = new WebSocket(`ws://${serverHostname}`)
  return theSocket
}

export function getWebSocket() {
  if( theSocket ) {
    return theSocket
  }
  else {
    throw new Error("The websocket has not been opened yet.")
  }
}

export async function getLoggedInUser(){
    const response = await fetch(`http://localhost:3001/users/active`, {
            method: "get",
            headers: {"Content-Type": "application/json"},
            credentials: 'include',
            mode: 'cors'
        })
    return response.json()
}