const Utils = require('../utils');
var Constants = require('../models/constants');
var AutoMessage = require('../models/autoMessage');
const AutoMessageService = require('../services/autoMessage');

var commands = {
  add: {
    help: [
        'Permet d\'ajouter un message.'
    ],
    args: '<#channel> <time(H:mm)> <message(`_automessage format`)>',
    runCommand: (args, message) => {
      if (args.length < 2) {
        Utils.reply(message, "Vous devez fournir un channel, une heure et un message", true);
        return;
      }
      let channel = message.mentions.channels.first();
      args.shift();
      if (!channel) {
        Utils.reply(message, "Vous devez mentionner un channel", true);
        return;
      }
      
      let time = args.shift();
      if(!/^[0-9]{1,2}:([0-9]{2}$)/g.test(time)) {
        Utils.reply(message, "Format de l'heure incorrect, il dois être en format: H:mm exemple: `9:02` ou `10:20`", true);
        return;
      }
      AutoMessage.addMessage(channel.id, time, args.join(' '));
      Utils.reply(message, "Le message à bien été enregistré");
    }
  },
  list: {
    help: [
        'Permet de lister les messages.'
    ],
    args: '',
    runCommand: (args, message) => {
      const autoMessages = AutoMessage.getAllMessages();
      let fields = []; 
      for(let i = 0; i < autoMessages.length; i++) {
        let autoMessage = autoMessages[i];
        fields.push({
          title: `Message numéro: ${i+1}`,
          text: `à: ${autoMessage.time}\nAffiche: \`${autoMessage.message}\`\ndans: <#${autoMessage.channelId}>`,
          grid: false
        });
      }
      Utils.sendEmbed(message, 0xE8C408, 'Liste des messages:', '', message.author, fields, null, 10);
    }
  },
  edit: {
    help: [
        'Permet d\'editer un message.'
    ],
    args: '<id> <#channel> <time(hh:mm)> <message>',
    runCommand: (args, message) => {
      if (args.length < 3) {
        Utils.reply(message, "Vous devez fournir un id, un channel, une heure et un message", true);
        return;
      }
      let id = Number(args.shift());
      if(isNaN(id)) {
        Utils.reply(message, "l'id dois être un entier", true);
        return;
      }
      id-=1;
      if(!AutoMessage.getAutoMessage(id)) {
        Utils.reply(message, "Aucun message avec cet id.", true);
        return;
      }

      let channel = message.mentions.channels.first();
      args.shift();
      if (!channel) {
        Utils.reply(message, "Vous devez mentionner un channel", true);
        return;
      }

      let time = args.shift();
      if(!/^[0-9]{1,2}:([0-9]{2}$)/g.test(time)) {
        Utils.reply(message, "Format de l'heure incorrect, il dois être en format: hh:mm exemple: `9:02` ou `10:20`", true);
        return;
      }
      AutoMessage.editAutoMessage(id,channel.id, time, args.join(' '));
      Utils.reply(message, "Le message à bien été modifié");
    }
  },
  delete: {
    help: [
        'Permet de supprimer un message.'
    ],
    args: '<id>',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, "Vous devez fournir un id", true);
        return;
      }
      let id = Number(args.shift());
      if(isNaN(id)) {
        Utils.reply(message, "l'id dois être un entier", true);
        return;
      }
      id-=1;
      if(!AutoMessage.getAutoMessage(id)) {
        Utils.reply(message, "Aucun message avec cet id.", true);
        return;
      }
      AutoMessage.deleteAutoMessage(id);
      Utils.reply(message, "Le message à bien été supprimé");
    }
  },
  format: {
    help: [
        'Explication des formatages des messages'
    ],
    args: '',
    runCommand: (args, message) => {
      let fields = [{
        title: `\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_`,
        text: `**__Liste des variables:__**`,
        grid: false
      }]
      let formats = AutoMessageService.allFormat;
      for(const format of formats) {
        fields.push({
          title: `${format.name}`,
          text: `${format.desc}`,
          grid: true
        });
      }
      Utils.sendEmbed(message, 0xE8C408, 'Formatage des messages:', `Le message peu contenir au choix des variables qui doivent être entourée d'acollades, exemple:\npour afficher: \`on as 10 abonnés\` = \`on as {{youtube.subscribers}} abonnés\`\npour afficher: \` dans le doc: blabla est ecrit\` = \`dans le doc: {{gdoc.cell:B7}} est ecrit\``, message.author, fields, null, 10);
    }
  },
  test: {
    help: [
        'Affiche le message avec les bonnes variables'
    ],
    args: '<id>',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, "Vous devez fournir un id", true);
        return;
      }
      let id = Number(args.shift());
      if(isNaN(id)) {
        Utils.reply(message, "l'id dois être un entier", true);
        return;
      }
      id-=1;
      let autoMessage = AutoMessage.getAutoMessage(id)
      if(!autoMessage) {
        Utils.reply(message, "Aucun message avec cet id.", true);
        return;
      }
      AutoMessageService.replaceVar(autoMessage).then((messageToSend) => {
        Utils.reply(message, messageToSend);
      })
    }
  }
}
var help = function (message) {
  var keys = Object.keys(commands);
  var fields = [];
  keys.forEach((command, index) => {
      fields.push({
          text: commands[command].help,
          title: `${Constants.prefix}automessages ${command} ${commands[command].args}`,
          grid: false
      });
  });
  Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes de messages automatiques', "", message.author, fields);
}

module.exports = {
  role: 'MANAGE_GUILD',
  helpCat: 'Permet de changer les configurations des messages automatiques',
  help,
  runCommand: (args, message) => {
      if (!message.member.hasPermission("MANAGE_GUILD")) {
          Utils.reply(message, "Vous n'avez pas les permissions pour changer les messages automatiques", true);
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