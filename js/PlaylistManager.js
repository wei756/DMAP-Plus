class PlaylistManager {
  constructor(context) {
    /** @type {Playlist[]} */
    this._list = [];
    /** @type {DatabaseManager} */
    this.databaseManager = context.databaseManager;

    this.loadFromFile = this.loadFromFile.bind(this);
    this.saveToFile = this.saveToFile.bind(this);
    
    this.loadFromLocalStorage = this.loadFromLocalStorage.bind(this);
    this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
    
    this.openPlaylistDialog = this.openPlaylistDialog.bind(this);
    
    this.loadPlaylistFromJSON = this.loadPlaylistFromJSON.bind(this);
    this.loadPlaylistFromText = this.loadPlaylistFromText.bind(this);
    this.convertTextToPlaylist = this.convertTextToPlaylist.bind(this);
    
    this.generateBasicList = this.generateBasicList.bind(this);
    this.push = this.push.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);

    const loadedFromLocalStorage = this.loadFromLocalStorage();
    if (!loadedFromLocalStorage) {
      this.clear();
    }
  }

  /**
   * 자동 생성 플레이리스트를 생성합니다.
   */
  generateBasicList() {
    const allMusicList = new Playlist({
      parent: this, 
      uuid: 'all',
      name: '모든 곡(자동 생성됨)',
      list: this.databaseManager.getAll().map(item => item.musicId),
    });
    const lyricMusicList = new Playlist({
      parent: this, 
      uuid: 'lyrics',
      name: '가사가 있는 곡(자동 생성됨)',
      list: this.databaseManager.getAll().map(item => item.musicId).filter(musicId => lyrics[musicId]),
    });
    this.push(allMusicList, lyricMusicList);
  }

  /**
   * 플레이리스트를 등록합니다.
   * @param  {...Playlist} playlists 
   * @returns {number} 등록된 갯수
   */
  push(...playlists) {
    const pushed = this._list.push(...playlists);
    this.saveToLocalStorage();
    return pushed;
  }

  /**
   * uuid에 해당하는 플레이리스트를 반환합니다.
   * 
   * @param {string} uuid 
   * @returns {Playlist|undefined}
   */
  get(uuid) {
    return this._list.find(item => item.uuid === uuid);
  }
  getAll(includeDefaultLsit = true) {
    return includeDefaultLsit ? this._list : this._list.filter(item => !['all', 'lyrics'].includes(item.uuid));
  }

  /**
   * uuid에 해당하는 플레이리스트를 제거합니다.
   * 
   * @param {string} uuid 
   * @returns {Playlist[]}
   */
  remove(uuid) {
    this._list = this._list.filter(item => item.uuid !== uuid);
    this.saveToLocalStorage();
    return this._list;
  }

  /**
   * 등록된 모든 플레이리스트를 제거합니다.
   * 
   * @returns {Playlist[]}
   */
  clear() {
    this._list = [];
    this.generateBasicList();
    this.saveToLocalStorage();
    return this._list;
  }

  /**
   * 등록되어 있는 플레이리스트의 갯수를 반환합니다.
   * 
   * @returns {number}
   */
  get length() {
    return this._list.length;
  }

  /**
   * 파일로부터 플레이리스트를 불러옵니다.
   * 
   * @param {Blob} file 
   * @returns {Promise}
   */
  loadFromFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
      
        reader.onload = () => {
          const PLText = reader.result;
      
          if (PLText.includes('{')) {
            this.loadPlaylistFromJSON(JSON.parse(PLText));
          } else {
            this.loadPlaylistFromText(PLText, prompt('플레이리스트의 이름을 입력해주세요', '새 플레이리스트') || '새 플레이리스트');
          }
          resolve();
        };
        reader.readAsText(file, "UTF-8");
      } catch(err) {
        reject(err);
      }
    })
  }

  /**
   * 플레이리스트를 파일로 저장합니다.
   * 
   * @param {string} uuid 
   */
  saveToFile(uuid) {
    const target = this.get(uuid);
    if (!target) {
      return;
    }
    const json = {
      name: target.name,
      uuid: target.uuid,
      list: target.list,
      timestamp: Date.now(),
    };
    toastManager.create({ text: `'${target.name}' 리스트를 파일로 저장했습니다.` });
    saveFile(JSON.stringify(json), `${target.name.replace(/[^a-zA-Z0-9ㄱ-ㅣ가-힣 _-]/g, '')}.json`, 'application/json');
  }

  /**
   * localStorage에 저장된 플레이리스트를 불러옵니다.
   * 
   * @returns {boolean} localStorage에 플레이리스트가 저장되어 있고 불러오는 데 성공했는지 여부
   */
  loadFromLocalStorage() {
    if (!localStorage['dmap2.playlist']) { // no data
      return false;
    }
    
    const list = JSON.parse(localStorage['dmap2.playlist']);
    if (list && list instanceof Array && list.length > 0) {
      this.clear();
      list.forEach(item => this.push(new Playlist({ parent: this, ...item })));
      return true;
    }
    return false;
  }
  /**
   * 플레이리스트를 localStorage에 저장합니다.
   */
  saveToLocalStorage() {
    localStorage['dmap2.playlist'] = JSON.stringify(
      this.getAll(false)
      .map(item => ({
        uuid: item.uuid,
        name: item.name,
        list: item.list,
      }))
    );
  }
  /**
   * 플레이리스트를 열기 위한 다이얼로그를 엽니다.
   */
  async openPlaylistDialog() {
    const file = await openFile('file', '.html');
    await this.loadFromFile(file);
  }
  /**
   * JSON로부터 플레이리스트를 파싱하고 등록합니다.
   * 
   * @param {{name: string, uuid: string, list: number[], timestamp: number}} json
   */
  loadPlaylistFromJSON(json) {

    const target = this.get(json.uuid);

    if (target) { // 중복 uuid
      if (confirm(`이미 같은 플레이리스트가 존재합니다.\n'${target.name}' 리스트를 덮어씌우시겠습니까?\n취소를 누르면 새로운 리스트로 추가됩니다.`)) {
        target.name = json.name;
        target.list = json.list;
      } else { // 새 uuid로 리스트 생성
        const playlist = new Playlist({
          parent: this,
          name: json.name,
          list: json.list,
        });
        this.push(playlist);
      }
    } else {
      const playlist = new Playlist({
        parent: this,
        name: json.name,
        uuid: json.uuid,
        list: json.list,
      });
      this.push(playlist);
    }

    // 리스트 업데이트
  }
  /**
   * 텍스트로부터 플레이리스트를 파싱하고 등록합니다.
   * 
   * @param {string} text
   * @param {string} name
   */
  loadPlaylistFromText(text, name = '새 플레이리스트') {
    const list = this.convertTextToPlaylist(text);

    const playlist = new Playlist({
      parent: this,
      name: name,
      list: list,
    });
    this.push(playlist);
    // 리스트 업데이트
  }
  /**
   * 텍스트를 플레이리스트로 변환합니다.
   */
  convertTextToPlaylist(text) {
    const result = [];
    const filteredText = text.replace(/\W/gi, '');
    const textLength = filteredText.length;
    for (let i = 0; i < textLength; i += 4) {
      const musicId = parseInt(filteredText.substr(i, 4));
      result.push(musicId);
    }
  
    return result;
  }
}

class Playlist {
  /**
   * @param {{ parent: PlaylistManager, uuid: string, name: string, list: number[] }} params 
   */
  constructor({ parent = null, uuid = geneUUID(), name, list = [] }) {
    /** @type {PlaylistManager} */
    this.parent = parent;
    /** @type {string} */
    this._uuid = uuid;
    /** @type {string} */
    this._name = name;
    /** @type {number[]} */
    this._list = list;

    this.filter = this.filter.bind(this);
    this.find = this.find.bind(this);
    this.map = this.map.bind(this);
    this.forEach = this.forEach.bind(this);
    this.push = this.push.bind(this);
    this.includes = this.includes.bind(this);
    this.remove = this.remove.bind(this);
  }

  filter(predicate) {
    return this.list.filter(predicate);
  }
  find(predicate) {
    return this.list.find(predicate);
  }
  map(callbackfn) {
    return this.list.map(callbackfn);
  }
  forEach(callbackfn) {
    return this.list.forEach(callbackfn);
  }

  /**
   * 플레이리스트의 노래를 ...musicId 지정합니다.
   * 
   * @param {...number} musicId 
   * @returns {number[]}
   */
  set(...musicId) {
    this.list = [...musicId];
    return this.list;
  }
  /**
   * 플레이리스트에 노래를 추가합니다.
   * 
   * @param {...number} musicId 
   * @returns {number[]}
   */
  push(...musicId) {
    const pushed = this.list.push(...musicId);
    this.parent.saveToLocalStorage();
    return pushed;
  }
  includes(musicId) {
    return this.list.includes(musicId);
  }
  /**
   * 플레이리스트에서 노래를 제거합니다.
   * 
   * @param {...number} musicId 
   * @returns {number[]}
   */
  remove(...musicId) {
    this.list = this.filter(item => !musicId.includes(item));
    this.parent.saveToLocalStorage();
    return this.list;
  }

  get uuid() {
    return this._uuid;
  }
  set name(val) {
    this._name = val;
    this.parent.saveToLocalStorage();
  }
  get name() {
    return this._name;
  }
  set list(val) {
    this._list = val;
    this.parent.saveToLocalStorage();
  }
  get list() {
    return this._list;
  }
}