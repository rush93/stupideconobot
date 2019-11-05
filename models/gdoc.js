var fs = require('fs');
var Utils = require('../utils');
var gdoc = {
  sheetId: '',
  cell: '',
  deficit: 0,
}

function save() {
    fs.writeFile(__dirname + "/../data/gdoc.json", JSON.stringify(gdoc), function (err) {
        if (err) {
            return Utils.log(err, true);
        }
    });
}

function load() {
    return new Promise((resolve, reject) => {

        fs.readFile(__dirname + '/../data/gdoc.json', (err, data) => {
            if (err) return;
            gdoc = JSON.parse(data);
            resolve(gdoc);
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
  get sheetId() {
    return gdoc.sheetId
  },
  get cell() {
    return gdoc.cell
  },
  get deficit() {
    return gdoc.deficit
  },
  set sheetId(sheetId) {
    gdoc.sheetId = sheetId;
    save();
    return gdoc.sheetId;
  },
  set cell(cell) {
    gdoc.cell = cell;
    save();
    return gdoc.cell;
  },
  set deficit(deficit) {
    gdoc.deficit = deficit;
    save();
    return gdoc.deficit;
  }
};