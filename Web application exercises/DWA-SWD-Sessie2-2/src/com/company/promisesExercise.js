const pw = require('../../promise-wrappers');

Promise.resolve(() => {
    let users = readFileP("./users.json").then(() => {
        users.forEach(user => pw.writeFileP(`${user.account}`, user.username))})
        .then(() => {
            console.log('done');
    })
}).catch(err => {
    console.log(err.message);
});