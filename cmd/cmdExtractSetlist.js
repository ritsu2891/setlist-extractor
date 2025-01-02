const { getNotProcessedPosts, updateProcessedPosts, insertSetlists } = require("../lib/DolLiveRepo");
const { parseSetListText } = require('../lib/SetlistParse');
const { getLogDtNowStr } = require("../lib/util");
const { Pool, Client } = require("pg");
const dbConfig = require("../dbConfig");

async function cmdExtractSetlist() {
  console.log(`${getLogDtNowStr()} | セトリ情報抽出タスク開始...`);

  // セトリ情報未抽出のポストを取得
  let posts = [];
  try {
    console.log(`${getLogDtNowStr()} | ポスト取得...`);
    posts = await getNotProcessedPosts();
    console.log(`${getLogDtNowStr()} | ポスト取得終了`);

    if (posts.length < 1) {
      console.log(`${getLogDtNowStr()} | ポストなし -> 終了`);
      return;
    }
  } catch (error) {
    console.error(`${getLogDtNowStr()} | ポスト取得エラー`, error);
    return;
  }

  // ポストをパースしてセトリ情報を生成
  let setlistsMap = {};
  let setlistParsedPostIds = [];
  console.log(`${getLogDtNowStr()} | パース...`);
  for (let post of posts) {
    try {
      console.log(`> ポスト [${post.id}]`);
      const setlists = await parseSetListText('AsuUsa', post.id, post.full_text);
      console.log(`パースしたセトリ件数：${setlists.length}`);
      if (0 < setlists.length) {
        setlistParsedPostIds.push(post.id);
        setlistsMap[post.id] = setlists;
      }
    } catch (error) {
      console.error(`${getLogDtNowStr()} | パースエラー`, error);
      return;
    }
  }
  console.log(`${getLogDtNowStr()} | パース終了`);

  // セトリ挿入・ポストセトリ情報抽出フラグ更新
  console.log(`${getLogDtNowStr()} | DB挿入・フラグ更新...`);
  const pool = new Pool(dbConfig);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const postId of setlistParsedPostIds) {
      try {
        await client.query('BEGIN');
        console.log(`${postId}：DB挿入...`);
        await insertSetlists(client, setlistsMap[postId]);
        console.log(`${postId}：DB挿入OK`);
        await client.query('COMMIT');
      } catch (e) {
        console.error(`${postId}：DB挿入エラー`, e);
        await client.query('ROLLBACK');
        await client.query('BEGIN');
      }
    }

    // ポストセトリ情報抽出フラグ更新
    await updateProcessedPosts(client, posts.map(p => p.id));

    await client.query('COMMIT');
    console.log('コミットOK');
    console.log(`${getLogDtNowStr()} | DB挿入・フラグ更新終了`);
  } catch (error) {
    console.error(`${getLogDtNowStr()} | DB挿入・フラグ更新エラー`, error);
    await client.query('ROLLBACK');
  } finally {
    await client.release();
    await pool.end();
  }

  console.log(`${getLogDtNowStr()} | セトリ情報抽出タスク終了`);
}

module.exports = { cmdExtractSetlist }