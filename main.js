const dotenv = require('dotenv');
const { cmdExtractSetlist } = require('./cmd/cmdExtractSetlist');

dotenv.config();

(async function() {
  await cmdExtractSetlist();
})();