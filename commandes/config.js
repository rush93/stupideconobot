const Utils = require('../utils');
const Discord = require('discord.js');
var constants = require('../models/constants');

var commands = {
    prefix: {
        help: [
            'Permet de changer le préfix des commandes du bot.'
        ],
        args: '[prefix]',
        runCommand: (args, message) => {
            if (args.length === 0) {
                Utils.reply(message, "**Préfix**: " + constants.prefix);
                return;
            }
            constants.prefix = args.join(' ');
            Utils.reply(message, 'Le préfix a bien été modifié.');
        }
    },
    logChannel: {
        help: [
            'le channel ou seront log les commandes.',
        ],
        args: '[#channel]',
        runCommand: (args, message) => {
            if (args.length === 0) {
                Utils.reply(message, "**channel: **: <#" + constants.logChannel + ">");
                return;
            }
            if (!message.mentions.channels && !message.mentions.channels.first()) {
                Utils.reply(message,"il faut mentioner un channel.",true);
                return;
            }
            constants.logChannel = message.mentions.channels.first().id;
            Utils.reply(message, 'Le channel de log à bien été modifié.');
        }
    }
}

var help = function (message) {
    var keys = Object.keys(commands);
    var fields = [];
    keys.forEach((command, index) => {
        fields.push({
            text: commands[command].help,
            title: `${constants.prefix}config ${command} ${commands[command].args}`,
            grid: false
        });
    });
    Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes de config', "", message.author, fields);
}

module.exports = {
    role: 'MANAGE_GUILD',
    helpCat: 'Permet de changer les configurations de base du bot',
    help,
    runCommand: (args, message) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            Utils.reply(message, "Vous n'avez pas les permissions pour changer les config", true);
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