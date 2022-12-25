class DatabaseManager {
  constructor() {
    /** @type {MusicItem[]} */
    this._db = db.map(this.formatMusicItem);

    this.get = this.get.bind(this);
  }

  /**
   * @param  {...number} ids 
   * @returns {MusicItem[]}
   */
  get(...ids) {
    return this._db.filter(item => ids.includes(item.musicId));
  }

  /**
   * @returns {MusicItem[]}
   */
  getAll() {
    return this._db;
  }

  formatMusicItem(item) {
    return new MusicItem(...item);
  }

  get length() {
    return this._db.length;
  }
}

class MusicItem {
  /**
   * @param {string} title 
   * @param {string} singer 
   * @param {number} startTime 
   * @param {number} endTime 
   * @param {string} suburl 
   * @param {number} musicId 
   */
  constructor(title, singer, startTime, endTime, suburl, musicId) {
    /** @type {number} */
    this.musicId = musicId;
    /** @type {string} */
    this.title = removeNewMarker(title);
    /** @type {string} */
    this.titleChosung = convertToChosung(this.title);
    /** @type {string} */
    this.singer = singer;
    /** @type {string} */
    this.singerChosung = convertToChosung(singer);
    /** @type {number} */
    this.startTime = startTime;
    /** @type {number} */
    this.endTime = endTime;
    /** @type {string} */
    this.suburl = suburl;
    /** @type {boolean} */
    this.isNew = !!title.match(/^\[(New|NEW)\] /);
    /** @type {boolean} */
    this.hasLyric = false;
  }
}