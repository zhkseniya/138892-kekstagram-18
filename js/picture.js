'use strict';

window.picture = (function () {

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

  var renderPhotos = function (arrayPhotos) {
    var fragment = document.createDocumentFragment();

    arrayPhotos.forEach(function (photo) {
      fragment.appendChild(getPhotosElement(photo));
    });

    similarListElement.appendChild(fragment);
  };

  var photos = window.gallery.getDescriptionPhoto(window.data.PHOTOS_COUNT);
  renderPhotos(photos);

  return photos;
})();
