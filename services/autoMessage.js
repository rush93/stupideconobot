const youtube = require('../models/youtube');
const gdoc = require('../models/gdoc');
const Utils = require('../utils');
const googleService = require('../services/googledoc');

const allFormat = [
  {
    name: 'youtube.subscribers',
    desc: 'Le nombre d\'abonnés'
  },
  {
    name: 'gdoc.deficit',
    desc: 'Le déficit de SE'
  },
  {
    name: 'gdoc.cell:[cell]',
    desc: 'Récupère une cellule spécifique sur le doc'
  }
]

const allVariables = {
  'youtube.subscribers': () => {
    return new Promise( (r,j) => { r(Utils.spacer(Number(youtube.lastNbSubscribers))) });
  },
  'gdoc.deficit': () => {
    return new Promise( (r,j) => { r(Utils.spacer(Number(gdoc.deficit))) });
  },
  'gdoc.cell': (cell) => {
    return new Promise( (r,j) => {
      googleService.getCell(cell).then((content) => {
        r(content);
      })
    });
  }
}

const recursiveReplace = (message) => {
  return new Promise((resolve, reject) => {
    if (result = /{{([^}]+)}}/g.exec(message)) {
      let args = result[1].split(':');
      let name = args.shift();
      if (!allVariables[name]) {
        message = message.replace(new RegExp(`{{${result[1]}}}`,'g'), 'ERROR: VAR NOT EXIST');
        recursiveReplace(message).then((replaced) => { resolve(replaced) });
        return;
      }
      allVariables[name](...args).then((toReplace) => {
        message = message.replace(new RegExp(`{{${result[1]}}}`,'g'), toReplace);
        recursiveReplace(message).then((replaced) => { resolve(replaced) });;
      })
      return;
    }
    resolve(message);
  })
}

const replaceVar = (autoMessage) => {
  return recursiveReplace(autoMessage.message);
}

module.exports = {
  allFormat,
  replaceVar
}