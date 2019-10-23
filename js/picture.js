'use strict';

(function () {
  window.photos = [];

  var similarListElement = document.querySelector('.pictures');

  var similarPhotoTemplate = document.querySelector('#picture')
  .content;

  var getPhotosElement = function (array) {
    var photoElement = similarPhotoTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').src = array.url;
    photoElement.querySelector('.picture__likes').textContent = array.likes;
    photoElement.querySelector('.picture__comments').textContent = array.comments.length;
    photoElement.querySelector('.picture').setAttribute('tabindex', '0');

    return photoElement;
  };

  var successHandler = function (arrayPhotos) {
    window.photos = arrayPhotos;

    var fragment = document.createDocumentFragment();

    window.photos.forEach(function (photo) {
      fragment.appendChild(getPhotosElement(photo));
    });

    similarListElement.appendChild(fragment);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.load(successHandler, errorHandler);
})();
