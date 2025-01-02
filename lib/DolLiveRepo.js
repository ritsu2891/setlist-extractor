const { Client } = require('pg');
const dbConfig = require('../dbConfig');
const {XPost} = require("./data/XPost");
const {format} = require("date-fns");

/***********************************************
 ポスト
 ***********************************************/

// セトリ情報抽出未実施のポストを取得
async function getNotProcessedPosts() {
  const posts = [];
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const query = `
      SELECT
          id, full_text, procces_flg_setlist
      FROM "TbtXPost"
      WHERE
          user_id = '1514414795080216576' AND
          procces_flg_setlist = false;
    `;

    const queryResult = await client.query({
      text: query
    });
    queryResult.rows.forEach(row => {
      posts.push(new XPost(
        row['id'],
        row['full_text'],
        row['procces_flg_setlist']
      ))
    });

    return posts;
  } catch (error) {
    console.log('ポスト取得エラー: ', error);
    throw error;
  } finally {
    await client.end();
  }
}

// セトリ情報抽出済みに更新
async function updateProcessedPosts(client, postIds) {
  if (postIds == null) return;
  if (postIds.length < 1) return;
  try {
    const query = `
      UPDATE "TbtXPost"
      SET
          procces_flg_setlist = true
      FROM
          (VALUES${ postIds.map(postId => `('${postId}')`).join(',') }) K(id)
      WHERE K.id = "TbtXPost".id;
    `;
    console.log('ポストセトリ情報抽出フラグ更新OK');
    await client.query({
      text: query
    });
  } catch (error) {
    console.error('ポストセトリ情報抽出フラグ更新エラー: ', error);
  }
}

/***********************************************
 セトリ
 ***********************************************/

// セトリ情報を挿入（日付でDELETE-INSERT）
async function insertSetlists(client, setlists){
  if (setlists == null) return;
  if (setlists.length < 1) return;

  // 日付のみ抽出
  let days = new Map();
  for (let setlist of setlists) {
    if (setlist.date == null) continue;
    const d = format(setlist.date, "yyyy-MM-dd",{ timeZone: 'Asia/Tokyo' });
    days.set(d, true);
  }

  try {
    // DELETE
    const query_delete = `
      DELETE FROM "TbtSetlist"
      USING
          (VALUES${ Array.from(days.keys()).map(d => `('${d}')`).join(',') }) K(date)
      WHERE K.date::date = "TbtSetlist".date;`;
    await client.query(query_delete);
    console.log('セトリ削除OK');

    // INSERT
    const query_insert = `
      INSERT INTO "TbtSetlist" (
        artist_id, date, day_seq, src_post_id,
        cell_1, cell_2, cell_3, cell_4, cell_5, cell_6, cell_7, cell_8, cell_9, cell_10,
        cell_11, cell_12, cell_13, cell_14, cell_15, cell_16, cell_17, cell_18, cell_19, cell_20
      ) VALUES
        ${ setlists.map(setlist => setlist.toValuesRow()).join(', ') };`;
    console.log(query_insert);
    await client.query(query_insert);
    console.log('セトリ挿入OK');
  } catch (error) {
    console.error('セトリ情報挿入エラー: ', error);
    throw error;
  }
}

module.exports = {
  getNotProcessedPosts, updateProcessedPosts,
  insertSetlists
}