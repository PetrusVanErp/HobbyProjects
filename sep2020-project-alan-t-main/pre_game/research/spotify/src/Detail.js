import React from 'react';

const Detail = ({album, artists, name}) => {
    console.log("album", album);
    console.log("artists", artists);
    console.log("name", name);

    return (
        <div className="offset-md-1 col-sm-4" >
            <div className="row col-sm-12 px-0">
                <img 
                    src={album.images[0].url}
                    alt={name}>                    
                </img>
                <label htmlFor={album.name} className="form-label col-sm-12">
                    Album: {album.name}
                </label>
            </div>
            <div className="row col-sm-12 px-0">
                <label htmlFor={name} className="form-label col-sm-12">
                    Song: {name}
                </label>
            </div>
            <div className="row col-sm-12 px-0">
                <label htmlFor={artists[0].name} className="form-label col-sm-12">
                    Artist: {artists[0].name}
                </label>
            </div>
        </div>
    );
}

export default Detail;