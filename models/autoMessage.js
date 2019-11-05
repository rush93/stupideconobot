var fs = require('fs');
var Utils = require('../utils');
var autoMessages = []

function save() {
    fs.writeFile(__dirname + "/../data/auto_messages.json", JSON.stringify(autoMessages), function (err) {
        if (err) {
            return Utils.log(err, true);
        }
    });
}

function load() {
    return new Promise((resolve, reject) => {

        fs.readFile(__dirname + '/../data/auto_messages.json', (err, data) => {
            if (err) return;
            autoMessages = JSON.parse(data);
            resolve(autoMessages);
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
  addMessage(channelId, time, message) {
    autoMessages.push({
      channelId,
      time,
      message
    });
    save();
  },
  getAutoMessage(id) {
    return autoMessages[id];
  },
  deleteAutoMessage(id) {
    autoMessages.splice(id, 1);
    save();
  },
  editAutoMessage(id, channelId, time, message) {
    autoMessages[id] = {
      channelId,
      time,
      message
    }
    save();
  },
  getAllMessages() {
    return autoMessages;
  }
};