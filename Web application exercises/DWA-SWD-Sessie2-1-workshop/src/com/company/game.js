'use strict';

const request = require('request');

let game = {};

let player = {
    location: 'town',
    items: []
};

let map = {
    town: {
        description: 'a town',
        items: ['coin','sword'],
        exits: ['forest', 'mountain']
    },
    forest: {
        description: 'a forest',
        items: ['coin','axe'],
        exits: ['town', 'mountain']
    },
    mountain: {
        description: 'a mountain',
        items: ['coin'],
        exits: ['forest', 'town']
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
 * @param next
 * e.g. done(err, null), when the request to the map server fails for whatever reason.
 * Otherwise it will receives the description of the location the player is now in,
 * e.g done(null, locationDescription).
 *
 */
game.goToLocation = (locationName, next) => {
    request(`http://localhost:3000/${locationName}`, null, (err, response, body) => {
        let newLocation = JSON.parse(body);
        if(err) {
            return next("Could not find a location with that name", null)
        }
        player.location = locationName
        return next(null, newLocation.description)
    });
};

/**
 * Returns an object containing the description and the
 * exits of the players current location on the map.
 * @returns {Object}
 */
game.getLocationInformation = () => {
    const playerLocation = map[player.location];

    let locationInfo = {
        description: playerLocation.description,
        exits: playerLocation.exits
    };

    return locationInfo;
};

module.exports = game;