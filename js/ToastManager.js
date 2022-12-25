class ToastManager {
  /**
   * @param {HTMLElement} element 
   */
  constructor(targetElement) {
    if (!targetElement || !targetElement instanceof HTMLElement) {
      throw new Error('올바르지 않은 요소입니다.');
    }
    /** @type {HTMLElement} */
    this._el = targetElement;

    /** @type {ToastItem[]} */
    this._list = [];

    this.create = this.create.bind(this);
    this.push = this.push.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getElement = this.getElement.bind(this);
    this.remove = this.remove.bind(this);
    this.performRemoveAnim = this.performRemoveAnim.bind(this);
    this.clear = this.clear.bind(this);
    this.updateRender = this.updateRender.bind(this);
  }

  /**
   * 토스트 알림을 생성합니다.
   */
  create({ text = '', timeout = 3000 }) {
    const newToast = new ToastItem({
      text,
      timeout,
      onTimeout: this.performRemoveAnim,
    });
    this.push(newToast);
  }

  /**
   * 토스트 알림을 등록합니다.
   * @param  {...ToastItem} toasts 
   * @returns {number} 등록된 갯수
   */
  push(...toasts) {
    const pushed = this._list.push(...toasts);
    this.updateRender();
    return pushed;
  }

  /**
   * uuid에 해당하는 토스트 알림을 반환합니다.
   * 
   * @param {string} uuid 
   * @returns {ToastItem|undefined}
   */
  get(uuid) {
    return this._list.find(item => item.uuid === uuid);
  }
  getAll() {
    return this._list;
  }

  /**
   * uuid에 해당하는 요소를 찾아 반환합니다.
   * 
   * @param {string} uuid 
   * @returns {HTMLElement}
   */
  getElement(uuid) {
    return this._el.$query(`.toastItem[data-uuid="${uuid}"]`);
  }

  /**
   * uuid에 해당하는 플레이리스트를 제거합니다.
   * 
   * @param {string} uuid 
   * @returns {ToastItem[]}
   */
  remove(uuid) {
    this._list = this._list.filter(item => item.uuid !== uuid);
    this.updateRender();
    return this._list;
  }

  performRemoveAnim(uuid) {
    const animDuration = 400;

    const target = this.getElement(uuid);

    if (!target) {
      return;
    }

    target.addClass('removing');

    setTimeout(() => {
      this.remove(uuid);
    }, animDuration);
  }

  /**
   * 등록된 모든 토스트 알림을 제거합니다.
   * 
   * @returns {ToastItem[]}
   */
  clear() {
    this._list = [];
    this.updateRender();
    return this._list;
  }

  /**
   * 표시중인 토스트 알림의 갯수를 반환합니다.
   * 
   * @returns {number}
   */
  get length() {
    return this._list.length;
  }

  /**
   * 
   * @param {ToastItem} toastItem 
   * @returns {HTMLElement}
   */
  geneToastItem(toastItem) {
    const contentElement = document.createElement('li');
    contentElement.addClass('toastItem');
    contentElement.dataset.uuid = toastItem.uuid;
    const contentHtml = `<div class="toastItemWrapper"><div class="text">${toastItem.text}</div></div>`;
    contentElement.innerHTML = contentHtml;

    return contentElement;
  }
  updateRender() {

    // 추가
    this.getAll().forEach(toastItem => {
      if (!this.getElement(toastItem.uuid)) {
        this._el.prepend(this.geneToastItem(toastItem));
      }
    });

    // 제거
    this._el.$queryAll('li.toastItem').forEach(item => {
      if (!this.get(item.dataset.uuid)) {
        item.remove();
      }
    });

  }
}

class ToastItem {
  /**
   * @param {{ uuid: string, text: string, timeout: number }} params 
   */
  constructor({ uuid = geneUUID(), text, timeout = 3000, onTimeout }) {
    /** @type {string} */
    this._uuid = uuid;
    /** @type {string} */
    this.text = text;
    /** @type {number[]} */
    this._timeout = Date.now() + timeout;
    /** @type {(uuid: string) => {}} */
    this.onTimeout = onTimeout;


    this.observeTimeout = this.observeTimeout.bind(this);
    this.loopObserveTimeout = setInterval(this.observeTimeout, 50);
  }

  observeTimeout = () => {
    if (Date.now() >= this.timeout) {
      this.onTimeout(this.uuid);
      clearInterval(this.loopObserveTimeout);
    }
  }

  get uuid() {
    return this._uuid;
  }
  get timeout() {
    return this._timeout;
  }
}