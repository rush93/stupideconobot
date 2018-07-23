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
    var text = body.split("class=\"list-unstyled\"")[1].split("class=\"or-container tiplink-blocks\"")[0].replace(/\s/g,'').split("target");
    var part1 = text[0];
    var part2 = text[2];
    var regex1 = RegExp('[^0-9,]*([0-9,]+)€','g');
    var regex2 = RegExp('[^0-9,]*([0-9,]+)€','g');
    var found =  Number(regex1.exec(part1)[1].replace(/,/g, '.'));
    var goal =  Number(regex2.exec(part2)[1].replace(/,/g, '.'));
    if (found != utip.found) {
      utip.found = found;
    }
    if (goal != utip.goal) {
      utip.goal = goal;
    }
    var percent = Math.round(100 * utip.found / utip.goal);
    if(percent != utip.percent) {
      utip.percent = percent

      if(utip.channel) {
        var found = utip.found.toLocaleString('fr-FR', {style:'decimal', minimumFractionDigits: '2'});
        var goal = utip.goal.toLocaleString('fr-FR', {style:'decimal', minimumFractionDigits: '2'});
        Utils.sendEmbedInChannel(guild.channels.get(utip.channel), 0x00AFFF, "Utip Stupid Economics",`Le uTip est à **${percent}%** de son objectif ( ${found}€/${goal}€ ).
    Récompensez nous avec uTip: ${utip.url}`, null, []);
      }
    }
  });
}
module.exports = utipRequest;
