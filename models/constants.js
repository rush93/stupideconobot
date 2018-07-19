var fs = require('fs');
var Utils = require('../utils');
var constants = {
    prefix: "_",
    logChannel: null
}

function save() {
    fs.writeFile(__dirname + "/../data/constants.json", JSON.stringify(constants), function (err) {
        if (err) {
            return Utils.log(err, true);
        }
        Utils.log(`The ${Utils.Color.FgYellow}constants${Utils.Color.Reset} file was saved!`);
    });
}

function load() {
    return new Promise((resolve, reject) => {

        fs.readFile(__dirname + '/../data/constants.json', (err, data) => {
            if (err) return;
            constants = JSON.parse(data);
            resolve(constants);
        });
    })
}

module.exports = {
    init: function () {
        return new Promise((resolve, reject) => {
            load()
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    },
    get prefix() {
        return constants.prefix;
    },
    get logChannel() {
        return constants.logChannel;
    },
    set prefix(prefix) {
        constants.prefix = prefix;
        save();
        return constants.prefix;
    },
    set logChannel(logChannel) {
        constants.logChannel = logChannel;
        save();
        return constants.logChannel;
    }
};