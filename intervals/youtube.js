var request = require('request');
var youtubeApiKey = require('../youtubeApiKey');
var youtube = require('../models/youtube');
var Utils = require('../utils');
const channelYoutubeId = 'UCyJDHgrsUKuWLe05GvC2lng';

var youtubeRequest = function (guild) {
  request({
   url: "https://www.googleapis.com/youtube/v3/channels?part=statistics&id="+channelYoutubeId+"&key="+youtubeApiKey,
  }, (error, response, body) => {
    let result = JSON.parse(body);
    let nb = result.items[0].statistics.subscriberCount;
    if (
      nb !== youtube.lastNbSubscribers 
      && Math.floor(youtube.lastNbSubscribers/youtube.interval) <  Math.floor(nb/youtube.interval)
      && youtube.channel
    ) {
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
      guild.channels.get(youtube.channel).send(message);
    }
    if(nb !== youtube.lastNbSubscribers) {
      youtube.lastNbSubscribers = nb;
    }
  });
}
module.exports = youtubeRequest;
