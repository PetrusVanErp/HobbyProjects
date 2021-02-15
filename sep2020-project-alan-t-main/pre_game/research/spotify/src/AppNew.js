import axios from 'axios';
import { Credentials } from './Credentials';
import React, { useState, useEffect } from 'react';
import Detail from './Detail';


const AppNew = () => {

    const spotify = Credentials();  

    const [token, setToken] = useState(''); 
    const [trackURI, setTrackURI] = useState(''); 
    const [trackDetail, setTrackDetail] = useState(null);
    const [embeddedTrackURI, setEmbeddedTrackURI] = useState(null);

    useEffect(() => {

        axios('https://accounts.spotify.com/api/token', {
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
          },
          data: 'grant_type=client_credentials',
          method: 'POST'
        })
        .then(tokenResponse => {      
          setToken(tokenResponse.data.access_token);
        });
    
      }, [spotify.ClientId, spotify.ClientSecret]); 

      const trackChanged = val => {
        const target = val.target;
        const value = target.value;
        setTrackURI(value);
      }

      const identifyTrackId = URI => {
        console.log(URI);
        const trackIndex = URI.indexOf("track");
        const trackId = URI.slice((trackIndex+6));
        return trackId;
      }

      const createEmbeddedURI = URI => {
        const embed = "embed/";
        const trackIndex = URI.indexOf("track");
        const embeddedURI = [URI.slice(0, trackIndex), embed, URI.slice(trackIndex)].join('');
        setEmbeddedTrackURI(embeddedURI);
      }

      const onSearchButtonClick = e => {
        e.preventDefault();
        createEmbeddedURI(trackURI);
        const trackId = identifyTrackId(trackURI);
        console.log("trackId",trackId)
        
        axios(`https://api.spotify.com/v1/tracks/${trackId}`, {
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        .then(tracksResponse => {
            console.log(tracksResponse);
            setTrackDetail({
                name: tracksResponse.data.name,
                album: tracksResponse.data.album,
                artists: tracksResponse.data.artists
            });
        })
      }



      return (
        <div className="container">
          <form onSubmit={onSearchButtonClick}>        
              <div className="col-sm-6 row form-group px-0">
              <input type="text" id="trackURI" name="trackURI" onChange={trackChanged.bind(this)}></input>
                <button type='submit' className="btn btn-success col-sm-12">
                  Search
                </button>
              </div>
              <div className="row">
              {trackDetail && <Detail {...trackDetail} /> }
              {embeddedTrackURI && 
              <iframe src={embeddedTrackURI} 
                      width="300" height="380" frameBorder="0" allowtransparency="true" 
                      allow="encrypted-media">
              </iframe>}
              </div>        
          </form>
        </div>
      );

}

export default AppNew;