'use strict';

window.message = (function () {
  var MESSAGE_CLASS = 'success__inner';
  var main = document.querySelector('main');
  // var MESSAGE_CLASS = {
  //   OK: 'success__inner',
  //   ERROR: 'error__inner'
  // };
  // успешная загрузка
  var similarSuccessTemplate = document.querySelector('#success')
  .content;
  var successButton = similarSuccessTemplate.querySelector('.success__button');

  // ошибка при отправке
  // var similarErrorTemplate = document.querySelector('#error')
  // .content;
  // var errorButton = similarErrorTemplate.querySelector('.error__button');
  // var errorTitle = similarErrorTemplate.querySelector('.error__title');

  var onMessageButtonClick = function () {
    closeMessageBlock();
  };

  var onDocumentClick = function (evt) {
    if (evt.target.tagName !== MESSAGE_CLASS) {
      onDocumentClick();
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

  // var createListeners = function (button, messageClass, messageBlock) {
  //   button.addEventListener('click', function () {
  //     onMessageButtonClick(messageBlock);
  //   });
  //   document.addEventListener('keydown', function (evt) {
  //     onDocumentEscPress(evt, messageBlock);
  //   });
  //   document.addEventListener('click', function (evt) {
  //     if (evt.target.tagName !== messageClass) {
  //       onDocumentClick(messageBlock);
  //     }
  //   });
  // };

  return {
    showSuccesMessage: function () {
      main.appendChild(similarSuccessTemplate);
      // createListeners(successButton, MESSAGE_CLASS.OK, success);
      successButton.addEventListener('click', onMessageButtonClick);
      document.addEventListener('keydown', onDocumentEscPress);
      document.addEventListener('click', onDocumentClick);
    // },
    // showErrorMessage: function (errorMessage) {
    //   main.appendChild(similarErrorTemplate);
    //   errorTitle.textContent = errorMessage;
    //   var error = main.querySelector('.error');
    //   createListeners(errorButton, MESSAGE_CLASS.ERROR, error);
    }
  };
})();
