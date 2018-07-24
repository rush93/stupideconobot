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
      Utils.log('utip get request: no body', true);
      return;
    }
    let firstSplit = body.split("class=\"list-unstyled\"");
    if (!firstSplit || firstSplit.length < 2) {
      Utils.log('utip get request: first split fail', true);
      return;
    }
    let secondSplit = firstSplit[1].split("class=\"or-container tiplink-blocks\"");
    if (!secondSplit || secondSplit.length < 1) {
      Utils.log('utip get request: second split fail', true);
      return;
    }
    let lastSplit = secondSplit[0].replace(/\s/g,'').split("target");
    if (!lastSplit || lastSplit.length < 3) {
      Utils.log('utip get request: last split fail', true);
      return;
    }
    let part1 = lastSplit[0];
    let part2 = lastSplit[2];
    let regex1 = RegExp('[^0-9,]*([0-9,]+)€','g');
    let regex2 = RegExp('[^0-9,]*([0-9,]+)€','g');
    let resultReg1 = regex1.exec(part1);
    let resultReg2 = regex2.exec(part2);
    if(!resultReg1 || resultReg1.length < 2) {
      Utils.log('utip get request: first regex fail', true);
      return;
    }
    if(!resultReg2 || resultReg2.length < 2) {
      Utils.log('utip get request: second regex fail', true);
      return;
    }
    let found =  Number(resultReg1[1].replace(/,/g, '.'));
    let goal =  Number(resultReg2[1].replace(/,/g, '.'));
    if (isNaN(found)) {
      Utils.log('utip get request: found invalid', true);
      return;
    }
    if (isNaN(goal)) {
      Utils.log('utip get request: goal invalid', true);
      return;
    }
    if (found != utip.found) {
      utip.found = found;
    }
    if (goal != utip.goal) {
      utip.goal = goal;
    }
    let percent = Math.round(100 * utip.found / utip.goal);
    if(percent != utip.percent) {
      utip.percent = percent

      if(utip.channel) {
        Utils.sendUtipMessage(utip, percent, utip.channel);
      }
    }
  });
}
module.exports = utipRequest;
