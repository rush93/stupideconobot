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
    let firstSplit = body.split("amountEarned&quot;&#x3A;");
    if (!firstSplit || firstSplit.length < 1) {
      return;
    }
    let secondSplit = firstSplit[1].split(",&quot;amountCounter");
    if (!secondSplit || secondSplit.length < 1) {
      return;
    }
    let found = Number(secondSplit[0]);

    firstSplit = body.split("goalAmount&quot;&#x3A;");
    if (!firstSplit || firstSplit.length < 1) {
      return;
    }
    secondSplit = firstSplit[1].split(",&quot;goalString");
    if (!secondSplit || secondSplit.length < 1) {
      return;
    }
    let goal = Number(secondSplit[0]);
    if (isNaN(found)) {
      return;
    }
    if (isNaN(goal)) {
      return;
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

      if(utip.channel && percent%10 === 0) {
        Utils.sendUtipMessage(utip, percent, utip.channel);
      }
    }
  });
}
module.exports = utipRequest;
