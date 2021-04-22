'use strict';

const readline = require('readline');
const game = require('./game');

const rl = readline.createInterface(process.stdin, process.stdout);

const COMMAND_ERROR = Symbol();

rl.setPrompt('action?> ');
rl.prompt();

rl.on('line', (line) => {
    const [command, argument] = line.trim().split(' ');
    execute(command, argument).then(data => {
        console.log(data)
    });

}).on('close', function () {
    //DEFAULT ^c
    console.log('Leaving the game');
    process.exit(0);
});

function execute(command, argument) {
    let response;
    switch (command) {
        case 'where':
        case 'w':
            return game.getLocationInformation().then(locationInformation => {
                response = `you are in ${locationInformation.description}`;
                response += '\nand you can go to these location(s): '

                response += locationInformation.exits.reduce((allExits, exit)  => {
                    return allExits + `\n- ${exit}`;
                }, '');

                return Promise.resolve(response);
            });
        case 'goto':
        case 'g':
            if (argument === null || argument === undefined) {
                let err = new Error(`The input '${command}' needs an argument`)
                err.code = COMMAND_ERROR;
                return Promise.reject(err)
            }
            return new Promise((resolve, reject) => {
                game.goToLocation(argument).then(data => {
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })
            })
        default:
            let err = new Error(`The input: '${command}' is not defined`)
            err.code = COMMAND_ERROR;
            return Promise.reject(err);
    }
}