'use strict';

window.preview = (function () {
  var REGEXURL = {
    PATHNAME: /^\//
  };
  var bigPicture = document.querySelector('.big-picture');
  var commentCount = document.querySelector('.social__comment-count');
  var picturesLink = document.querySelectorAll('.picture');
  var commentsLoader = document.querySelector('.comments-loader');

  var selectorList = {
    picture: '.big-picture__img img',
    likesCount: '.likes-count',
    commentsCount: '.comments-count',
    socialComment: '.social__comments',
    socialCaption: '.social__caption'
  };

  var photos = window.picture;

  //  открытие окна полноразмерного просмотра
  var onPictureEnterPress = function (evt) {
    if (window.utils.isEnterEvent(evt)) {
      openBigPicture(evt.target.querySelector('.picture__img'));
    }
  };

  var openBigPicture = function (element) {
    var photoSrc = new URL(element.src);
    var photoData = photos.filter(function (item) {
      return item.url === photoSrc.pathname.replace(REGEXURL.PATHNAME, '');
    });
    window.utils.showElement(bigPicture, 'hidden');
    window.gallery.createPhotoContent(photoData[0], selectorList);
    window.utils.hiddenElement(commentCount, 'visually-hidden');
    window.utils.hiddenElement(commentsLoader, 'visually-hidden');
    document.addEventListener('keydown', onBigPictrueCancelPress);
  };

  var onPictureClick = function (evt) {
    evt.preventDefault();
    openBigPicture(evt.target);
  };

  picturesLink.forEach(function (photo) {
    photo.addEventListener('click', onPictureClick);
    photo.addEventListener('keydown', onPictureEnterPress);
  });

  //  закрытие окна полноразмерного просмотра
  var bigPictureCancel = document.querySelector('.big-picture__cancel');

  var onBigPictrueCancelPress = function (evt) {
    window.utils.isEscEvent(evt, closeBigPicture);
  };

  var closeBigPicture = function () {
    window.utils.hiddenElement(bigPicture, 'hidden');
    document.removeEventListener('keydown', onBigPictrueCancelPress);
  };

  bigPictureCancel.addEventListener('click', function () {
    closeBigPicture();
  });
})();
