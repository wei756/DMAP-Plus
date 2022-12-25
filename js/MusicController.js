class MusicController {
  constructor(context) {
    if (!context.videoPlayer) {
      throw new Error('뮤비 플레이어가 지정되지 않았습니다.');
    }
    if (!context.queueManager) {
      throw new Error('큐 매니저가 지정되지 않았습니다.');
    }

    this.videoPlayer = context.videoPlayer;
    this.queueManager = context.queueManager;
    this.eventHandlers = {
      changeMusic: [],
    };

    this.musicId = '';

    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.performEvent = this.performEvent.bind(this);

    window.requestAnimationFrame(this.loopTime);
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

  play() {
    this.player.play();
  }
  pause() {
    this.player.pause();
  }
}

