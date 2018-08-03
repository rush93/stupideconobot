const Utils = require('../utils');
var RoleAction = require('../models/roleAction');
var Constants = require('../models/constants');

var commands = {
    list: {
        help: [
            'Permet de lister les roleactions.'
        ],
        args: '',
        runCommand: (args, message) => {
          let actions = RoleAction.roleActions;
          let messageKeys = Object.keys(actions);
          let fields = [];
          let hasRoleActions = false;
          for (let messageId of messageKeys) {
            let messageAction = actions[messageId]
            let emojiKeys = Object.keys(messageAction);
            for (let emojiId of emojiKeys) {
              if(emojiId === 'channelid') { continue; }
              let emoji = messageAction[emojiId];
              hasRoleActions = true;
              let role = Utils.guild.roles.get(emoji.role);
              if ( !role ) {
                continue;
              }
              fields.push({
                title: `réaction qui ajoute le role: ${role.name}`,
                text: `** - Ajoute le role**: ${role}\n** - Réagir avec**: ${emoji.display}\n** - Sur le message**: ${messageId}\n** - Dans le channel**: <#${messageAction.channelid}>`,
                grid: false
              });
            }
          }
          if (!hasRoleActions) {
            Utils.reply(message, 'Aucuns role action configuré.', true);
            return;
          }
          Utils.sendEmbed(message, 0xE8C408, 'Liste des role actions:', '', message.author, fields, null, 10);
        }
    },
    add: {
      help: [
        'Permet d\'ajouter un roleaction'
      ],
      args: '<emoji> <@role> <messageid> [channelid]',
      runCommand: (args, message) => {
        if (args.length < 3) {
          Utils.reply(message, 'Les paramètres de la commande ne sont pas bon.', true);
          return;
        }
        let emoji = args[0];
        let result = /^<:[^:]+:([0-9]+)>$/g.exec(emoji);
        if (result) {
          emoji = Utils.guild.emojis.get(result[1]);
          if(!emoji) {
            Utils.log(message, 'Cet emoji est introuvable sur le serveur.', true)
            return;
          }
        }
        let role = message.mentions.roles.first();
        if (!role) {
          Utils.reply(message, 'Vous devez mentionner un role.', true);
          return;
        } 
        let channel = args[3] ? Utils.guild.channels.get(args[3]) : message.channel;
        if (!channel) {
          Utils.reply(message, 'Le channel est introuvable', true);
          return;
        }
        channel.fetchMessage(args[2]).then((reactionMessage) => {
          RoleAction.setRoleAction(emoji, reactionMessage, role.id);
          Utils.reply(message, 'le role action a bien été ajouté.');
        }).catch(() => {
          Utils.reply(message, 'Le message est introuvable dans le channel ' + channel.name, true);
        });
      }
    },
    delete: {
      help: [
        'Permet de supprimer un roleaction'
      ],
      args: '<emoji> <messageid>',
      runCommand: (args, message) => {
        if (args.length < 2) {
          Utils.reply(message, 'Les paramètres de la commande ne sont pas bon.', true);
          return;
        }
        let emoji = args[0];
        let result = /^<:[^:]+:([0-9]+)>$/g.exec(emoji);
        if (result) {
          emoji = Utils.guild.emojis.get(result[1]);
          if(!emoji) {
            Utils.log(message, 'Cet emoji est introuvable sur le serveur.', true)
            return;
          }
          emoji = emoji.id;
        }
        let messageid = args[1];
        RoleAction.removeRoleAction(emoji, messageid);
        Utils.reply(message, 'le role action a bien été supprimé.');
      }
    }
}

var help = function (message) {
    var keys = Object.keys(commands);
    var fields = [];
    keys.forEach((command, index) => {
        fields.push({
            text: commands[command].help,
            title: `${Constants.prefix}roleaction ${command} ${commands[command].args}`,
            grid: false
        });
    });
    Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes roleaction', "", message.author, fields);
}

module.exports = {
    role: 'MANAGE_GUILD',
    helpCat: 'Permet de gérer les réations au messages',
    help,
    runCommand: (args, message) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            Utils.reply(message, "Vous n'avez pas les permissions pour changer les roleaction", true);
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