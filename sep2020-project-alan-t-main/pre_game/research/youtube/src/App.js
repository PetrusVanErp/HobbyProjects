import './App.css';

function App() {
  /**
   * Sample JavaScript code for youtube.videos.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

  let authenticate = () => {
    return gapi.auth2.getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(function () { console.log("Sign-in successful"); },
        function (err) { console.error("Error signing in", err); });
  }
  let loadClient = () => {
    gapi.client.setApiKey("AIzaSyDrCduvm_RYFOWpU3pGSIuYrV3ll_KRVvw");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function () { console.log("GAPI client loaded for API"); },
        function (err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  let execute = () => {
    return gapi.client.youtube.videos.list({
      "part": [
        "status, contentDetails"
      ],
      "id": [
        "hT_nvWreIhg"
      ]
    })
      .then(function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
      },
        function (err) { console.error("Execute error", err); });
  }

  return (
    <div className="App">
      <script src="https://apis.google.com/js/platform.js"/>
      <script src="https://apis.google.com/js/api.js"/>

      <button onclick={authenticate().then(loadClient())}>authorize and load</button>
      <button onclick={execute()}>execute</button>
    </div>
  );
}

export default App;
