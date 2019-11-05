const googleService = require('../services/googledoc');

const gdoc = require('../models/gdoc');

var gdocRequest = (guild) => {
  googleService.getCell(gdoc.cell).then((cell) => {
    gdoc.deficit = Number(cell.replace(/(€|,)/g,''));
  }).catch((e) => { });
}
module.exports = gdocRequest;