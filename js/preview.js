'use strict';

window.preview = (function () {
  var Comments = {
    MIN: 0,
    MAX: 5
  };
  var RegexUrl = {
    PATHNAME: /^.*[\\\/]/
  };
  var bigPicture = document.querySelector('.big-picture');
  var picturesBlock = document.querySelector('.pictures');
  var commentsLoader = document.querySelector('.comments-loader');
  var body = document.querySelector('body');

  var selectorList = {
    picture: '.big-picture__img img',
    likesCount: '.likes-count',
    commentsCount: '.comments-count',
    socialComment: '.social__comments',
    socialCaption: '.social__caption'
  };

  var createComment = function (comment) {
    var listItem = window.utils.makeElement('li', 'social__comment');

    var avatar = window.utils.makeElement('img', 'social__picture');
    avatar.src = comment.avatar;
    avatar.alt = comment.name;
    listItem.appendChild(avatar);

    var text = window.utils.makeElement('p', 'social__text', comment.message);
    listItem.appendChild(text);

    return listItem;
  };

  var getComments = function (arrayComments, commentsBlock) {

    arrayComments.forEach(function (comment, index) {
      var commentsItem = createComment(comment);
      commentsBlock.appendChild(commentsItem);
      if (index >= Comments.MAX) {
        window.utils.hiddenElement(commentsItem, 'visually-hidden');
      }
    });
  };

  var onLoadCommentsClick = function (evt) {
    var commentHiddenElements = evt.target.offsetParent.querySelectorAll('.social__comment.visually-hidden');
    var arrayHiddenElements = [].slice.call(commentHiddenElements, Comments.MIN, Comments.MAX);
    arrayHiddenElements.forEach(function (comment) {
      window.utils.showElement(comment, 'visually-hidden');
    });
    if (commentHiddenElements.length <= Comments.MAX) {
      window.utils.hiddenElement(evt.target, 'visually-hidden');
    }
  };

  var createPhotoContent = function (data, selectorsList) {
    document.querySelector(selectorsList.picture).src = data.url;
    document.querySelector(selectorsList.likesCount).textContent = data.likes;
    document.querySelector(selectorsList.commentsCount).textContent = data.comments.length;
    var socialComments = document.querySelector(selectorsList.socialComment);
    socialComments.innerHTML = '';

    getComments(data.comments, socialComments);
    document.querySelector(selectorsList.socialCaption).textContent = data.description;

    window.utils.hiddenElement(commentsLoader, 'visually-hidden');
    if (data.comments.length > Comments.MAX) {
      window.utils.showElement(commentsLoader, 'visually-hidden');
    }
  };

  commentsLoader.addEventListener('click', onLoadCommentsClick);

  //  открытие окна полноразмерного просмотра
  var onPictureEnterPress = function (evt) {
    if (window.utils.isEnterEvent(evt)) {
      openBigPicture(evt.target.querySelector('.picture__img'));
    }
  };

  var openBigPicture = function (element) {
    var photoSrc = new URL(element.src);
    var photoData = window.photos.filter(function (item) {
      return item.url.replace(RegexUrl.PATHNAME, '') === photoSrc.pathname.replace(RegexUrl.PATHNAME, '');
    });
    window.utils.showElement(bigPicture, 'hidden');
    createPhotoContent(photoData[0], selectorList);
    body.classList.add('modal-open');
    document.addEventListener('keydown', onBigPictrueCancelPress);
  };

  var onPicturesBlockClick = function (element) {
    openBigPicture(element);
  };

  picturesBlock.addEventListener('click', function (evt) {
    if (evt.target.className === 'picture__img') {
      evt.preventDefault();
      onPicturesBlockClick(evt.target);
    }
  });
  picturesBlock.addEventListener('keydown', function (evt) {
    if (evt.target.className === 'picture') {
      onPictureEnterPress(evt);
    }
  });

  //  закрытие окна полноразмерного просмотра
  var bigPictureCancel = document.querySelector('.big-picture__cancel');

  var onBigPictrueCancelPress = function (evt) {
    window.utils.isEscEvent(evt, closeBigPicture);
  };

  var closeBigPicture = function () {
    window.utils.hiddenElement(bigPicture, 'hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onBigPictrueCancelPress);
  };

  bigPictureCancel.addEventListener('click', function () {
    closeBigPicture();
  });
})();
