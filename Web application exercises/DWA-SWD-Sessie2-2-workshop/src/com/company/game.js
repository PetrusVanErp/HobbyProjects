const fetch = require('node-fetch');

let game = {};

let player = {
    location: 'town',
    items: []
};

let map = {
    town: {
        description: 'a town',
        exits: ['forest', 'mountain']
    }
};
/**
 * Checks if there is a connection between the player current location
 * and the location represented by the give locationName and moves the
 * player to that location.
 * Otherwise it does nothing.
 *
 * If this destination location is already visited, the local copy is
 * loaded (e.g. the one in the map variable)
 * Otherwise a request for this location is issued to the server and the
 * response is added to the local copy of the map.
 *
 * @async
 * @param {String} locationName - The name of the location the player wants to move to.
 *
 * @returns {Promise} Promise object holding the name of the location the player is.
 *
 */
game.goToLocation = (locationName) => {
    return new Promise((resolve, reject) => {
        if(!map[player.location].exits.includes(locationName)) {
            reject(`You can not go to ${locationName} from ${player.location}`)
        } else if (map[locationName]) {
            player.location = locationName
            resolve(map[locationName])
        } else {
            fetch(`http://localhost:3000/${locationName}`).then(response => {
                return response.json();
            }).then(data => {
                player.location = locationName
                map[locationName] = data
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        }
    })
};

/**
 * Returns an object containing the description and the
 * exits of the players current location on the map.
 *
 * @returns {Promnise} Promise object containing the location information object.
 */
game.getLocationInformation = () => {
    const playerLocation = map[player.location];

    let locationInfo = {
        description: playerLocation.description,
        exits: playerLocation.exits
    };

    return Promise.resolve(locationInfo);
};

module.exports = game;