const captionText = $query('.captionText');

let prevCaption = null;

// isPlaying: boolean from main.js
// playIndex: number from main.js
// musicList: array from main.js

musicList.forEach(musicItem => {
  musicItem.hasLyric = !!lyrics[musicItem.musicId];
});

function updateCaptionView(currTime) {
  if (lyrics[playIndex] || false) {
    const lyric = lyrics[playIndex];

    const currCaption = getCurrentCaption(currTime, lyric.data, lyric.offset);

    if (currCaption && currCaption != prevCaption) {
      updateCaptionText(currCaption.caption);
      prevCaption = currCaption;
    }
  } else if (!lyrics[playIndex]) {
    const currCaption = { caption: [''] };
    if (currCaption && currCaption != prevCaption) {
      updateCaptionText(currCaption.caption);
      prevCaption = currCaption;
    }
  }
}
function getCurrentCaption(currTime, captionData, offset = 0) {
  return captionData.reduce((result, item) => {
    if (item.time + offset <= currTime) {
      return item;
    } else {
      return result;
    }
  }, { caption: [''] });
}
function updateCaptionText(dataArr) {
  captionText.innerText = '';
  dataArr.forEach(data => captionText.innerText += data);
  if (captionText.innerText == '') {
    captionText.addClass('noContent');
  } else if (captionText.hasClass('noContent')) {
    captionText.removeClass('noContent');
  }
}


(function () {
  videoPlayer.on('time', ({time}) => updateCaptionView(time * 1000));
})();
