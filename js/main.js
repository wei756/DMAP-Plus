var playIndex = 0;              // 현재 재생중인 노래 id
var databaseLength = db.length; // 데이터베이스 길이

var listOrder = 'date'; // 정렬 기준(data|title|singer)
var flowIndex = false;  // 정렬 방향(false:내림차순|true:오름차순)

var playUrl = '';       // 현재 재생중인 영상url

var selectMode = false;  // 플레이리스트 추가용 선택 모드
var playlistList = [];   // 플레이리스트
var playMode = 'normal'; // 재생 순서(normal|shuffle|random)
var currentListLength = databaseLength;

var shuffleQueue = [];   // 셔플 재생시 사용할 배열

var modeMusicOnly = false;

const onTimeEventListener = [];
const eventListener = {
  time: [],
  changeMusic: [],
};
function DMAP_addEventListener(eventName, handler) {
  eventListener[eventName].push(handler);
}
function DMAP_removeEventListener(eventName, handler) {
  eventListener[eventName] = eventListener[eventName].filter(hd => hd != handler);
}
function DMAP_performEventListener(eventName, ...args) {
  if (!eventListener[eventName]) {
    return;
  }
  eventListener[eventName].forEach(handler => handler(...args));
}

// db 구조화
const musicList = db.map(item => ({
  musicId: item[5], 
  title: removeNewMarker(item[0]), 
  titleChosung: convertToChosung(removeNewMarker(item[0])), 
  singer: item[1], 
  singerChosung: convertToChosung(item[1]), 
  isNew: !!item[0].match(/^\[(New|NEW)\] /), 
  startTime: item[2], 
  endTime: item[3], 
  suburl: item[4], 
  isVisible: true, 
  hasLyric: false,
}));

const musicTitle = $id('musicTitle');
const musicSinger = $id('musicSinger');
const progressBar = $query('#musicProgress .progressBar');
const progressBarPreview = $id('progressBarPreview');
const currTime = $query('#musicProgress .currTime');
const wholeTime = $query('#musicProgress .wholeTime');
const btnPlaypause = $query('.btnPlaypause');
const musicSelectHeader = $query('.musicSelectHeader');
const ribbonArea = $query('.ribbonArea');
const ribbonMusicSelecting = $query('.ribbonArea .ribbon.musicSelecting');
const ribbonMusicSelectingCount = $query('.ribbonArea .ribbon.musicSelecting .label .selectedCount');

const btnPlaylist = $query('.btnPlaylist');

let videoPlayer = new VideoPlayer('video');
let databaseManager = new DatabaseManager();
let playlistManager = new PlaylistManager({ databaseManager });
let playlistPanel = new PlaylistPanel($query('.PlaylistPanel'), playlistManager);
let queueManager = new QueueManager();
let toastManager = new ToastManager($query('.ToastArea'));

let musicListView = new MusicListView($query('.MusicListView'));

queueManager.set(...databaseManager.get(...playlistManager.get('all').list));

musicListView.set(...databaseManager.get(...playlistManager.get('all').list));

btnPlaylist.addEventListener('click', e => playlistPanel.isVisible ? playlistPanel.hide() : playlistPanel.show());

musicListView.on('playMusic', e => {

  // 큐 초기화
  const targetList = musicListView.getAll();
  queueManager.set(...targetList);

  loadMusic(e.musicId);
  queueManager.setCursorByMusicId(e.musicId);
  musicListView.playCursor = e;
});
musicListView.on('insertQueue', e => {
  const { target } = e;
  if (!target) {
    return;
  }
  
  queueManager.pushNext(...databaseManager.get(target.musicId));
});

musicListView.playCursor = 0;


/**
 * 마지막으로 자동으로 다음 곡 재생이 된 타임스탬프
 * 노래 스킵 방지로 넣어 놓음
 * 
 * @type {number}
 */
let lastPlayNextTimestamp = 0;
const playNextMinimumInterval = 100;
/**
 * DMAP 플레이어를 초기화합니다.
 */
function setupPlayer() {

  videoPlayer.on('volume', ({volume}) => {
    setVolumeBar(volume);

    if (volume > 0) {
      volumeBeforeMuteValue = Math.max(10, volume);
    }
  });

  videoPlayer.on('noVideo', e => {
    $query(`#musiclist > li[data-music-id='${playIndex}']`).click();
  });

  videoPlayer.on('time', e => {
    // 진행바 업데이트
    setProgress(e.time);

    DMAP_performEventListener('time', e)
  });

  // 다음 곡 처리
  videoPlayer.on('endVideo', e => {
    console.log(e.currTime - lastPlayNextTimestamp)
    if (e.currTime - lastPlayNextTimestamp >= playNextMinimumInterval) {
      playNext();
    }
    lastPlayNextTimestamp = e.currTime;
  })

  // 재생/일시정지 버튼 처리
  videoPlayer.on('play', s => {
    btnPlaypause.addClass('playing');
    btnPlaypause.removeClass('paused');
  });
  videoPlayer.on('pause', s => {
    btnPlaypause.addClass('paused');
    btnPlaypause.removeClass('playing');
  });
}

/**
 * 정렬이 반영된 노래 리스트를 반환합니다.
 */
function getList(ignoreVisible = false) {

  const list = musicListView.getAll();

  return list;
}

/**
 * 뮤직 컨트롤러에 표시되는 노래 갯수 카운터 값을 변경합니다.
 */
function setTotalMusicLength(val = databaseLength) {
  $id('totalplaylist').innerText = `Total : ${val}`;
}

/**
 * 플레이어 진행바를 설정합니다.
 */
function setProgress(now) {
  currTime.innerText = formatTime(now);
  progressBar.value = now;
}

/**
 * 뮤직 컨트롤러에 id에 해당하는 노래 정보를 표시합니다.
 */
function setMusicInfoById(id) {
  const { title, singer, startTime, endTime } = getMusicById(id);
  
  setTitle(title, singer);
  
  wholeTime.innerText = formatTime(endTime - startTime);
  progressBar.setAttribute('max', endTime - startTime);
}
/**
 * 뮤직 컨트롤러에 지정한 노래 정보를 표시합니다.
 */
function setTitle(title, singer) {
  musicTitle.innerText = title;
  musicSinger.innerText = singer;
}

/**
 * 현재 재생중인 노래와 url이 같은지 여부를 반환합니다.
 */
function isSameVideo(url) {
  return playUrl != '' && playUrl === url;
}

function setViewPlaying(musicId) {
  $queryAll(`#musiclist > li.play`).forEach(el => el.removeClass('play'));
  const playingViewTarget = $query(`#musiclist > li[data-music-id='${musicId}']`);
  playingViewTarget && playingViewTarget.addClass('play');
}

/**
 * id값에 해당하는 노래를 재생합니다.
 */
function loadMusic(id) {
  const prevPlayIndex = playIndex;
  const target = getMusicById(id) || getList()[0];
  const { title, singer, startTime, endTime, suburl, musicId } = target;
  console.log(`[${musicId}] 현재 곡은 '${singer}' - '${title}' 입니다.`);
  
  playIndex = id;

  // 노래 정보 표시
  setMusicInfoById(playIndex);

  // 진행바 초기화
  setProgress(0);

  // 플레이중 표시
  setViewPlaying(playIndex);

  var url = suburl;
  playUrl = url;
  videoPlayer.target = target;

  // 노래 변경 이벤트
  if (prevPlayIndex !== playIndex) {
    console.log(playIndex);
    DMAP_performEventListener('changeMusic', playIndex);
  }
}

/**
 * 노래가 재생중이면 일시정지, 아니면 재생합니다.
 */
function playpause() {
  if (videoPlayer.isPlaying) {
    videoPlayer.pause();
  } else {
    videoPlayer.play();
  }
}

function onMouseEnterProgressHandler(e) {
  progressBarPreview.style.opacity = 1;
  progressBarPreview.max = progressBar.max;
}
function onMouseMoveProgressHandler(e) {
  const targetTime = e.offsetX / e.currentTarget.clientWidth * e.currentTarget.max;
  progressBarPreview.value = targetTime;
}
function onMouseOutProgressHandler(e) {
  progressBarPreview.style.opacity = 0;
}
function onClickProgressHandler(e) {
  const targetTime = e.offsetX / e.currentTarget.clientWidth * e.currentTarget.max;
  videoPlayer.time = targetTime;
}

function removeNewMarker(str) {
  return str.indexOf('[New] ') === 0 || str.indexOf('[NEW] ') === 0 ?
    str.slice(6) : 
    str;
}

function getMusicById(musicId) {
  const list = getList(true);
  return list.find(item => item.musicId == musicId);
}

/**
 * 음악 리스트를 표시합니다.
 */
function loadList(startOffset = 0, length = getList().length) {

  // 플레이중 표시
  setViewPlaying(playIndex);
}


function search(str) {
  
  const list = getList(true);

  const filteredSearchStr = filterSearchText(str);
  
  list.forEach(item => {
    const isInPlaylist = playlistList.includes(item.musicId);
    const isSearchedTitle = filterSearchText(item.title).includes(filteredSearchStr) || filterSearchText(item.titleChosung).includes(filteredSearchStr) ;
    const isSearchedSinger = filterSearchText(item.singer).includes(filteredSearchStr) || filterSearchText(item.singerChosung).includes(filteredSearchStr);
    item.isVisible = (selectMode || isInPlaylist || playlistList.length == 0 || !usePlaylist) && (isSearchedTitle || isSearchedSinger);
  });

  currentListLength = list.filter(item => item.isVisible).length;

  // 리스트 업데이트
  //updateMusiclistView();
}

/**
 * 이전 곡을 재생합니다.
 */
function playPrev() {
  const list = queueManager.getAll();

  if (playMode == 'normal') {
    const pageIndex = list.findIndex(item => item.musicId == playIndex);
    const playIndexTarget = queueManager.prev();

    musicListView.playCursor = playIndexTarget;
    playlistPanel.musicListView.playCursor = playIndexTarget;
    loadMusic(playIndexTarget.musicId);

  }
  else if (playMode == 'shuffle') {
    const currentShuffleQueueIndex = shuffleQueue.findIndex(id => id === playIndex);
    const playIndexTarget = shuffleQueue[(list.length + currentShuffleQueueIndex - 1) % list.length];
    
    musicListView.playCursor = list.find(item => item.musicId === playIndexTarget);
    playlistPanel.musicListView.playCursor = list.find(item => item.musicId === playIndexTarget);
    loadMusic(playIndexTarget);

  } else if(playMode == 'repeat') {
    console.log("한 곡 재생 중입니다.");
  }
}

/**
 * 다음 곡을 재생합니다.
 */
function playNext() {
  const list = queueManager.getAll();

  if (playMode == 'normal') {
    const pageIndex = list.findIndex(item => item.musicId == playIndex);
    const playIndexTarget = queueManager.next();

    musicListView.playCursor = playIndexTarget;
    playlistPanel.musicListView.playCursor = playIndexTarget;
    loadMusic(playIndexTarget.musicId);

  } else if (playMode == 'shuffle') {
    const currentShuffleQueueIndex = shuffleQueue.findIndex(id => id === playIndex);
    const playIndexTarget = shuffleQueue[(currentShuffleQueueIndex + 1) % list.length];

    musicListView.playCursor = list.find(item => item.musicId === playIndexTarget);
    playlistPanel.musicListView.playCursor = list.find(item => item.musicId === playIndexTarget);
    loadMusic(playIndexTarget);

  } else if (playMode == 'repeat') {
    videoPlayer.time = 0;
    console.log("한 곡 재생 중입니다.");
  }
}


const defaultFlow = {
  date: true,
  title: false,
  singer: false,
}
function changeOrder(target = 'date') {
  if (listOrder !== target) {
    flowIndex = defaultFlow[target];
  }
  listOrder = target;
  flowIndex = !flowIndex;

  const orderList = $query('.orderList');
  if (flowIndex) {
    orderList.addClass('asc');
    orderList.removeClass('desc');
  } else {
    orderList.addClass('desc');
    orderList.removeClass('asc');
  }
  orderList.removeClass('date');
  orderList.removeClass('title');
  orderList.removeClass('singer');
  orderList.addClass(listOrder);
  

  const targetOrder = `${listOrder}_${flowIndex ? 'asc' : 'desc'}`;
  musicListView.order = targetOrder;

  if (playlistPanel.isListOpened) {
    playlistPanel.musicListView.order = targetOrder;
  }

  //updateMusiclistView();
}


//////////////////////////////////
// 플레이 리스트                //
//////////////////////////////////

function toggleEditPlaylistMode() {
  selectMode = !selectMode;
  search(getCurrentSearchKeyword());
  ribbonMusicSelectingCount.innerText = playlistList.length;
  if (selectMode) {
    ribbonMusicSelectingCount.innerText = playlistList.length;
    ribbonArea.removeClass('hide');
    ribbonMusicSelecting.removeClass('hide');
    musicSelectHeader.removeClass('hide');
  } else {
    ribbonArea.addClass('hide');
    ribbonMusicSelecting.addClass('hide');
    musicSelectHeader.addClass('hide');
  }
}

let playModeRepeat = false;
let playModeShuffle = false;
const btnRepeat = $query('.btnMode.btnRepeat');
const btnShuffle = $query('.btnMode.btnShuffle');

/**
 * 재생 모드를 변경합니다.
 */
function modeChange(mode) {
  if (mode === 'repeat') {
    playModeRepeat = !playModeRepeat;
    if (playModeRepeat) {
      btnRepeat.addClass('on');
    } else {
      btnRepeat.removeClass('on');
    }
  }
  if (mode === 'shuffle') {
    playModeShuffle = !playModeShuffle;
    if (playModeShuffle) {
      geneShuffleQueue();
      btnShuffle.addClass('on');
    } else {
      btnShuffle.removeClass('on');
    }
  }
  
  if (playModeRepeat) {
    playMode = 'repeat';
  } else if (playModeShuffle) {
    playMode = 'shuffle';
  } else {
    playMode = 'normal';
  }
}

/**
 * 랜덤 재생을 위한 대기열을 생성합니다.
 */
function geneShuffleQueue() {
  shuffleQueue = queueManager.getAll().map(musicItem => musicItem.musicId);
  shuffleQueue.shuffle();
}

function setModeMusicOnly(val) {
  modeMusicOnly = val;
  localStorage['dmap.musicOnly'] = val ? '1' : '0';
  if (modeMusicOnly) {
    $query('.app').addClass('musicOnly');
  } else {
    $query('.app').removeClass('musicOnly');
  }
}
function toggleModeMusicOnly() {
  setModeMusicOnly(!modeMusicOnly);
}

var volumeValue = 50;
var volumeBeforeMuteValue = 50;
var isVolumeClicked = false;
var volumeClickedOffset = 0;
const btnVolume = $query('.btnVolume');

function onMouseDownVolumeHandler(e) {
  isVolumeClicked = true;
  volumeClickedOffset = e.clientY + (e.offsetX - 1);
  if (!btnVolume.classList.contains('clicked')) {
    btnVolume.addClass('clicked');
  }
  const value = Math.min(Math.max(volumeClickedOffset - e.clientY, 0), 100);
  setVolume(value);
}
function onMouseMoveVolumeHandler(e) {
  if (isVolumeClicked) {
    const value = Math.min(Math.max(volumeClickedOffset - e.clientY, 0), 100);
    setVolume(value);
  }
}
function onMouseUpVolumeHandler(e) {
  isVolumeClicked = false;
  if (btnVolume.classList.contains('clicked')) {
    btnVolume.removeClass('clicked');
  }
}
document.onmousemove = onMouseMoveVolumeHandler;
document.onmouseup = onMouseUpVolumeHandler;

function setVolume(val) {

  // clamping
  volumeValue = Math.min(Math.max(parseInt(val), 0), 100);

  videoPlayer.volume = volumeValue;

  setVolumeBar(volumeValue);
  
  localStorage['dmap.musicVolume'] = volumeValue;
}

function setAddVolume(val) {
  setVolume(volumeValue + val);
}

function setVolumeBar(val) {
  $query('.btnVolume progress').value = parseInt(val);
  btnVolume.style = `--value: ${parseInt(val)}`;

  btnVolume.removeClass('full');
  btnVolume.removeClass('half');
  btnVolume.removeClass('small');
  btnVolume.removeClass('mute');

  if (val == 100) {
    btnVolume.addClass('full');
  } else if (val >= 50) {
    btnVolume.addClass('half');
  } else if (val > 0) {
    btnVolume.addClass('small');
  } else {
    btnVolume.addClass('mute');
  }
}

function toggleMute(e) {
  if (!e.target.classList.contains('btnVolume')) { return; }
  
  if (volumeValue > 0) {
    // mute
    volumeBeforeMuteValue = Math.max(10, volumeValue);
    setVolume(0);
  } else {
    // unmute
    setVolume(volumeBeforeMuteValue);
  }
}

/**
 * initialize
 */
(() => {
  //loadPlaylistFromLocalStorage();
  
  const firstMusic = getList()[0];
  playIndex = firstMusic.musicId;

  setupPlayer();
  loadMusic(playIndex);
  DMAP_performEventListener('changeMusic', playIndex);
  search('');
  setModeMusicOnly(localStorage['dmap.musicOnly'] == '1');
  setVolume(parseInt(localStorage['dmap.musicVolume'] || '50'));

})();
// lastPlayedMusicId