const Utils = require('../utils');
var Constants = require('../models/constants');

module.exports = {
    role: 'SEND_MESSAGES',
    helpCat: 'Permet de restart le bot',
    help: function (message) {
        Utils.sendEmbed(message, 0x00AFFF, "Utilisation de la commande restart", "", message.author, [{
            title: Constants.prefix + 'restart',
            text: "Permet de restart le bot",
            grid: false
        }]);
    },
    runCommand: (args, message) => {
      if (!message.member.hasPermission("MANAGE_GUILD")) {
        Utils.reply(message, "Vous n'avez pas les permissions pour reload le bot", true);
        return;
      }
      Utils.reply(message, "Restart du bot...");
      process.exit(1);
    }
}