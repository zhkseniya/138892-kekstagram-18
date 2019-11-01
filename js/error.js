'use strict';

window.error = (function () {
  var MESSAGE_CLASS = 'error__inner';
  var main = document.querySelector('main');

  var similarErrorTemplate = document.querySelector('#error')
  .content.cloneNode(true);
  var errorButtons = similarErrorTemplate.querySelector('.error__buttons');
  var errorTitle = similarErrorTemplate.querySelector('.error__title');

  var onMessageButtonClick = function () {
    closeMessageBlock();
  };

  var onDocumentClick = function (evt) {
    if (evt.target.tagName !== MESSAGE_CLASS) {
      closeMessageBlock();
    }
  };

  var onDocumentEscPress = function (evt) {
    window.utils.isEscEvent(evt, closeMessageBlock);
  };

  var closeMessageBlock = function () {
    var error = main.querySelector('.error');
    main.removeChild(error);
    main.removeEventListener('click', onMessageButtonClick);
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentEscPress);
  };

  return {
    showErrorMessage: function (errorMessage) {
      main.appendChild(similarErrorTemplate);
      errorTitle.textContent = errorMessage;
      errorButtons.forEach(function (button) {
        button.addEventListener('click', onMessageButtonClick);
      });
      document.addEventListener('keydown', onDocumentEscPress);
      document.addEventListener('click', onDocumentClick);
    }
  };
})();
