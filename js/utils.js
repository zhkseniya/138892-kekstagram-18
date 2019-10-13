'use strict';

window.utils = (function () {
  var KEYCODE = {
    ESC: 27,
    ENTER: 13
  };

  return {
    showElement: function (element, className) {
      element.classList.remove(className);
    },
    hiddenElement: function (element, className) {
      element.classList.add(className);
    },
    getRandomElement: function (min, max) {
      var element = min + Math.random() * (max + 1 - min);
      return Math.floor(element);
    },
    makeElement: function (tagName, className, text) {
      var element = document.createElement(tagName);
      element.classList.add(className);
      if (text) {
        element.textContent = text;
      }
      return element;
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === KEYCODE.ESC) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === KEYCODE.ENTER) {
        action();
      }
    }
  };
})();
