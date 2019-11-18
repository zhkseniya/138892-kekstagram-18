'use strict';

window.preview = (function () {
  var Comments = {
    MIN: 0,
    MAX: 5
  };
  var RegexUrl = {
    PATHNAME: /^.*[\\\/]/
  };
  var SelectorsList = {
    PICTURE: '.big-picture__img img',
    LIKES_COUNT: '.likes-count',
    COMMENTS_COUNT: '.comments-count',
    SOCIAL_COMMENT: '.social__comments',
    SOCIAL_CAPTION: '.social__caption'
  };

  var bigPicture = document.querySelector('.big-picture');
  var picturesBlock = document.querySelector('.pictures');
  var commentsLoader = document.querySelector('.comments-loader');
  var commentsCount = document.querySelector('.social__comment-count');
  var body = document.querySelector('body');

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

  function showCommentsCount(comments) {
    var displayedComments = bigPicture.querySelectorAll('.social__comment:not(.visually-hidden)').length;
    var commentsCountElement = displayedComments + ' из ' + '<span class="comments-count">' + comments.length + '</span>' + ' комментариев';
    commentsCount.innerHTML = commentsCountElement;
  }


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
    document.querySelector(selectorsList.PICTURE).src = data.url;
    document.querySelector(selectorsList.LIKES_COUNT).textContent = data.likes;
    document.querySelector(selectorsList.COMMENTS_COUNT).textContent = data.comments.length;
    var socialComments = document.querySelector(selectorsList.SOCIAL_COMMENT);
    socialComments.innerHTML = '';

    getComments(data.comments, socialComments);
    showCommentsCount(data.comments);
    document.querySelector(selectorsList.SOCIAL_CAPTION).textContent = data.description;

    window.utils.hiddenElement(commentsLoader, 'visually-hidden');
    if (data.comments.length > Comments.MAX) {
      window.utils.showElement(commentsLoader, 'visually-hidden');
      commentsLoader.addEventListener('click', function () {
        showCommentsCount(data.comments);
      });
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
    createPhotoContent(photoData[0], SelectorsList);
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
