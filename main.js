const dotenv = require('dotenv');
const { getNotProcessedPosts, updateProcessedPosts, insertSetlists } = require("./lib/DolLiveRepo");
const { parseSetListText } = require('./lib/SetlistParse');

dotenv.config();