class QueueManager {
  constructor(context) {
    /** @type {MusicItem[]} */
    this._queue = [];
    this.cursor = -1;
  }

  clear() {
    while(this._queue.length > 0) { this._queue.pop(); }
    this.cursor = -1;
  }

  set(...items) {
    this._queue = [...items];
    this.cursor = 0;
    return this._queue;
  }
  
  remove(index) {
    this._queue = this._queue.filter((_, i) => index !== i);
    return this._queue;
  }

  push(...items) {
    this._queue = [...this._queue, ...items];
    return this._queue;
  }
  pushNext(...items) {
    this._queue = [
      ...this._queue.slice(0, this.cursor + 1),
      ...items,
      ...this._queue.slice(this.cursor + 1),
    ];
    toastManager.create({ text: '지금 재생중인 노래가 끝나면 선택한 노래를 재생합니다.' });
    return this._queue;
  }

  next() {
    if (this._queue.length > 0) {
      this.cursor = (this.cursor + 1) % this._queue.length;
      console.log(this.cursor)
      return this._queue[this.cursor];
    } else {
      return null;
    }
  }
  prev() {
    if (this._queue.length > 0) {
      this.cursor = (this._queue.length + this.cursor - 1) % this._queue.length;
      return this._queue[this.cursor];
    } else {
      return null;
    }
  }
  /**
   * @param {number} index
   */
  setCursor(index) {
    this.cursor = index;
  }
  /**
   * @param {number} musicId
   */
  setCursorByMusicId(musicId) {
    this.cursor = this.findIndex(item => item.musicId === musicId);
  }
  /**
   * @param {(e: MusicItem) => boolean} predicate 
   * @returns {number} index
   */
  findIndex(predicate) {
    return this._queue.findIndex(predicate);
  }
  /**
   * @param {number} index
   * @returns {MusicItem} 
   */
  get(index = this.cursor) {
    return this._queue[index];
  }
  /**
   * @returns {MusicItem[]} 
   */
  getAll() {
    return this._queue;
  }

  /**
   * @returns {number} 
   */
  get length() {
    return this._queue.length;
  }
}
