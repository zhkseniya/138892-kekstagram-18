'use strict';

window.success = (function () {
  var MESSAGE_CLASS = 'success__inner';
  var main = document.querySelector('main');

  var similarSuccessTemplate = document.querySelector('#success')
    .content.querySelector('.success');

  var successButton = similarSuccessTemplate.querySelector('.success__button');

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
    var success = main.querySelector('.success');
    main.removeChild(success);
    main.removeEventListener('click', onMessageButtonClick);
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onDocumentEscPress);
  };

  return {
    showSuccesMessage: function () {
      main.appendChild(similarSuccessTemplate);
      successButton.addEventListener('click', onMessageButtonClick);
      document.addEventListener('keydown', onDocumentEscPress);
      document.addEventListener('click', onDocumentClick);
    }
  };
})();
