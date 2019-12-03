var request = require('request');
var utip = require('../models/utip');
var Utils = require('../utils');

var utipRequest = function (guild) {
  if(!utip.url) {
    return;
  }
  request({
    url: utip.url
  }, (error, response, body) => {
    if (!body) {
      return;
    }
    try {
      let content = JSON.parse(body);
      
      let goal = content.stats.goalAmount;
      let found = content.stats.amountEarned / 100;
      if (isNaN(found)) {
        return;
      }
      if (isNaN(goal)) {
        return;
      }
      if (!utip.foundOfLastMonth) {
        utip.foundOfLastMonth = 0;
      }
      if (found < utip.found) {
        Utils.log('found < utip.found: ' + found + ' < ' + utip.found);
        utip.foundOfLastMonth = utip.found;
      }
      if (found != utip.found) {
        utip.found = found;
      }
      if (goal != utip.goal) {
        utip.goal = goal;
      }
      let percent = Math.floor(100 * utip.found / utip.goal);
      if(percent != utip.percent) {
        utip.percent = percent
  
        if(utip.channel && percent%10 === 0 && utip.lastPercentAnnounce != percent && utip.foundOfLastMonth < utip.found) {
          Utils.sendUtipMessage(utip, percent, utip.channel);
          utip.lastPercentAnnounce = percent;
        }
      }
    } catch(e) {
      Utils.log('erreur de parse utip:' + e, true);
    }
  });
}
module.exports = utipRequest;
