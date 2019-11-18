'use strict';

(function () {
  var RANDOM_NUMBER = 0.5;

  var FiltersClass = {
    REMOVE: 'img-filters--inactive',
    ACTIVE_BUTTON: 'img-filters__button--active'
  };
  var CountPhotos = {
    MIN: 0,
    MAX: 10
  };

  var similarListElement = document.querySelector('.pictures');

  // фильтры
  var filtersBlock = document.querySelector('.img-filters');
  var filterButtons = document.querySelectorAll('.img-filters__button');

  var similarPhotoTemplate = document.querySelector('#picture')
  .content;

  window.photos = [];

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
    var oldActiveButton = filtersBlock.querySelector('.' + FiltersClass.ACTIVE_BUTTON);
    oldActiveButton.classList.remove(FiltersClass.ACTIVE_BUTTON);
    activeButton.classList.toggle(FiltersClass.ACTIVE_BUTTON);
  };

  var onFilterButtonClick = function (button) {
    changeActiveButton(button);
  };

  var clearPictureBlock = function () {
    var pictureElements = similarListElement.querySelectorAll('.picture');
    pictureElements.forEach(function (element) {
      similarListElement.removeChild(element);
    });
  };

  // 10 случайных, не повторяющихся фотографий
  var getRandomsPhotos = function (arrayPhotos) {
    return arrayPhotos.sort(function () {
      return RANDOM_NUMBER - Math.random();
    }).slice(CountPhotos.MIN, CountPhotos.MAX);
  };

  // Обсуждаемые — фотографии, отсортированные в порядке убывания количества комментариев
  var getDiscussedPhotos = function (arrayPhotos) {
    var sortPhotos = arrayPhotos.sort(function (lastPhoto, nextPhoto) {
      return nextPhoto.comments.length - lastPhoto.comments.length;
    });

    return sortPhotos;
  };

  var changeFilters = function (button) {
    clearPictureBlock();
    var copyWindowPhotos = window.photos.slice();
    switch (button.id) {
      case 'filter-popular' :
        renderPhotos(copyWindowPhotos);
        break;
      case 'filter-random' :
        var randomArray = getRandomsPhotos(copyWindowPhotos);
        renderPhotos(randomArray);
        break;
      case 'filter-discussed' :
        renderPhotos(getDiscussedPhotos(copyWindowPhotos));
        break;
      default:
        renderPhotos(copyWindowPhotos);
    }

  };

  var debounceFilters = window.debounce(changeFilters);
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function (evt) {
      var target = evt.target;
      onFilterButtonClick(target);
      debounceFilters(target);
    });
  });

  // загрузка фотографий
  var successHandler = function (arrayPhotos) {
    window.photos = arrayPhotos;
    window.utils.showElement(filtersBlock, FiltersClass.REMOVE);
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
