var fs = require('fs');
var Utils = require('../utils');
var youtube = {
    interval: 1000,
    messages: [],
    lastNbSubscribers: 0,
    channel: null,
}

function save() {
    fs.writeFile(__dirname + "/../data/youtube.json", JSON.stringify(youtube), function (err) {
        if (err) {
            return Utils.log(err, true);
        }
        Utils.log(`The ${Utils.Color.FgYellow}youtube${Utils.Color.Reset} file was saved!`);
    });
}

function load() {
    return new Promise((resolve, reject) => {

        fs.readFile(__dirname + '/../data/youtube.json', (err, data) => {
            if (err) return;
            youtube = JSON.parse(data);
            resolve(youtube);
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
  get interval() {
      return youtube.interval;
  },
  get messages() {
      return youtube.messages;
  },
  get lastNbSubscribers() {
    return youtube.lastNbSubscribers;
  },
  get channel() {
    return youtube.channel;
  },
  set interval(interval) {
    youtube.interval = interval;
    save();
    return youtube.interval;
  },
  set lastNbSubscribers(lastNbSubscribers) {
    youtube.lastNbSubscribers = lastNbSubscribers;
    save();
    return youtube.lastNbSubscribers;
  },
  set channel(channel) {
    youtube.channel = channel;
    save();
    return youtube.channel;
  },
  addMessage: function(message) {
    youtube.messages.push(message);
    save();
    return youtube.messages;
  },
  delMessage: function(index) {
    youtube.messages.splice(index, 1);
    save();
    return youtube.messages;
  },
  getNextCap: function(nb) {
    
    nbOfZerro = (nb + '').length - 1;
    firstNumber =  Math.floor(nb / Math.pow(10,nbOfZerro));
    if (firstNumber >= 8) {
      return Math.pow(10,nbOfZerro + 1); 
    }

    return Math.pow(10,nbOfZerro) * nbOfZerro + Math.pow(10,nbOfZerro)
  }
};