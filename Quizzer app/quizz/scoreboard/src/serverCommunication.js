const port = 4000;
const serverHostname = `${window.location.hostname}:${port}`
const serverFetchBase = `${window.location.protocol}//${serverHostname}`

let theSocket;

export function openWebSocket(type, userId, roomId, teamName) {
  if(theSocket) {
    theSocket.onerror = null;
    theSocket.onopen  = null;
    theSocket.onclose = null;
    theSocket.close();
  }
  console.log("Opening socket for", `ws://${serverHostname}`);
  console.log("NJIREURE: ", `ws://${serverHostname}`)
  theSocket = new WebSocket(`ws://${serverHostname}/${type}/${userId}/${roomId}/${teamName}`);
  return theSocket;
}

export function getWebSocket() {
  if( theSocket ) {
    return theSocket;
  }
  else {
    throw new Error("The websocket has not been opened yet.")
  }
}

function checkFetchError( response ) {
  return response.ok
            ? response.json()
            : Promise.reject(new Error('Unexpected response'));
}

export function startLogin(userName,password) {
  const body = { userName, password };
  const fetchOptions = { method: 'POST',
                         body: JSON.stringify(body),
                         headers: {
                           'Accept': 'application/json',
                           'Content-Type': 'application/json'
                         },
                         credentials: 'include',
                         mode: 'cors'
                       }
  return fetch(serverFetchBase+'/login', fetchOptions)
    .then(response => checkFetchError(response));
}

export function startLogout() {
  return  fetch(serverFetchBase+'/logout', { method: 'DELETE', credentials: 'include', mode: 'cors' })
             .then((response) => checkFetchError(response));
}

export function addMessage(msg) {
  if (typeof msg !== "string") {
    msg = JSON.stringify(msg);
  }
  console.log(msg);
  console.log("in addMessage!");
}

export function onLogin() {
  console.log("onLogin");
  startLogin("user-" + Math.round(Math.random() * 1000), "password")
    .then((msg) => addMessage(msg))
    .catch((err) => addMessage("ERROR: " + err.message));
}

export function onLogout() {
  console.log("onLogout", window.location);
  startLogout()
    .then((msg) => addMessage(msg))
    .catch((err) => addMessage("ERROR: " + err.message));
}

export function onOpenSocket() {
  console.log("onOpenSocket");
  let ws = openWebSocket();
  ws.onerror = () => addMessage("WebSocket error");
  ws.onopen = () => addMessage("WebSocket connection established");
  ws.onclose = () => addMessage("WebSocket connection closed");
  ws.onmessage = (msg) => addMessage(msg.data);
}

export function onSend() {
  const msg =
    "Here's a brand new number: " + Math.round(Math.random() * 1000000);
  const ws = getWebSocket();
  ws.send(msg);
}
