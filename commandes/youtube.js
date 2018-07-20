const Utils = require('../utils');
var youtube = require('../models/youtube');
var Constants = require('../models/constants');

var commands = {
    interval: {
        help: [
            'Permet de changer l\'interval d\'abonné à afficher.'
        ],
        args: '[nombre]',
        runCommand: (args, message) => {
            if (args.length === 0) {
                Utils.reply(message, "**Interval**: " + youtube.interval);
                return;
            }
            interval = Number(args[0])
            if (isNaN(interval) || interval < 0) {
              Utils.reply(message, 'L\'interval dois être un nombre plus grand que 0.', true)
            }
            youtube.interval = interval;
            Utils.reply(message, 'L\'interval a bien été modifié.');
        }
    },
    channel: {
        help: [
            'Permet de changer le message ou le nombre d\'abonné sera affiché.'
        ],
        args: '[#channel]',
        runCommand: (args, message) => {
          if (args.length === 0) {
            Utils.reply(message, "**channel: **: <#" + youtube.channel + ">");
            return;
          }
          if (!message.mentions.channels && !message.mentions.channels.first()) {
              Utils.reply(message,"il faut mentioner un channel.",true);
              return;
          }
          youtube.channel = message.mentions.channels.first().id;
          Utils.reply(message, 'Le channel d\'anonces à bien été modifié.');
        }
    },
    messages: {
        help: [
            'Permet de lister les messages.'
        ],
        args: '',
        runCommand: (args, message) => {
          messages = youtube.messages;
          if (messages.length === 0) {
            Utils.reply(message, "Pas de messages configuré.");
            return;
          }
          fields = [];
          for (var i = 0; i < messages.length; i++) {
            fields.push({
              title: `Message numéro: ${i+1}`,
              text: messages[i],
              grid: false
            });
          }
          Utils.sendEmbed(message, 0xE8C408, 'Liste des messges:', '', message.author, fields, null, 10);
        }
    },
    addmessage: {
      help: [
        'Permet d\'ajouter un message dans la liste',
        '**%total%** pour le nombre total d\'abonnés',
        '**%cap%** pour le prochain cap d\'abonné à avoir',
        '**%cap-total%** pour le nombre total d\'abonnés soustrais tu cap'
      ],
      args: '<message>',
      runCommand: (args, message) => {
        if (args.length === 0) {
          Utils.reply(message, 'Veuillez mettre un message à ajouter.', true);
          return;
        }
        youtube.addMessage(args.join(' '));
        Utils.reply(message, 'Le message à bien été ajouté.');
      }
    },
    deldessage: {
      help: [
        'Permet de supprimer un message dans la liste'
      ],
      args: '<index>',
      runCommand: (args, message) => {
        if (args.length === 0) {
          Utils.reply(message, 'Veuillez renseigner l\'index du message à supprimé.', true);
          return;
        }
        var index = Number(args[0]);
        if (isNaN(index) || index - 1 <= 0 || index > youtube.messages.length) {
          Utils.reply(message, `L'index doit être compris entre 1 et ${youtube.messages.length} .`, true);
          return;
        }
        youtube.delMessage(index - 1);
        Utils.reply(message, 'Le message à bien été supprimé.');
      }
    },
    capmessages: {
        help: [
            'Permet de lister les messages de passage de caps.'
        ],
        args: '',
        runCommand: (args, message) => {
          messages = youtube.capmessages;
          if (messages.length === 0) {
            Utils.reply(message, "Pas de messages configuré.");
            return;
          }
          fields = [];
          for (var i = 0; i < messages.length; i++) {
            fields.push({
              title: `Message numéro: ${i+1}`,
              text: messages[i],
              grid: false
            });
          }
          Utils.sendEmbed(message, 0xE8C408, 'Liste des messges de passage de cap:', '', message.author, fields, null, 10);
        }
    },
    addcapmessage: {
      help: [
        'Permet d\'ajouter un message de passage de cap dans la liste',
        '**%total%** pour le nombre total d\'abonnés',
        '**%cap%** pour le prochain cap d\'abonné à avoir',
        '**%cap-total%** pour le nombre total d\'abonnés soustrais tu cap',
        '**%oldcap%** pour le précédent cap d\'abonné obtenu'
      ],
      args: '<message>',
      runCommand: (args, message) => {
        if (args.length === 0) {
          Utils.reply(message, 'Veuillez mettre un message à ajouter.', true);
          return;
        }
        youtube.addCapMessage(args.join(' '));
        Utils.reply(message, 'Le message à bien été ajouté.');
      }
    },
    delcapmessage: {
      help: [
        'Permet de supprimer un message de passage de cap dans la liste'
      ],
      args: '<index>',
      runCommand: (args, message) => {
        if (args.length === 0) {
          Utils.reply(message, 'Veuillez renseigner l\'index du message à supprimé.', true);
          return;
        }
        var index = Number(args[0]);
        if (isNaN(index) || index - 1 <= 0 || index > youtube.capmessages.length) {
          Utils.reply(message, `L'index doit être compris entre 1 et ${youtube.capmessages.length} .`, true);
          return;
        }
        youtube.delCapMessage(index - 1);
        Utils.reply(message, 'Le message à bien été supprimé.');
      }
    }
}

var help = function (message) {
    var keys = Object.keys(commands);
    var fields = [];
    keys.forEach((command, index) => {
        fields.push({
            text: commands[command].help,
            title: `${Constants.prefix}youtube ${command} ${commands[command].args}`,
            grid: false
        });
    });
    Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes youtube', "", message.author, fields);
}

module.exports = {
    role: 'MANAGE_GUILD',
    helpCat: 'Permet de changer les configurations des messages youtube',
    help,
    runCommand: (args, message) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            Utils.reply(message, "Vous n'avez pas les permissions pour changer les paramètres youtube", true);
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