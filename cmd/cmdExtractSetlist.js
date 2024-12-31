const { getNotProcessedPosts, updateProcessedPosts, insertSetlists } = require("../lib/DolLiveRepo");
const { parseSetListText } = require('../lib/SetlistParse');
const { getLogDTStr } = require("../lib/util");

async function cmdExtractSetlist() {
  console.log(`${getLogDTStr(new Date())} | セトリ情報抽出タスク開始...`);

  // セトリ情報未抽出のポストを取得
  try {
    console.log(`${getLogDTStr(new Date())} | ポスト取得...`);
  }

}

module.exports = { cmdExtractSetlist }