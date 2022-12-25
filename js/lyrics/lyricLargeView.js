const btnLyric = $query('.btnLyric');
const captionOnList = $query('.captionOnList');
const captionTextList = captionOnList.$query('.captionText');

// isPlaying: boolean from main.js
// playIndex: number from main.js
// musicList: array from main.js

let modeLyricView = false;

var prevCaption_ = null;

function toggleModeLyricView() {
  modeLyricView = !modeLyricView;

  if (modeLyricView) {
    captionOnList.removeClass('hide');
    btnLyric.addClass('on');
  } else {
    captionOnList.addClass('hide');
    btnLyric.removeClass('on');
  }
}

function loadLyricList(musicId) {
  clearLyricList();
  
  if (lyrics[musicId]) {
    lyrics[musicId].data.forEach(addItemToLyricList);
    captionTextList.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }
}
DMAP_addEventListener('changeMusic', loadLyricList);
loadLyricList(playIndex);

function clearLyricList() {
  captionTextList.innerText = '';
}
function addItemToLyricList(lyricItem, i) {
  const itemEl = document.createElement('li');
  itemEl.addClass('lyricItem');
  itemEl.innerHTML = `
    <div type="text" class="content"></div>
  `;
  lyricItem.caption.forEach(data => itemEl.$query('.content').innerText += data);;
  
  itemEl.addEventListener('click', e => {
    videoPlayer.time = (lyricItem.time + lyrics[videoPlayer.targetMusicId].offset) / 1000;
  });
  itemEl.addEventListener('dblclick', e => {
  });

  captionTextList.append(itemEl)
}

function updateCaptionLargeView(currTime) {
  if (lyrics[playIndex]) {
    const lyric = lyrics[playIndex];

    const currCaption = getCurrentCaption(currTime, lyric.data, lyric.offset);

    if (currCaption && currCaption != prevCaption_) {
      const lyricIndex = lyric.data.findIndex(item => item == currCaption);
      captionTextList.$queryAll('li.lyricItem.current').forEach(item => item.removeClass('current'));
      captionTextList.$queryAll('li.lyricItem')[lyricIndex] && 
        captionTextList.$queryAll('li.lyricItem')[lyricIndex].addClass('current');
      prevCaption_ = currCaption;
      if (modeLyricView) {
        scrollToLyric(lyricIndex);
      }
    }
  }
}

function scrollToLyric(index) {
  const itemHeight = 32;
  const { scrollTop, clientHeight } = captionTextList;
  if (index * itemHeight > scrollTop + clientHeight - clientHeight / 2 - itemHeight) {
    captionTextList.scrollTo({
      behavior: 'smooth',
      top: index * itemHeight - clientHeight / 2 + itemHeight,
    });
  }
}


(function () {
  videoPlayer.on('time', ({time}) => updateCaptionLargeView(time * 1000));
})();
