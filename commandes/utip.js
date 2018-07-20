const Utils = require('../utils');
var Constants = require('../models/constants');
var utip = require('../models/utip');

var commands = {
  channel: {
      help: [
          'Permet de changer les messages utip seront affiché.'
      ],
      args: '[#channel]',
      runCommand: (args, message) => {
        if (args.length === 0) {
          Utils.reply(message, "**channel: **: <#" + utip.channel + ">");
          return;
        }
        if (!message.mentions.channels && !message.mentions.channels.first()) {
            Utils.reply(message,"il faut mentioner un channel.",true);
            return;
        }
        utip.channel = message.mentions.channels.first().id;
        Utils.reply(message, 'Le channel d\'anonces à bien été modifié.');
      }
  }
}
var help = function (message) {
  var keys = Object.keys(commands);
  var fields = [];
  keys.forEach((command, index) => {
      fields.push({
          text: commands[command].help,
          title: `${Constants.prefix}utip ${command} ${commands[command].args}`,
          grid: false
      });
  });
  Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes utip', "", message.author, fields);
}

module.exports = {
  role: 'MANAGE_GUILD',
  helpCat: 'Permet de changer les configurations des messages utip',
  help,
  runCommand: (args, message) => {
      if (!message.member.hasPermission("MANAGE_GUILD")) {
          Utils.reply(message, "Vous n'avez pas les permissions pour changer les paramètres utip", true);
          return;
      }
      if (commands[args[0]]) {
          var label = args[0];
          args.shift();
          commands[label].runCommand(args, message);
      } else {
          help(message);
      }
  }
}