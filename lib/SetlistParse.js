const { parse, format } = require("date-fns");
const { musicDic } = require("./def/MusicDic");
const {Setlist} = require("./data/Setlist");

// セトリポストをパース
function parseSetListText(artist_id, post_id, fullText) {
  let res = [];
  let setlists = [[]];

  if (fullText == null || fullText === "") return res;
  const fullTextLines = fullText.split("\n");

  let curDay = null;
  let curDaySeq = 1;
  let isFirstDaySeqMark = true;

  const dayPattern = /(\d{6}).*(セトリ)/;
  const daySeqMarkPattern = /1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩|➀|➁|➂|➃|➄|➅|➆|➇|➈|➉|❶|❷|❸|❹|❺|❻|❼|❽|❾|❿|➊|➋|➌|➍|➎|➏|➐|➑|➒|➓|1⃣|2⃣|3⃣|4⃣|5⃣|6⃣|7⃣|8⃣|9⃣/;
  const ignorePattern = /[SsＳｓ][EeＥｅ]/;

  for (let fullTextLine of fullTextLines) {
    // 日付情報
    const dayPatternMatch = fullTextLine.match(dayPattern);
    if (dayPatternMatch !== null) {
      try {
        curDay = parse(dayPatternMatch[1], "yyMMdd", new Date());
        console.log(format(curDay, "yyyy-MM-dd",{ timeZone: 'Asia/Tokyo' }));
      } catch (e) {
        console.log(`日付パースエラー：${dayPatternMatch[1]}`);
      }
      continue;
    }

    // 回し記号
    if (daySeqMarkPattern.test(fullTextLine)) {
      console.log(`回し記号一致：${fullTextLine}`);
      if (isFirstDaySeqMark) {
        isFirstDaySeqMark = false;
      } else {
        if (setlists[setlists.length-1].length === 0) continue;
        setlists.push([]);
        curDaySeq++;
      }
      continue;
    }

    // 無視する文字列
    if (fullTextLine === "") continue;
    if (/[SsＳｓ][EeＥｅ]/.test(fullTextLine)) continue;
    if (/#.*/.test(fullTextLine)) continue;
    if (/アストリーのうさぎ/.test(fullTextLine)) continue;

    // 楽曲名
    let musicFound = false;
    for (let md of musicDic) {
      // この楽曲のパターンに適合
      if (md.pattern.test(fullTextLine)) {
        console.log(`楽曲一致：${fullTextLine} -> ${md.id}`);
        setlists[setlists.length-1].push(md.id);
        musicFound = true;
        break;
      }
    }
    if (musicFound) continue;

    // 適合するパターンが見つからない → 不明曲：null
    console.log(`楽曲不一致：${fullTextLine}`);
    setlists[setlists.length-1].push(null);
  }

  if (curDay === null) return res;

  let curDaySeqRec = 1;
  res = setlists.map(setlist => {
    return new Setlist(
      artist_id,
      curDay,
      curDaySeqRec++,
      post_id,
      setlist
    );
  });
  return res;
}

module.exports = { parseSetListText }