
const Discord = require('discord.js');
const bot = new Discord.Client();
const Utils = require('./utils');
var request = require('request');
var token = require('./token');
var youtubeApiKey = require('./youtubeApiKey');

var guild = null;

var globalConst = require('./models/constants');
var youtube = require('./models/youtube');
globalConst.init();
youtube.init();

Utils.setConfig(globalConst);
var configCommands = require('./commandes/config');
var youtubeCommands = require('./commandes/youtube');

var commands = {
  config: configCommands,
  youtube: youtubeCommands
}
try {
  bot.on('ready', function () {
    Utils.log(Utils.Color.FgGreen + 'bot started');
    bot.user.setActivity(globalConst.prefix + 'help pour la liste des commandes');
  });
} catch (e) {
  Utils.log(e.stack, true);
}

var runCommand = (args, message) => {
  if (args[0] === globalConst.prefix + 'help') {
    Utils.log(`running ${Utils.Color.FgYellow}help ${Utils.Color.Reset}command`);
    if (args.length > 1) {
      if (commands[args[1]] && message.member.hasPermission(commands[args[1]].role)) {
        commands[args[1]].help(message);
        return;
      }
      Utils.reply(message, `Aucune commande du nom de **${args[1]}**.`, true)
      return;
    }
    var keys = Object.keys(commands);
    var fields = [];
    keys.forEach((command) => {
      if (message.member.hasPermission(commands[command].role)) {
        fields.push({
          text: commands[command].helpCat,
          title: command,
          grid: false
        });
      }
    });
    Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes', "Pour plus d'info sur une commandes faites **" + globalConst.prefix + "help [commande]**", message.author, fields);
    return;
  }
  args[0] = args[0].replace(globalConst.prefix, '');
  if (commands[args[0]]) {
    var label = args[0];
    Utils.log(`running ${Utils.Color.FgYellow}${label} ${Utils.Color.Reset}command`);
    args.shift();
    commands[label].runCommand(args, message);
    return;
  }
}
bot.on('message', function (message) {
  try {
    if (message.content.substring(0, globalConst.prefix.length) === globalConst.prefix) {
      var args = message.content.split(" ");
      Utils.log('Command detected', false, message.channel.name, message.author.username, message.content);
      Utils.log(`fetching for ${Utils.Color.FgYellow}${message.author.username}${Utils.Color.Reset}`);
      message.channel.guild.fetchMember(message.author.id).then(member => {
        message.member = member
        runCommand(args, message);
      }).catch((e) => {
        Utils.log(e.stack, true);
      });
    }
  } catch (e) {
    Utils.log(e.stack, true);
  }
});

try {
  bot.login(token).then(() => {
    guild = bot.guilds.first()
    Utils.setGuild(guild);
    runYoutubeAdvert();
  }).catch((e) => {
    Utils.log(e, true);
  })
  bot.on('error', (err) => {
    Utils.log(err.stack, true);
  });
} catch (err) {
  Utils.log(err.stack, true);
}

var runYoutubeAdvert = () => {
  if (!youtube.channel || !guild) {
    return;
  }
  request({
    url: "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCyJDHgrsUKuWLe05GvC2lng&key="+youtubeApiKey
  }, (error, response, body) => {
    var result = JSON.parse(body);
    var nb = result.items[0].statistics.subscriberCount;
    if (nb != youtube.lastNbSubscribers && Math.floor(youtube.lastNbSubscribers/youtube.interval) <  Math.floor(nb/youtube.interval)) {

      cap = youtube.getNextCap(nb);
      message = youtube.messages[Math.floor(Math.random()*youtube.messages.length)]
      message = message.replace(new RegExp('%total%', 'g'), nb);
      message = message.replace(new RegExp('%cap%', 'g'), cap);
      message = message.replace(new RegExp('%cap-total%', 'g'), cap - nb);
      youtube.lastNbSubscribers = nb;
      guild.channels.get(youtube.channel).send(message);
    }
  })
  
} 
setTimeout(() => {
  runYoutubeAdvert();
}, 1000);