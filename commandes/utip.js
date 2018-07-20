const Utils = require('../utils');
var Constants = require('../models/constants');
var utip = require('../models/utip');


module.exports = {
    role: 'SEND_MESSAGES',
    helpCat: 'Permet de voir les informations utip',
    help:  function (message) {
      Utils.sendEmbed(message, 0x00AFFF, "Utilisation de la commande utip", "", message.author, [{
          title: Constants.prefix + 'utip',
          text: "Permet de voir les informations utip",
          grid: false
      }]);
    },
    runCommand: (args, message) => {
      var percent = Math.round(100 * utip.found / utip.goal);
      var found = utip.found.toLocaleString('fr-FR', {style:'decimal', minimumFractionDigits: '2'});
      var goal = utip.goal.toLocaleString('fr-FR', {style:'decimal', minimumFractionDigits: '2'});
      Utils.sendEmbed(message, 0x00AFFF, "Utip Stupid Economics",`le utip est a **${percent}%** de son objectif ( ${found}€/${goal}€ ).
Récompenser nous avec uTip: ${utip.url}`, message.author, []);
    }
}