const {format} = require("date-fns");
const {nos} = require("../util");

class Setlist {
  constructor(artist_id, date, day_seq, src_post_id, musics) {
    this.artist_id = artist_id;
    this.date = date;
    this.day_seq = day_seq;
    this.src_post_id = src_post_id;
    this.resetMusic();
    this.setMusic(musics);
  }

  resetMusic() {
    this.cell_01 = null;
    this.cell_02 = null;
    this.cell_03 = null;
    this.cell_04 = null;
    this.cell_05 = null;
    this.cell_06 = null;
    this.cell_07 = null;
    this.cell_08 = null;
    this.cell_09 = null;
    this.cell_10 = null;
    this.cell_11 = null;
    this.cell_12 = null;
    this.cell_13 = null;
    this.cell_14 = null;
    this.cell_15 = null;
    this.cell_16 = null;
    this.cell_17 = null;
    this.cell_18 = null;
    this.cell_19 = null;
    this.cell_20 = null;
  }

  setMusic(musics) {
    this.resetMusic();
    if (musics == null) return;
    if (musics.length < 1) return;
    let idx = 1;
    for (let music of musics) {
      switch (idx) {
        case 1:
          this.cell_01 = music;
          break;
        case 2:
          this.cell_02 = music;
          break;
        case 3:
          this.cell_03 = music;
          break;
        case 4:
          this.cell_04 = music;
          break;
        case 5:
          this.cell_05 = music;
          break;
        case 6:
          this.cell_06 = music;
          break;
        case 7:
          this.cell_07 = music;
          break;
        case 8:
          this.cell_08 = music;
          break;
        case 9:
          this.cell_09 = music;
          break;
        case 10:
          this.cell_10 = music;
          break;
        case 11:
          this.cell_11 = music;
          break;
        case 12:
          this.cell_12 = music;
          break;
        case 13:
          this.cell_13 = music;
          break;
        case 14:
          this.cell_14 = music;
          break;
        case 15:
          this.cell_15 = music;
          break;
        case 16:
          this.cell_16 = music;
          break;
        case 17:
          this.cell_17 = music;
          break;
        case 18:
          this.cell_18 = music;
          break;
        case 19:
          this.cell_19 = music;
          break;
        case 20:
          this.cell_20 = music;
          break;
      }

      if (idx < 20) {
        idx++;
      } else {
        break;
      }
    }
  }

  toValuesRow() {
    const dayStr = (this.date == null) ? null : format(this.date, "yyyy-MM-dd",{ timeZone: 'Asia/Tokyo' });
    const cols = [
      "'AsuUsa'", nos(dayStr), this.day_seq, this.src_post_id,
      nos(this.cell_01), nos(this.cell_02), nos(this.cell_03), nos(this.cell_04), nos(this.cell_05),
      nos(this.cell_06), nos(this.cell_07), nos(this.cell_08), nos(this.cell_09), nos(this.cell_10),
      nos(this.cell_11), nos(this.cell_12), nos(this.cell_13), nos(this.cell_14), nos(this.cell_15),
      nos(this.cell_16), nos(this.cell_17), nos(this.cell_18), nos(this.cell_19), nos(this.cell_20)
    ]
    return `(${cols.join(', ')})`;
  }

  toString() {
    const musics = [
      this.cell_01, this.cell_02, this.cell_03, this.cell_04, this.cell_05, this.cell_06, this.cell_07, this.cell_08, this.cell_09, this.cell_10,
      this.cell_11, this.cell_12, this.cell_13, this.cell_14, this.cell_15, this.cell_16, this.cell_17, this.cell_18, this.cell_19, this.cell_20
    ]
    return `${this.artist_id}, ${format(this.date, "yyyy-MM-dd",{ timeZone: 'Asia/Tokyo' })}, #${this.day_seq}, src:${this.src_post_id}\n${musics.filter(m => m !== null)}`
  }
}

module.exports = {Setlist}