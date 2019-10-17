'use strict';

window.gallery = (function () {
  var LIKES = {
    MIN: 15,
    MAX: 200
  };
  var COMMENTS = {
    MIN: 1,
    MAX: 6
  };

  var getRandomComments = function (count) {
    var comments = [];
    for (var i = 0; i < count; i++) {
      var comment = {
        avatar: window.data.AVATARS[window.utils.getRandomElement(0, (window.data.AVATARS.length - 1))],
        message: window.data.MESSAGES[window.utils.getRandomElement(0, (window.data.MESSAGES.length - 1))],
        name: window.data.NAMES[window.utils.getRandomElement(0, (window.data.NAMES.length - 1))]
      };
      comments.push(comment);
    }
    return comments;
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

  return {
    getDescriptionPhoto: function (count) {
      var descriptions = [];

      for (var i = 1; i <= count; i++) {
        var commentsCount = window.utils.getRandomElement(COMMENTS.MIN, COMMENTS.MAX);

        var description = {
          url: 'photos/' + i + '.jpg',
          description: 'описание- ' + i,
          likes: window.utils.getRandomElement(LIKES.MIN, LIKES.MAX),
          comments: getRandomComments(commentsCount)
        };

        descriptions.push(description);
      }

      return descriptions;
    },
    createPhotoContent: function (data, selectorsList) {
      document.querySelector(selectorsList.picture).src = data.url;
      document.querySelector(selectorsList.likesCount).textContent = data.likes;
      document.querySelector(selectorsList.commentsCount).textContent = data.comments.length;
      var socialComments = document.querySelector(selectorsList.socialComment);
      socialComments.innerHTML = '';

      var comments = data.comments;
      for (var i = 0; i < comments.length; i++) {
        var commentsItem = createComment(comments[i]);
        socialComments.appendChild(commentsItem);
      }

      document.querySelector(selectorsList.socialCaption).textContent = data.description;
    }
  };
})();
