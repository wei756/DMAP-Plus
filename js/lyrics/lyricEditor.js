const lyricEditor = $query('section.lyricEditor');
const titleEdit = lyricEditor.$query('input[name="lyricTitle"]');
const offsetEdit = lyricEditor.$query('input[name="lyricOffset"]');
const lyricTextInput = lyricEditor.$query('textarea[name="lyricTextInput"]');
const lyricListEdit = lyricEditor.$query('ul.lyricList');

let modeLyricEdit = false;
let editTarget = null;
let editCursor = 0;
let playingCursor = 0;

// lyrics: object from lyricLoader.js
// isPlaying: boolean from main.js
// playIndex: number from main.js
// musicList: array from main.js

titleEdit.addEventListener('change', e => {
  if (editTarget) {
    editTarget.title = e.target.value;
  }
});
offsetEdit.addEventListener('change', e => {
  if (editTarget) {
    editTarget.offset = parseInt(e.target.value);
  }
});

function toggleModeLyricEdit() {
  modeLyricEdit = !modeLyricEdit;

  if (modeLyricEdit) {
    lyricEditor.removeClass('hide');
  } else {
    lyricEditor.addClass('hide');
  }
}

function loadLyric(musicId) {
  if (!lyrics[musicId]) {
    lyrics[musicId] = {
      title: '',
      offset: 0,
      data: [],
    };
  }
  editTarget = lyrics[musicId];

  titleEdit.value = editTarget.title;
  offsetEdit.value = editTarget.offset;
  editCursor = 0;

  clearLyricListEdit();
  editTarget.data.forEach(addItemToLyricListEdit);
}
DMAP_addEventListener('changeMusic', loadLyric);
loadLyric(playIndex);

function clearLyricListEdit() {
  lyricListEdit.innerHTML = '';
}
function addItemToLyricListEdit(lyricItem, i) {
  const itemEl = document.createElement('li');
  itemEl.addClass('lyricItem');
  itemEl.innerHTML = `
  <div class="time">
    <input type="time" class="timeInput" step="0.001" min="0:00:00" max="1:00:00"></input>
  </div>
  <div class="str">
    <input type="text" class="strInput"></input>
  </div>
  `;
  itemEl.$query('.timeInput').value = convertTimeToString(lyricItem.time);
  itemEl.$query('.strInput').value = untokenizeCaptionText(lyricItem.caption);
  itemEl.$query('.timeInput').name = `lyricTime_${i}`;
  itemEl.$query('.strInput').name = `lyricStr_${i}`;
  itemEl.$query('.timeInput').addEventListener('change', e => {
    const convertedTime = convertStringToTime(e.target.value);
    lyricItem.time = convertedTime;
  });
  itemEl.$query('.timeInput').addEventListener('dblclick', e => {
    seekTimeInput(e.target.value)
  });
  itemEl.$query('.strInput').addEventListener('change', e => {
    lyricItem.caption = tokenizeCaptionText(e.target.value);
  });
  
  itemEl.$query('.timeInput').addEventListener('click', e => {
    const index = parseInt(e.target.name.replace('lyricTime_', ''));
    setEditCursor(index);
  });

  lyricListEdit.append(itemEl)
}

function setEditCursor(i) {
  if (!editTarget) { return; }
  
  editCursor = i % (editTarget.data.length || 1);
  updateCursor();
  if (lyricListEdit.$queryAll('li.lyricItem')[0]) {
    const itemHeight = lyricListEdit.$queryAll('li.lyricItem')[editCursor].clientHeight + 8;
    const targetTop = itemHeight * editCursor;
    lyricListEdit.scrollTop += Math.min(targetTop - lyricListEdit.scrollTop, 0) +
      Math.max(targetTop + itemHeight - (lyricListEdit.scrollTop + lyricListEdit.clientHeight) + 8, 0);
  }
}
function updatePlayingCursor(currTime) {

  const prevPlayingCursor = playingCursor;

  if (editTarget) {
    const currCaption = getCurrentCaption(parseInt(currTime), editTarget.data, editTarget.offset);

    if (currCaption) {
      playingCursor = editTarget.data.findIndex(item => item == currCaption);
      updateCursor();
      const lyricItems = lyricListEdit.$queryAll('li.lyricItem');
      if (lyricItems[0] && lyricItems[playingCursor] && prevPlayingCursor !== playingCursor) {
        const itemHeight = lyricItems[playingCursor].clientHeight + 8;
        const targetTop = itemHeight * playingCursor;
        lyricListEdit.scrollTop += Math.min(targetTop - lyricListEdit.scrollTop, 0) +
          Math.max(targetTop + itemHeight - (lyricListEdit.scrollTop + lyricListEdit.clientHeight) + 8, 0);
      }
    }
  }
}
videoPlayer.on('time', ({time}) => updatePlayingCursor(time * 1000));

function updateCursor() {
  if (!editTarget || !modeLyricEdit) { return; }
  
  const lyricItems = lyricListEdit.$queryAll('li.lyricItem');
  if (lyricItems && lyricItems.length) {
    lyricItems.forEach(item => (item.removeClass('editSync'), item.removeClass('currPlaying')));
    lyricItems[editCursor] && lyricItems[editCursor].addClass('editSync');
    lyricItems[playingCursor] && lyricItems[playingCursor].addClass('currPlaying');
  }
}

function addLyricItem(strArr) {
  strArr.split('\n').map(str => str.trim()).forEach(str => {
    const now = parseInt(videoPlayer.time * 1000);
    const newLyricItem = {
      time: now,
      caption: tokenizeCaptionText(str),
    };
    editTarget.data.push(newLyricItem);
    addItemToLyricListEdit(newLyricItem, editTarget.data.length - 1);
  })
}
function addLyricItemFromInput() {
  if (lyricTextInput.value) {
    addLyricItem(lyricTextInput.value);
    lyricTextInput.value = '';
  }
}

function syncTime(offset = 0, moveNext = true) {
  if (editTarget) {
    const now = parseInt(videoPlayer.time * 1000) - editTarget.offset;
    const targetTime = offset ? 
      editTarget.data[editCursor].time + offset : 
      now;
    editTarget.data[editCursor].time = targetTime;
    lyricListEdit.$query(`.timeInput[name="lyricTime_${editCursor}"]`).value = convertTimeToString(targetTime);
    if (moveNext) {
      setEditCursor(editCursor + 1);
    }
  }
}

function seekTimeInput(value) {
  if (editTarget) {
    const time = convertStringToTime(value) + editTarget.offset;
    videoPlayer.time = time / 1000;
  }
}

lyricListEdit.addEventListener('keydown', e => {
  if (!modeLyricEdit || !videoPlayer.isPlaying) {
     return
  }
  if (e.keyCode === 17) { // Left Ctrl Key
    syncTime();
  }
});

function convertLyricScore(lyricObj) {
  let output = '';
  output += `TITLE ${lyricObj.title}\r\n`;
  output += `OFFSET ${lyricObj.offset}\r\n`;
  lyricObj.data.forEach(lyricItem => {
    output += `\r\n${convertTimeToString(lyricItem.time)}->${untokenizeCaptionText(lyricItem.caption)}`;
  })
  output += `\r\n`;

  return output;
}

function exportScore() {
  const scoreTxt = `lyrics['${playIndex}'] = \`${convertLyricScore(editTarget)}\`;`;
  saveFile(scoreTxt, '가사.html', 'text/plain');
}