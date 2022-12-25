function $id(id) {
  return document.getElementById(id);
}

function $query(query) {
  return document.querySelector(query);
}

function $queryAll(query) {
  return document.querySelectorAll(query);
}

HTMLElement.prototype.$query      = function (query) { return this.querySelector(query) };
HTMLElement.prototype.$queryAll   = function (query) { return this.querySelectorAll(query) };

HTMLElement.prototype.addClass    = function (className) { this.classList.add(className) };
HTMLElement.prototype.removeClass = function (className) { this.classList.remove(className) };
HTMLElement.prototype.hasClass    = function (className) { return this.classList.contains(className) };
