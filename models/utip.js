var fs = require('fs');
var Utils = require('../utils');
var utip = {
  found: 0,
  goal: 0,
  url: "https://www.utip.io/stupideconomics",
  percent: 0,
  channel: null,
  cooldown: null,
  lastUsed: null,
  lastPercentAnnounce: null,
  foundOfLastMonth: null,
}

function save() {
    fs.writeFile(__dirname + "/../data/utip.json", JSON.stringify(utip), function (err) {
        if (err) {
            return Utils.log(err, true);
        }
        //Utils.log(`The ${Utils.Color.FgYellow}utip${Utils.Color.Reset} file was saved!`);
    });
}

function load() {
    return new Promise((resolve, reject) => {

        fs.readFile(__dirname + '/../data/utip.json', (err, data) => {
            if (err) return;
            utip = JSON.parse(data);
            resolve(utip);
        });
    })
}
module.exports = {
  init: function () {
      return new Promise((resolve, reject) => {
          load()
              .then(r => resolve(r))
              .catch(e => reject(e));
      });
  },
  get found() {
      return utip.found;
  },
  get goal() {
      return utip.goal;
  },
  get url() {
      return utip.url;
  },
  get percent() {
      return utip.percent;
  },
  get channel() {
      return utip.channel;
  },
  get cooldown() {
      return utip.cooldown;
  },
  get lastUsed() {
      return utip.lastUsed;
  },
  get lastPercentAnnounce() {
    return utip.lastPercentAnnounce;
  },
  get foundOfLastMonth() {
    return utip.foundOfLastMonth;
  },
  set found(found) {
    utip.found = found;
    save();
    return utip.found;
  },
  set goal(goal) {
    utip.goal = goal;
    save();
    return utip.goal;
  },
  set url(url) {
    utip.url = url;
    save();
    return utip.url;
  },
  set percent(percent) {
    utip.percent = percent;
    save();
    return utip.percent;
  },
  set channel(channel) {
    utip.channel = channel;
    save();
    return utip.channel;
  },
  set cooldown(cooldown) {
    utip.cooldown = cooldown;
    save();
    return utip.cooldown;
  },
  set lastUsed(lastUsed) {
    utip.lastUsed = lastUsed;
    save();
    return utip.lastUsed;
  },
  set lastPercentAnnounce(lastPercentAnnounce) {
    utip.lastPercentAnnounce = lastPercentAnnounce;
    save();
    return utip.lastPercentAnnounce;
  },
  set foundOfLastMonth(foundOfLastMonth) {
    utip.foundOfLastMonth = foundOfLastMonth;
    save();
    return utip.foundOfLastMonth;
  }
};