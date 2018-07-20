var request = require('request');
var youtubeApiKey = require('../youtubeApiKey');
var youtube = require('../models/youtube');
var Utils = require('../utils');

var youtubeRequest = function () {
  if (!youtube.channel || !Utils.guild) {
    return;
  }
  request({
    url: "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCyJDHgrsUKuWLe05GvC2lng&key="+youtubeApiKey
  }, (error, response, body) => {
    var result = JSON.parse(body);
    var nb = result.items[0].statistics.subscriberCount;
    if (nb != youtube.lastNbSubscribers && Math.floor(youtube.lastNbSubscribers/youtube.interval) <  Math.floor(nb/youtube.interval)) {

      oldcap = youtube.getNextCap(youtube.lastNbSubscribers);
      cap = youtube.getNextCap(nb);
      if (oldcap < cap && youtube.capmessages.length > 0) {
        message = youtube.capmessages[Math.floor(Math.random()*youtube.capmessages.length)]

      } else {
        message = youtube.messages[Math.floor(Math.random()*youtube.messages.length)]
      }
      message = message.replace(new RegExp('%total%', 'g'), Utils.spacer(nb));
      message = message.replace(new RegExp('%cap%', 'g'), Utils.spacer(cap));
      message = message.replace(new RegExp('%oldcap%', 'g'), Utils.spacer(oldcap));
      message = message.replace(new RegExp('%cap-total%', 'g'), Utils.spacer(cap - nb));
      Utils.guild.channels.get(youtube.channel).send(message);
    }
    if(nb != youtube.lastNbSubscribers) {
      youtube.lastNbSubscribers = nb;
    }
  })
  
}
module.exports = youtubeRequest;
