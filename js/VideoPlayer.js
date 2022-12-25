class VideoPlayer {
  constructor(targetElementId) {
    if (!document.getElementById(targetElementId)) {
      throw new Error('타겟 요소가 존재하지 않습니다.');
    }

    this._el = document.getElementById(targetElementId);
    this._el.innerHTML = `
      <div id='${targetElementId}Player'></div>
      <div class="spinnerWrapper hide">
        <div class="spinner"><div class="innerWrapper"><div class="inner"></div></div></div>
      </div>
      <div class="overlay">
        <div class="musicInfo">
          <div class="title"></div>
          <div class="singer"></div>
        </div>
        <div class="control">
          <div class="captionText noContent"></div>
          <div class="videoProgressBar" id="videoProgressBar">
            <progress class="progressBarPreview" max="100" value="0"></progress>
            <progress 
              class="progressBar" 
              max="100" value="0"></progress>
          </div>
          <div class="buttonArea">
            <div class="left">
              <button class="ribbonButton btnPlaypause paused">
                <img src="./img/play.png" class="iconBtn paused" />
                <img src="./img/pause.png" class="iconBtn playing" />
                <div class="ribbon paused">재생</div>
                <div class="ribbon playing">일시정지</div>
              </button>
              <div class="musicTime">
                <span class="currTime">0:00</span><div class="line"></div>
                <span class="wholeTime">0:00</span>
              </div>
            </div>
            <div class="right">
              <button class="ribbonButton toggle btnLyrics on">
                <img src="./img/lyric.png" class="iconBtn" />
                <div class="ribbon">가사</div>
              </button>
              <button class="ribbonButton btnFullscreen">
                <img src="./img/fullscreen.png" class="iconBtn" />
                <div class="ribbon">전체화면</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.player = jwplayer(`${targetElementId}Player`);
    this.eventHandlers = {
      time: [],
      mute: [],
      volume: [],
      noVideo: [],
      play: [],
      pause: [],
      endVideo: [],
      buffering: [],
      bufferEnd: [],
    };

    this._target = null;
    this.targetMusicId = '';
    this.targetUrl = '';
    this.targetStart = 0;
    this.targetEnd = 0;
    this.targetLength = 0;

    this._isPlaying = false;
    this._isBuffering = false;
    this._volume = 50;

    this._title = '';
    this._singer = '';

    this._time = 0;
    this.timeOffset = 0;

    this._showLyrics = true;

    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.performEvent = this.performEvent.bind(this);
    this.loopTime = this.loopTime.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);

    this.progressBar = this._el.$query('.progressBar');
    this.progressBarPreview = this._el.$query('.progressBarPreview');
    this.onMouseEnterProgressHandler = this.onMouseEnterProgressHandler.bind(this);
    this.onMouseMoveProgressHandler = this.onMouseMoveProgressHandler.bind(this);
    this.onMouseOutProgressHandler = this.onMouseOutProgressHandler.bind(this);
    this.onClickProgressHandler = this.onClickProgressHandler.bind(this);
    this._el.$query('.progressBar').addEventListener('mouseenter', this.onMouseEnterProgressHandler);
    this._el.$query('.progressBar').addEventListener('mousemove', this.onMouseMoveProgressHandler);
    this._el.$query('.progressBar').addEventListener('mouseout', this.onMouseOutProgressHandler);
    this._el.$query('.progressBar').addEventListener('click', this.onClickProgressHandler);

    this._captionText = this._el.$query('.captionText');
    this._el.$query('.btnLyrics').addEventListener('click', e => {
      this.showLyrics = !this.showLyrics;
    });

    this._lifeHovering = 0;
    this._el.addEventListener('mousemove', e => {
      this._lifeHovering = 200;
    });
    this.loopLifeHovering = this.loopLifeHovering.bind(this);
    window.requestAnimationFrame(this.loopLifeHovering);

    this._el.$query('.overlay').addEventListener('click', e => {
      if (e.target.className === e.currentTarget.className) {
        if (this.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
      }
    });
    
    this._el.$query('.btnFullscreen').addEventListener('click', this.toggleFullscreen);

    this.keyboardShortcutHandler = this.keyboardShortcutHandler.bind(this);
    this._el.addEventListener('keydown', this.keyboardShortcutHandler);

    this.currTime = this._el.$query('.currTime');
    this.wholeTime = this._el.$query('.wholeTime');

    this.btnPlaypause = this._el.$query('.btnPlaypause');
    this.btnPlaypause.addEventListener('click', e => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    })

    window.requestAnimationFrame(this.loopTime);

    this.onHotkeyHandler = this.onHotkeyHandler.bind(this);
    document.addEventListener('keydown', this.onHotkeyHandler);
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

  set target(musicItem) {

    const { musicId, suburl, startTime, endTime } = musicItem;

    const oldTargetUrl = this.targetUrl;

    this._target = musicItem;
    this.targetMusicId = musicId;
    this.targetUrl = suburl;
    this.targetStart = startTime;
    this.targetEnd = endTime;
    this.targetLength = endTime - startTime;

    this.title = this._target.title;
    this.singer = this._target.singer;

    this.isBuffering = true;

    if (oldTargetUrl != this.targetUrl) {
      this.player.setup({
        file: `https://media.dema.mil.kr/mediavod/_definst_/smil:dematv/${this.targetUrl}/playlist.m3u8`,
        playbackRateControls: [0.25, 0.5, 0.75, 1, 1.25 , 1.5, 2],
        autostart : true,
        menu: false,
        height: '100%',
        width: '100%',
      });
    }

    Object.keys(this.playerHandlers).forEach(eventName => 
      this.player.on(eventName, this.playerHandlers[eventName])
    );

    this.progressBar.setAttribute('max', this.targetLength);
    this.progressBar.value = 0;

    this.currTime.innerText = formatTime(0);
    this.wholeTime.innerText = formatTime(this.targetLength);

    this.time = 0;
    this.play();
  }

  get target() {
    return ({
      musicId: this.targetMusicId, 
      url: this.targetUrl, 
      start: this.targetStart, 
      end: this.targetEnd,
    });
  }

  playerHandlers = {
    volume: e => {
      this._volume = parseInt(e.volume);
      this.performEvent('volume', e);
    },
    error: e => {
      if (e['message'].indexOf('404 Not Found') > -1) {
        this.performEvent('noVideo', e);
      }
    },
    play: e => {
      this._isPlaying = true;
      this.performEvent('play', e);
      this.btnPlaypause.addClass('playing');
      this.btnPlaypause.removeClass('paused');
    },
    pause: e => {
      this._isPlaying = false;
      this.performEvent('pause', e);
      this.btnPlaypause.addClass('paused');
      this.btnPlaypause.removeClass('playing');
    },
    time: e => {
      const now = parseFloat(e.position) - this.targetStart;

      this.timeOffset = parseInt(Date.now() - now * 1000);
      this.isBuffering = false;

      // 다음 곡 처리
      if(this._isPlaying && e.position > this.targetEnd) { // 곡이 끝나면
        this.performEvent('endVideo', { ...e, currTime: Date.now() });
      }

    },
    buffer: e => {
      this.isBuffering = true;
      this.performEvent('buffering', e);
    },
    bufferFull: e => {
      this.isBuffering = false;
      this.performEvent('bufferEnd', e);
    },
  }

  set time(value) {
    const clamped = Math.min(Math.max(value, 0), this.targetLength)
    this.player.seek(this.targetStart + clamped);
  }
  get time() {
    return this._time / 1000;
  }

  loopTime() {
    if (this.isPlaying && !this.isBuffering) {
      const currTime = Date.now();
      const offsetTime = currTime - this.timeOffset;
      const videoTime = parseInt((this.player.getCurrentTime() - this.targetStart) * 1000);
      if (Math.abs(offsetTime - videoTime) < 500) {
        this._time = offsetTime;
      } else {
        this._time = videoTime;
      }

      this.performEvent('time', {
        time: this.time,
        length: this.targetEnd - this.targetStart,
        currTime,
      });

      this.progressBar.value = this._time / 1000;
      this.currTime.innerText = formatTime(this._time / 1000);
    }
    window.requestAnimationFrame(this.loopTime);
  }

  set isPlaying(value) {
    if(value) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }
  get isPlaying() {
    return this._isPlaying;
  }

  set isBuffering(val) {
    if (val) {
      this._el.$query('.spinnerWrapper').removeClass('hide');
    } else {
      this._el.$query('.spinnerWrapper').addClass('hide');
    }
    this._isBuffering = val;
  }

  get isBuffering() {
    return this._isBuffering;
  }

  set showLyrics(value) {
    this._showLyrics = value;
    if (this._showLyrics) {
      this._captionText.removeClass('hide');
      this._el.$query('.btnLyrics').addClass('on');
    } else {
      this._captionText.addClass('hide');
      this._el.$query('.btnLyrics').removeClass('on');
    }
  }
  get showLyrics() {
    return this._showLyrics;
  }

  loopLifeHovering() {
    if (this._lifeHovering > 0) {
      this._lifeHovering--;
      if (!this._el.hasClass('hover')) {
        this._el.addClass('hover');
      }
    } else {
      if (this._el.hasClass('hover')) {
        this._el.removeClass('hover');
      }
    }

    window.requestAnimationFrame(this.loopLifeHovering);
  }

  keyboardShortcutHandler(e) {
    console.log('keydown')
    console.log(e)
  }

  onMouseEnterProgressHandler(e) {
    this.progressBarPreview.style.opacity = 1;
    this.progressBarPreview.max = this.progressBar.max;
  }
  onMouseMoveProgressHandler(e) {
    const targetTime = e.offsetX / e.currentTarget.clientWidth * e.currentTarget.max;
    this.progressBarPreview.value = targetTime;
  }
  onMouseOutProgressHandler(e) {
    this.progressBarPreview.style.opacity = 0;
  }
  onClickProgressHandler(e) {
    const targetTime = e.offsetX / e.currentTarget.clientWidth * e.currentTarget.max;
    videoPlayer.time = targetTime;
  }

  onHotkeyHandler(e) {
    if (document.activeElement == document.body) {
      switch(e.key) {
        case 'f':
          this.toggleFullscreen();
          break;
        case ' ':
          if (this.isPlaying) {
            this.pause();
            this._lifeHovering = 100;
          } else {
            this.play();
          }
          break;
          case 'ArrowLeft':
            this.time -= 5;
            break;
          case 'ArrowRight':
            this.time += 5;
            break;
      }
    }
  }

  set volume(value) {
    // clamping
    const targetValue = Math.min(Math.max(parseInt(value), 0), 100);

    this.player.setVolume(targetValue);
  }
  get volume() {
    return this._volume;
  }

  set title(value) {
    this._title = value;
    this._el.$query('.overlay .musicInfo .title').innerText = this._title;
  }
  get title() {
    return this._title;
  }

  set singer(value) {
    this._singer = value;
    this._el.$query('.overlay .musicInfo .singer').innerText = this._singer;
  }
  get singer() {
    return this._singer;
  }

  play() {
    this.player.play();
  }
  pause() {
    this.player.pause();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this._el.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

