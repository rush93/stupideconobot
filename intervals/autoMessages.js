const AutoMessage = require('../models/autoMessage');
const AutoMessageService = require('../services/autoMessage');
const Utils = require('../utils');
const moment = require('moment');

var AutoMessageRequest = (guild) => {
  const autoMessages = AutoMessage.getAllMessages();
  curTime = moment().format('H:mm')
  for (let message of autoMessages) {
    if (message.time == curTime) {
      AutoMessageService.replaceVar(message).then((replaced) => {
        Utils.sendEmbedInChannel(guild.channels.get(message.channelId), 0x00AFFF, replaced,'',null,[]);
      });
    }
  }
}
module.exports = AutoMessageRequest;