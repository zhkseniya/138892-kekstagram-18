'use strict';

(function () {
  window.photos = [];

  var FILTERS_CLASS = {
    REMOVE: 'img-filters--inactive',
    ACTIVE_BUTTON: 'img-filters__button--active'
  };

  var FILTER_OPTIONS = {
    'filter-popular': 'renderPhotos',
    'filter-random': 'getRandomPhotos',
    'filter-discussed': 'getDiscussedPhotos'
  };

  var similarListElement = document.querySelector('.pictures');

  // фильтры
  var filtersBlock = document.querySelector('.img-filters');
  var filtersButton = document.querySelectorAll('.img-filters__button');

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

  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();

    photos.forEach(function (photo) {
      fragment.appendChild(getPhotosElement(photo));
    });

    similarListElement.appendChild(fragment);
  };

  // действия с фильтрами
  var changeActiveButton = function (activeButton) {
    var oldActiveButton = filtersBlock.querySelector('.' + FILTERS_CLASS.ACTIVE_BUTTON);
    oldActiveButton.classList.remove(FILTERS_CLASS.ACTIVE_BUTTON);
    activeButton.classList.toggle(FILTERS_CLASS.ACTIVE_BUTTON);
  };

  var onFiltersButtonClick = function (evt) {
    var target = evt.target;
    changeActiveButton(target);
  };


  filtersButton.forEach(function (button) {
    button.addEventListener('click', onFiltersButtonClick);
  });

  // загрузка фотографий
  var successHandler = function (arrayPhotos) {
    window.photos = arrayPhotos;
    window.utils.showElement(filtersBlock, FILTERS_CLASS.REMOVE);
    renderPhotos(window.photos);
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

  window.backend.load(successHandler, errorHandler);
})();
