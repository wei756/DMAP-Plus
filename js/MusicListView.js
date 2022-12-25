/**
 * @typedef MusicListViewOption
 * @property {boolean} isPlaylist
 */

class MusicListView {
  /**
   * @param {HTMLElement} element 
   * @param {MusicListViewOption} options
   */
  constructor(element, options = {}) {
    if (!element || !element instanceof HTMLElement) {
      throw new Error('올바르지 않은 요소입니다.');
    }

    /** @type {HTMLElement} */
    this._el = element;

    /** @type {MusicItem[]} */
    this._list = [];

    /** @type {MusicListViewOption} */
    this.options = {
      isPlaylist: false,
      ...options,
    };

    this.eventHandlers = {
      playMusic: [],
      removeItem: [],
      select: [],
      insertQueue: [],
    };
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.performEvent = this.performEvent.bind(this);

    this.updateRender = this.updateRender.bind(this);
    this.appendItemToList = this.appendItemToList.bind(this);
    this.generateMusicItemElement = this.generateMusicItemElement.bind(this);

    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
    this.clearSelectedItems = this.clearSelectedItems.bind(this);

    this.clearSearchKeyword = this.clearSearchKeyword.bind(this);
    this.filterSearch = this.filterSearch.bind(this);

    this._selectMode = false;
    /** @type {number[]} */
    this.selectedItems = [];
    /** @type {number[]} */
    this.filteredItems = [];

    /** @type {MusicItem} */
    this._playCursor = null;

    this._el.addEventListener('scroll', this.updateRender);
    window.addEventListener('resize', this.updateRender);

    this._el.innerHTML = `
      <ul class="list"></ul>
      <div class="scrollDummy"></div>
      <div class="overlayArea">
        <div class="searchBar">
          <input name="searchKeyword" type="text" value="" placeholder="검색어를 입력하세요" title="검색어를 입력하세요">
          <button class="btnClear">×</button>
        </div>
      </div>
    `;

    this._el.$query('input[name="searchKeyword"]').addEventListener('keyup', this.filterSearch);
    this._el.$query('button.btnClear').addEventListener('click', this.clearSearchKeyword);

    this.updateRender();
  }

  on(name, handler) {
    this.eventHandlers[name] && this.eventHandlers[name].push(handler);
  }
  off(name, handler) {
    this.eventHandlers[name] && (this.eventHandlers[name] = this.eventHandlers[name].filter(h => h !== handler));
  }
  performEvent(name, e) {
    this.eventHandlers[name] && this.eventHandlers[name].forEach(handler => handler(e));
  }

  updateRender() {
    const { clientHeight, scrollHeight, scrollTop } = this._el;
    const scrollDummy = this._el.$query('.scrollDummy');

    const itemHeight = 47;

    const startOffset = parseInt(scrollTop / itemHeight);
    const listLength = (this.filteredItems.length ? this.filteredItems : this._list).length;
    const viewLength = Math.ceil(clientHeight / itemHeight) + 1;

    scrollDummy.setAttribute('style', `--itemLength: ${listLength - viewLength};`);
    this._el.setAttribute('style', `--listOffset: ${startOffset};`);

    this._el.$query('ul.list').innerHTML = '';
    (this.filteredItems.length ? this.filteredItems : this._list).slice(startOffset, startOffset + viewLength).forEach(this.appendItemToList);
  }

  appendItemToList(musicItem, i) {
    this._el.$query('ul.list').appendChild(this.generateMusicItemElement(musicItem, i));
  }

  generateMusicItemElement(musicItem, i) {
    const { title, singer, isNew, musicId } = musicItem;
    const hasLyric = !!(lyrics[musicId] && lyrics[musicId].data && lyrics[musicId].data.length);

    // html 생성
    const elItem = document.createElement('li');
    if (this._playCursor === musicItem) {
      elItem.addClass('play');
    }
    elItem.dataset.musicId = musicId;
    elItem.dataset.selected = this.selectedItems.includes(musicId) ? 1 : 0;
    const newIcon = isNew ? `<div class="newIcon"></div>` : '';
    const lyricIcon = hasLyric ? `<div class="itemTag lyric"><img src="./img/lyric.png" class="iconBtn"></div>` : '';

    const btnRemoveFromPlaylist = `<li class="menuLine">
    </li>
    <li class="menuItem removePlaylist">
      <div class="iconArea"><img src="./img/delete_red.png"></div>
      <div class="label">플레이리스트에서 제거</div>
    </li>`;
    elItem.innerHTML = `
      <div class="checkbox"><div class="checkboxLine"></div></div>
      <div class="infoArea">
        <span class="title">${title}${lyricIcon}${newIcon}</span>
        <span class="singer">${singer}</span>
      </div>
      <button class="button moreButton btnMore ${i < 3 ? 'bottomMore' : ''}">
        <img src="./img/moreVert.png">
        <div class="moreMenuWrapper">
          <ul class="menuList">
            <li class="menuItem insertQueue">
              <div class="iconArea"><img src="./img/insertQueue.png"></div>
              <div class="label">재생중인 곡 다음에 재생</div>
            </li>
            <li class="menuItem moreButton moremore addToPlaylist">
              <div class="iconArea"><img src="./img/playlist.png"></div>
              <div class="label">플레이리스트에 추가...</div>
              <div class="moreMenuWrapper">
                <ul class="menuList">
                  
                </ul>
              </div>
            </li>
            ${this.options.isPlaylist ? btnRemoveFromPlaylist : ''}
          </ul>
        </div>
      </button>`;

    elItem.addEventListener('click', e => {
      const target = e.currentTarget;
      const { selected } = target.dataset;

      if (e.target.classList.value.includes('checkbox')) { // 체크박스
        target.dataset.selected = 1 - parseInt(selected);
        if (1 - parseInt(selected)) {
          this.select(musicId);
        } else {
          this.deselect(musicId);
        }

      } else if (containsPath('btnMore', e.composedPath())) { // more 영역
        if (e.target.classList.value.includes('insertQueue')) { // 재생중인 곡 다음에 재생
          this.performEvent('insertQueue', { target: musicItem });
        }
        if (e.target.classList.value.includes('removePlaylist')) { // 리스트에서 제거
          this.performEvent('removeItem', { target: musicItem });
        }

      } else { // 노래 클릭
        this.onClickItem(musicItem);
      }
    });

    elItem.$query('.addToPlaylist .menuList').innerHTML = playlistManager.getAll(false).map(item => {
      return `<li class="menuItem" data-uuid="${item.uuid}">
        <div class="iconArea"><img src="./img/playlist.png"></div>
        <div class="label">${item.name}</div>
      </li>`
    }).join('');
    elItem.$queryAll('.addToPlaylist .menuList .menuItem').forEach(el => el.addEventListener('click', e=> {
      const target = playlistManager.get(e.currentTarget.dataset.uuid);

      target.push(musicId);
      toastManager.create({ text: `선택한 노래를  '${target.name}'에 추가했습니다.` });
      playlistPanel.setMusicItemsByPlaylist(playlistPanel.openedList);
    }));

    return elItem;
  }

  set selectMode(value) {
    this._selectMode = value;
    if (this._selectMode) {
      this.selectedItems = [];
      this._el.addClass('selectMode');
    } else {
      this._el.removeClass('selectMode');
    }
  }
  get selectMode() {
    return this._selectMode;
  }
  /**
   * musicId에 해당하는 노래를 선택합니다.
   * 
   * @param {number} musicId 
   */
  select(musicId) {
    if (!this.selectedItems.includes(musicId)) {
      this.selectedItems.push(musicId);
      this.performEvent('select', { target: this, musicId, selectedItems: this.selectedItems });
    }
  }
  /**
   * musicId에 해당하는 노래를 선택 해제합니다.
   * 
   * @param {number} musicId 
   */
  deselect(musicId) {
    if (this.selectedItems.includes(musicId)) {
      this.selectedItems = this.selectedItems.filter(id => id !== musicId);
      this.performEvent('select', { target: this, musicId, selectedItems: this.selectedItems });
    }
  }
  /**
   * 선택된 모든 노래를 선택 해제합니다.
   * 
   * @param {number} musicId 
   */
  clearSelectedItems() {
    this.selectedItems = [];
    this.performEvent('select', { target: this, musicId: null, selectedItems: this.selectedItems });
  }
  /**
   * 노래 클릭 핸들러
   * 
   * @param {MusicItem} musicItem 
   */
  onClickItem(musicItem) {
    this.performEvent('playMusic', musicItem);
  }

  get playCursor() {
    return ({
      target: this._playCursor,
      index: this._list.findIndex(item => item === this._playCursor),
    });
  }
  set playCursor(val) {
    if (typeof val === 'number') {
      this._playCursor = this._list[val];
    } else if (this._list.includes(val)) {
      this._playCursor = val;
    } else { return undefined; }

    this.updateRender();
  }

  /**
   * 검색어를 초기화합니다.
   */
  clearSearchKeyword() {
    if (this.searchKeyword) {
      this.searchKeyword = '';
      this.filterSearch();
    }
  }
  get searchKeyword() {
    return this._el.$query('input[name="searchKeyword"]').value;
  }
  set searchKeyword(value) {
    this._el.$query('input[name="searchKeyword"]').value = value;
    this.filterSearch();
  }

  /**
   * 검색어로 노래 목록을 필터링합니다.
   */
  filterSearch() {
    const filteredSearchStr = filterSearchText(this.searchKeyword);

    this.filteredItems = this._list.filter(item => {
      const isSearchedTitle = filterSearchText(item.title).includes(filteredSearchStr) || filterSearchText(item.titleChosung).includes(filteredSearchStr) ;
      const isSearchedSinger = filterSearchText(item.singer).includes(filteredSearchStr) || filterSearchText(item.singerChosung).includes(filteredSearchStr);
      return (isSearchedTitle || isSearchedSinger);
    });
    this.updateRender();
  }

  /**
   * 노래 목록을 초기화합니다.
   */
  clear() {
    while(this._list.length > 0) { this._list.pop(); }
    this.updateRender();
  }

  /**
   * 노래 목록을 items로 설정합니다.
   * 
   * @param {MusicItem[]} items
   * @returns {MusicItem[]}
   */
  set(...items) {
    this._list = [...items];
    this.updateRender();
    return this._list;
  }

  /**
   * 노래목록 중 item에 해당하는 MusicItem이 있으면 반환합니다.
   * 
   * @param {MusicItem|number} item
   * @returns {MusicItem|undefined}
   */
  find(item) {
    return this._list.find(it => it === item || it.musicId === item);
  }

  /**
   * index번째에 해당하는 노래를 목록에서 제거합니다.
   * 
   * @param {number[]} index
   * @returns {MusicItem[]}
   */
  removeByIndex(...index) {
    this._list = this._list.filter((_, i) => index.includes(i));
    this.updateRender();
    return this._list;
  }
  /**
   * musicId에 해당하는 노래를 목록에서 제거합니다.
   * 
   * @param {number[]} musicId
   * @returns {MusicItem[]}
   */
  removeByMusicId(...musicId) {
    this._list = this._list.filter(item => musicId.includes(item.musicId));
    this.updateRender();
    return this._list;
  }

  /**
   * items를 노래 목록에 추가합니다.
   * 
   * @param {MusicItem[]} items
   * @returns {MusicItem[]}
   */
  append(...items) {
    this._list = [...this._list, ...items];
    this.updateRender();
    return this._list;
  }
  /**
   * items를 노래 목록 앞부분에 추가합니다.
   * 
   * @param {MusicItem[]} items
   * @returns {MusicItem[]}
   */
  prepend(...items) {
    this._list = [...items, ...this._list];
    this.updateRender();
    return this._list;
  }

  set order(value) {
    this._order = value;
    const [listOrder, flowIndex] = value.split('_');
    const list = this.filteredItems.length ? this.filteredItems : this._list;

    // 정렬 적용
    if (listOrder == 'title') {
      list.sort((a, b) => compareText(a.title, b.title));
    } else if (listOrder == 'singer') {
      list.sort((a, b) => compareText(a.singer, b.singer));
    } else {
      list.sort((a, b) => b.musicId - a.musicId);
    }

    // 오름차순/내림차순 적용
    if (flowIndex == 'asc') {
      list.reverse();
    }
    
    this.updateRender();
  }

  /**
   * index번째에 해당하는 노래를 반환합니다.
   * 
   * @param {number} index
   * @returns {MusicItem}
   */
  get(index) {
    return this._list[index];
  }
  getAll() {
    return [...this._list];
  }

  get length() {
    return this._list.length;
  }

  hide() {
    this._el.addClass('hide');
  }
  show() {
    this._el.removeClass('hide');
  }
}

