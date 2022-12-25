class PlaylistPanel {
  /**
   * @param {HTMLElement} element 
   * @param {PlaylistManager} playlistManager 
   */
  constructor(element, playlistManager) {
    if (!element || !element instanceof HTMLElement) {
      throw new Error('올바르지 않은 요소입니다.');
    }
    if (!playlistManager) {
      throw new Error('플레이리스트 매니저가 정의되지 않았습니다.');
    }

    /** @type {HTMLElement} */
    this._el = element;

    this._isListOpened = false;
    /** @type {''|'edit'|'add'} */
    this._listEditMode = '';
    this._openedList = '';

    /** 
     * 편집중인 플레이리스트의 변경사항을 저장하는 리스트
     * 
     * @type {number[]}
     */
    this._editingList = [];

    this.eventHandlers = {
      playMusic: [],
    };
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.performEvent = this.performEvent.bind(this);

    this.updateRender = this.updateRender.bind(this);
    this.appendItemToList = this.appendItemToList.bind(this);
    this.generatePlaylistItemElement = this.generatePlaylistItemElement.bind(this);

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.applyListEditChanges = this.applyListEditChanges.bind(this);
    this.compareListEditChanges = this.compareListEditChanges.bind(this);

    this.createNewPlaylist = this.createNewPlaylist.bind(this);
    this.removePlaylist = this.removePlaylist.bind(this);
    this.playPlaylist = this.playPlaylist.bind(this);
    this.setSelectedItemCount = this.setSelectedItemCount.bind(this);
    this.addSelectedItems = this.addSelectedItems.bind(this);
    this.removeSelectedItems = this.removeSelectedItems.bind(this);
    this.setMusicItemsByPlaylist = this.setMusicItemsByPlaylist.bind(this);

    /** @type {PlaylistManager} */
    this.playlistManager = playlistManager;

    this._el.innerHTML = `
      <header>
        <div class="left">
          <button class="button btnClosePanel">
            <img src="./img/arrow_down.png">
          </button>
          <span class="caption">플레이리스트</span>
        </div>
        <div class="right">
          <button class="button ribbonButton ribbonBottomSide btnEdit">
            <img src="./img/edit.png">
            <div class="ribbon">편집</div>
          </button>
          <button class="button ribbonButton ribbonBottomSide btnAdd">
            <img src="./img/new.png">
            <div class="ribbon">곡 추가</div>
          </button>
          <button class="button ribbonButton ribbonBottomSide btnApply">
            <img src="./img/check.png">
            <div class="ribbon">저장</div>
          </button>
        </div>
      </header>
      <section class="content">
        <aside>
          <ul class="playlistList"></ul>
          <div class="dropArea">
            <div class="dropAreaWrapper">여기에 플레이리스트 드롭</div>
          </div>
          <button class="button btnFill primary btnNewPlaylist">
            <img src="./img/new.png">플레이리스트 만들기
          </button>
          <button class="button btnFill btnImportFromLocal">
            <img src="./img/file.png">파일에서 불러오기
          </button>
        </aside>
        <section class="list">
          <div class="MusicListView"></div>
          <footer class="listEditControl">
            <div class="left">
              <span class="allCount">0</span> 개 중 <span class="selectedCount">0</span> 개 선택됨
            </div>
            <div class="right">
              <button class="button btnRemoveMusicItem">
                선택된 노래 제거
              </button>
            </div>
          </footer>
        </section>
      </section>
    `;
    
    this._el.$query('.btnClosePanel').addEventListener('click', e => {
      if (this.isListOpened) {
        if (this.listEditMode === 'add' || this.listEditMode === 'edit') {
          this.applyListEditChanges(false);
        } else {
          this.isListOpened = false;
        }
      } else {
        this.hide();
      }
    });
    this._el.$query('.btnNewPlaylist').addEventListener('click', e => {
      this.createNewPlaylist();
    });
    this._el.$query('.btnImportFromLocal').addEventListener('click', async e => {
      await this.playlistManager.openPlaylistDialog();
      this.updateRender();
    });
    this._el.$query('.btnEdit').addEventListener('click', e => {
      this.listEditMode = 'edit';
    });
    this._el.$query('.btnAdd').addEventListener('click', e => {
      this.listEditMode = 'add';
    });
    this._el.$query('.btnApply').addEventListener('click', e => {
      this.applyListEditChanges(true);
    });
    this._el.$query('.btnRemoveMusicItem').addEventListener('click', this.removeSelectedItems);

    this.initPlaylistDropArea();
    this.initMusicListView();

    this.updateRender();


    const lastOpenedList = localStorage['dmap.lastOpenedPlaylist'];
    if (lastOpenedList && this.playlistManager.get(lastOpenedList)) {
      this.openedList = lastOpenedList;
      setTimeout(this.show, 300);
    }
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
    this._el.$query('ul.playlistList').innerHTML = '';

    const list = this.playlistManager.getAll();
    list.forEach(this.appendItemToList);
  }

  initPlaylistDropArea() {
    this.draggingLife = 0;
    this.isDraggingPlaylist = false;
    this.dropArea = this._el.$query('.dropArea');

    document.ondragover = e => { e.preventDefault(); }
    document.ondrop = e => { e.preventDefault(); }
    this._el.addEventListener('dragover', e => {
      this.draggingLife = 15;
    });

    this.loopDraggingLife = this.loopDraggingLife.bind(this);
    this.setDraggingPlaylist = this.setDraggingPlaylist.bind(this);
    requestAnimationFrame(this.loopDraggingLife);

    this.dropArea.addEventListener('drop', async e => {
      e.preventDefault();
      const { files } = e.dataTransfer;
      if (files && files[0]) {
        await this.playlistManager.loadFromFile(files[0]);
        this.updateRender();
        //alert('리스트를 불러왔습니다.');
      }
    });
  }
  loopDraggingLife() {
    if (this.draggingLife > 0) {
      this.draggingLife -= 1;
      !this.isDraggingPlaylist && this.setDraggingPlaylist(true);
    } else {
      this.isDraggingPlaylist && this.setDraggingPlaylist(false);
    }
    requestAnimationFrame(this.loopDraggingLife);
  }
  setDraggingPlaylist(val) {
    this.isDraggingPlaylist = val;
    if (this.isDraggingPlaylist) {
      this.dropArea.addClass('onDrag');
    } else {
      this.dropArea.removeClass('onDrag');
    }
  }
  initMusicListView() {
    this.musicListView = new MusicListView(this._el.$query('.MusicListView'), { isPlaylist: true });
    this.musicListView.on('playMusic', e => {

      // 큐 초기화
      const targetList = this.musicListView.getAll();
      queueManager.set(...targetList);

      loadMusic(e.musicId); //TODO: MusicController 수정시 수정
      queueManager.setCursorByMusicId(e.musicId);
      
      this.musicListView.playCursor = e;
    });
    this.musicListView.on('select', e => {
      const allCount = e.target.length;
      const selectedCount = e.selectedItems.length;
      this.setSelectedItemCount(allCount, selectedCount);
    });
    this.musicListView.on('removeItem', e => {
      const { musicId } = e.target;
      const target = this.playlistManager.get(this.openedList);
      if (!target) {
        return;
      }
      
      toastManager.create({ text: '플레이리스트에서 선택한 노래를 제거했습니다.' });
      target.remove(musicId);
      this.setMusicItemsByPlaylist(this.openedList);
    });
    this.musicListView.on('insertQueue', e => {
      const { target } = e;
      if (!target) {
        return;
      }

      queueManager.pushNext(...databaseManager.get(target.musicId));
    });
  }

  /**
   * 플레이리스트 아이템 요소를 생성해 리스트 요소에 추가합니다.
   * 
   * @param {Playlist} playlistItem 
   */
  appendItemToList(playlistItem) {
    this._el.$query('ul.playlistList').appendChild(this.generatePlaylistItemElement(playlistItem));
  }
  /**
   * 플레이리스트 아이템 요소를 생성합니다.
   * 
   * @param {Playlist} playlistItem 
   * @returns {HTMLElement}
   */
  generatePlaylistItemElement(playlistItem) {
    const { uuid, name, list } = playlistItem;
    
    // html 생성
    const elItem = document.createElement('li');
    elItem.dataset.uuid = uuid;
    if (!['all', 'lyrics'].includes(uuid)) {
      elItem.classList.add('modifiable');
    }
    elItem.innerHTML = `
      <img src="./img/playlist.png">
      <div class="infoArea">
        <span class="name">${name}</span>
        <button class="button ribbonButton btnEditName">
          <img src="./img/edit.png">
          <div class="ribbon">이름 수정</div>
        </button>
      </div>
      <button class="button btnPlayPlaylist">
        <img src="./img/play.png">
      </button>
      <button class="button moreButton btnMore">
        <img src="./img/moreVert.png">
        <div class="moreMenuWrapper">
          <ul class="menuList">
            <li class="menuItem saveToFile">
              <div class="iconArea"><img src="./img/save.png"></div>
              <div class="label">파일로 저장</div>
            </li>
            <li class="menuItem removePlaylist">
              <div class="iconArea"><img src="./img/delete_red.png"></div>
              <div class="label">플레이리스트 삭제</div>
            </li>
          </ul>
        </div>
      </button>`;

    elItem.addEventListener('click', e => {
      console.log(uuid)
      console.log(e.target)
      if (e.target.classList.contains('btnEditName')) { // edit name
        const newName = prompt('새 플레이리스트 이름을 입력해주세요.', name);
        if (newName && newName !== name) {
          playlistItem.name = newName;
          this.updateRender();
        }
      } else if (containsPath('btnMore', e.composedPath())) { // menu
        if (e.target.classList.contains('saveToFile')) {
          this.playlistManager.saveToFile(uuid);
        }
        if (e.target.classList.contains('removePlaylist')) {
          this.removePlaylist(playlistItem);
        }
      } else if (e.target.classList.contains('btnPlayPlaylist')) { // play playlist
        this.playPlaylist(playlistItem);
      } else { // open playlist
        this.openedList = uuid;
      }
    });

    return elItem;
  }

  hide() {
    this._el.addClass('hide');
    localStorage['dmap.lastOpenedPlaylist'] = '';
  }
  show() {
    this._el.removeClass('hide');
    if (this.openedList) {
      localStorage['dmap.lastOpenedPlaylist'] = this.openedList;
    }
  }

  /**
   * 플레이리스트의 첫번째 노래부터 재생합니다.
   * 
   * @param {Playlist} playlist 
   * @returns {boolean} 플레이리스트에 노래가 없으면 fasle 반환
   */
  playPlaylist(playlist) {
    this.setMusicItemsByPlaylist(playlist.uuid);
    const firstMusic = this.musicListView.get(0);
    if (firstMusic == undefined) {
      return false;
    }
    toastManager.create({ text: `'${playlist.name}' 리스트를 재생합니다.` });
    loadMusic(firstMusic.musicId); //TODO: MusicController 수정시 수정
    this.musicListView.playCursor = firstMusic;
    const targetList = this.musicListView.getAll();
    queueManager.set(...targetList);
    return true;
  }

  /**
   * 플레이리스트 편집시 하단에 표시되는 숫자를 수정합니다.
   * 
   * @param {number} all 
   * @param {number} selected 
   */
  setSelectedItemCount(all, selected) {
    this._el.$query('.allCount').innerText = all;
    this._el.$query('.selectedCount').innerText = selected;
  }

  /**
   * 선택된 노래를 플레이리스트 변경사항 리스트에 추가합니다.
   */
  addSelectedItems() {
    this._editingList.push(...this.musicListView.selectedItems);
    this.setMusicItemsByMusicId(...this._editingList);
    this.musicListView.clearSelectedItems();
    this.updateRender();
  }
  /**
   * 선택된 노래를 플레이리스트 변경사항 리스트에서 제거합니다.
   */
  removeSelectedItems() {
    this._editingList = this._editingList.filter(musicId => !this.musicListView.selectedItems.includes(musicId));
    this.setMusicItemsByMusicId(...this._editingList);
    this.musicListView.clearSelectedItems();
    this.updateRender();
  }

  /**
   * 새 플레이리스트를 생성합니다.
   */
  createNewPlaylist() {
    const name = prompt('플레이리스트 이름을 입력해주세요.', `새 플레이리스트 ${this.playlistManager.length - 1}`);

    if (!name) { // cancel
      return;
    }

    const playlist = new Playlist({
      parent: this.playlistManager,
      name,
    });
    this.playlistManager.push(playlist);
    toastManager.create({ text: `'${playlist.name}' 리스트를 생성했습니다.` });
    this.openedList = playlist.uuid;
    this.listEditMode = 'add';
  }

  /**
   * 플레이리스트를 삭제합니다.
   * 
   * @param {Playlist} playlist 삭제할 플레이리스트
   */
  removePlaylist(playlist) {
    if (!confirm('참말로 플레이리스트를 삭제하시겠습니까?')) { // cancel
      return;
    }

    toastManager.create({ text: `'${playlist.name}' 리스트를 삭제했습니다.` });
    this.playlistManager.remove(playlist.uuid);
    this.openedList = '';
    this.listEditMode = '';
    this.updateRender();
  }

  get isVisible() {
    return !this._el.hasClass('hide');
  }

  set isListOpened(val) {
    this._isListOpened = val;
    if (this._isListOpened) {
      this._el.addClass('listOpened');
    } else {
      this.listEditMode = '';
      this.caption = '플레이리스트';
      this._el.removeClass('listOpened');
    }
  }
  get isListOpened() {
    return this._isListOpened;
  }
  set listEditMode(val) {
    const prevValue = this._listEditMode;
    this._listEditMode = val;

    const target = this.playlistManager.get(this._openedList);
    if (!target) { // if playlist is null
      this.caption = '플레이리스트';
      this._listEditMode = '';
      this.musicListView.selectMode = false;
      this._el.removeClass('modeEdit');
      this._el.removeClass('modeAdd');
      this._isListOpened = false;
      this._el.removeClass('listOpened');
      return;
    }
    
    if (prevValue === 'add' && this._listEditMode !== 'add') { // entering add mode
      this.openedList = this.openedList;
    }
    if (prevValue === '' && (this._listEditMode === 'edit' || this._listEditMode === 'add')) { // entering edit mode
      this._editingList = [...target.list];
    }

    if (this._listEditMode === 'edit') {
      this.caption = `${target.name} 편집`;
      this.musicListView.selectMode = true;
      this._el.addClass('modeEdit');
      this._el.removeClass('modeAdd');

      this.setMusicItemsByMusicId(...this._editingList);
      
    } else if (this._listEditMode === 'add') {
      this.caption = `${target.name}에 담을 곡 선택`;
      this.musicListView.selectMode = true;
      this._el.removeClass('modeEdit');
      this._el.addClass('modeAdd');

      this.setMusicItemsByPlaylist('all');
      
    } else {
      this.caption = `${target.name}`;
      this.musicListView.selectMode = false;
      this._el.removeClass('modeEdit');
      this._el.removeClass('modeAdd');

      this.setMusicItemsByPlaylist(this.openedList);
    }
  }
  get listEditMode() {
    return this._listEditMode;
  }

  /**
   * 플레이리스트 변경사항을 적용합니다.
   * 
   * @param {boolean} saveChanges false시 변경사항을 적용하지 않고 편집창을 닫습니다.
   */
  applyListEditChanges(saveChanges = false) {
    if (this.listEditMode === 'add') {
      if (saveChanges) {
        this.addSelectedItems();
      }
      this.listEditMode = 'edit';
    } else if (this.listEditMode === 'edit') {
      if (saveChanges) {
        this.playlistManager.get(this._openedList).set(...this._editingList);
        this.listEditMode = '';
      } else {
        if (!this.compareListEditChanges() || confirm('플레이리스트가 수정되었습니다. 저장하지 않고 닫으시겠읍니까?')) {
          this.listEditMode = '';
        }
      }
    }
  }

  /**
   * 플레이리스트에 변경 사항이 있는지 여부를 반환합니다.
   * 
   * @returns {boolean}
   */
  compareListEditChanges() {
    const target = this.playlistManager.get(this.openedList);
    return JSON.stringify(this._editingList) !== JSON.stringify(target.list);
  }

  /**
   * MusicListView에 표시할 플레이리스트를 설정합니다.
   * 
   * @param {number} uuid 
   * @returns {Playlist|null} 표시된 플레이리스트
   */
  setMusicItemsByPlaylist(uuid) {
    const target = this.playlistManager.get(uuid);
    if (target) {
      const targetList = databaseManager.get(...target.list);
      this.musicListView.set(...targetList);
      this.setSelectedItemCount(targetList.length, 0);
      return target;
    }
    return null;
  }
  /**
   * MusicListView에 표시할 노래를 설정합니다.
   * 
   * @param {number[]} items 
   * @returns {number[]} 표시된 노래 목록
   */
  setMusicItemsByMusicId(...items) {
    const targetList = databaseManager.get(...items);
    this.musicListView.set(...targetList);
    this.setSelectedItemCount(targetList.length, 0);
    return targetList;
  }
  
  set openedList(uuid) {
    const target = this.setMusicItemsByPlaylist(uuid);
    if (target) {
      this._openedList = uuid;
      this._el.addClass('listOpened');
      this.isListOpened = true;
      this.caption = target.name;

      localStorage['dmap.lastOpenedPlaylist'] = this._openedList;
    } else {
      this._openedList = '';
      localStorage['dmap.lastOpenedPlaylist'] = '';
    }
  }
  get openedList() {
    return this._openedList;
  }

  set caption(val) {
    const caption = this._el.$query('header .caption');
    if (!val) {
      caption.innerText = '플레이리스트';
    } else {
      caption.innerText = val;
    }
  }
  get caption() {
    return this._el.$query('header .caption').innerText;
  }
}

