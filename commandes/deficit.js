const Utils = require('../utils');
var Constants = require('../models/constants');
var Gdoc = require('../models/gdoc');

var commands = {
  sheet: {
    help: [
        'Permet de changer le doc qui sera utilisé.'
    ],
    args: '[google sheet id]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, "**sheet: **: " + Gdoc.sheetId + "");
        return;
      }
      Gdoc.sheetId = args[0];
      Utils.reply(message, "Le google doc à bien été modifié.");
    }
  },
  cell: {
    help: [
        'Permet de changer la cellule qui sera utilisé.'
    ],
    args: '[google cell pos]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, "**cell: **: " + Gdoc.cell + "");
        return;
      }
      Gdoc.cell = args[0];
      Utils.reply(message, "La cellule à bien été modifiée.");
    }
  }
}
var help = function (message) {
  var keys = Object.keys(commands);
  var fields = [];
  keys.forEach((command, index) => {
      fields.push({
          text: commands[command].help,
          title: `${Constants.prefix}deficit ${command} ${commands[command].args}`,
          grid: false
      });
  });
  Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes deficit', "", message.author, fields);
}

module.exports = {
  role: 'MANAGE_GUILD',
  helpCat: 'Permet de changer les configurations des messages deficit',
  help,
  runCommand: (args, message) => {
      if (!message.member.hasPermission("MANAGE_GUILD")) {
          Utils.reply(message, "Vous n'avez pas les permissions pour changer les paramètres de deficit", true);
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