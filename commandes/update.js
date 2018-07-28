const Utils = require('../utils');
var Constants = require('../models/constants');

module.exports = {
    role: 'SEND_MESSAGES',
    helpCat: 'Permet d\'update puis restart le bot',
    help: function (message) {
        Utils.sendEmbed(message, 0x00AFFF, "Utilisation de la commande update", "", message.author, [{
            title: Constants.prefix + 'update',
            text: "Permet d\'update puis restart le bot",
            grid: false
        }]);
    },
    runCommand: (args, message) => {
      if (!message.member.hasPermission("MANAGE_GUILD")) {
        Utils.reply(message, "Vous n'avez pas les permissions pour update le bot", true);
        return;
      }
      Utils.reply(message, "Update du bot...");
      process.exit(42);
    }
}