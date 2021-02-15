import React, { useState} from 'react';

function App() {

  const [trackUri, setTrackUri] = useState("")
  const [uri, setUri] = useState("")

  const client = require('./client.json');

  const corsProxyUrl = "https://cors-anywhere.herokuapp.com/"
  const trackInfoUrl = "http://api-v2.soundcloud.com/resolve?url=" + uri + "&client_id=" + client.client_id
  const widgetUrl = "https://w.soundcloud.com/player/?url="

  const handleSubmit = async e => {
    e.preventDefault()

    fetch(corsProxyUrl + trackInfoUrl)
      .then(response => {return response.json()})
      .then(result => { setTrackUri(widgetUrl + result.uri); })
      .catch(function (error) {
        console.log(error);
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type = "text" onChange = {(e) => setUri(e.target.value)}></input>
        <input type="submit" value="Submit" />
      </form>
      <iframe width="100%" height="166" scrolling="no" frameborder="no" src={trackUri} title="soundCloudFrame"></iframe>
    </div >
  )

}

export default App;
