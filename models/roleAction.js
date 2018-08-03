var fs = require('fs');
var Utils = require('../utils');
var roleActions = {};

function save() {
    fs.writeFile(__dirname + "/../data/roleAction.json", JSON.stringify(roleActions), function (err) {
        if (err) {
            return Utils.log(err, true);
        }
        Utils.log(`The ${Utils.Color.FgYellow}roleActions${Utils.Color.Reset} file was saved!`);
    });
}

function load() {
    return new Promise((resolve, reject) => {

        fs.readFile(__dirname + '/../data/roleAction.json', (err, data) => {
            if (err) return;
            roleActions = JSON.parse(data);
            resolve(roleActions);
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
    setRoleAction(emoji, message, roleId) {
      if (!roleActions[message.id]) {
        roleActions[message.id] = {
          'channelid': message.channel.id
        }
      }
      let id = emoji;
      if(emoji.id) {
        id = emoji.id;
      }
      roleActions[message.id][id] = {
        display: emoji.id ? `<:${emoji.name}:${emoji.id}>`: `${emoji}`,
        role: roleId
      };
      save();
      return roleActions;
    },
    removeRoleAction(emojiId, messageId) {
      if (!roleActions[messageId] || !roleActions[messageId][emojiId]) {
        return;
      }
      delete roleActions[messageId][emojiId];
      save();
      return roleActions;
    },
    getRole(emojiId, messageId) {
      if(!roleActions[messageId]) {
        return null;
      }
      return roleActions[messageId][emojiId].role;
    },
    get roleActions() {
      return roleActions;
    }
};