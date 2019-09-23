'use strict';

var NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var AVATARS = ['img/avatar-1.svg', 'img/avatar-2.svg', 'img/avatar-3.svg', 'img/avatar-4.svg', 'img/avatar-5.svg', 'img/avatar-6.svg'];
var MESSAGES = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var PHOTOS_COUNT = 25;
var LIKES = {
  MIN: 15,
  MAX: 200
};
var COMMENTS = {
  MIN: 1,
  MAX: 6
};

var similarListElement = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var commentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');

var showElement = function (element, className) {
  element.classList.remove(className);
};

var hiddenElement = function (element, className) {
  element.classList.add(className);
};

var removeChildren = function (element) {
  var children = element.children;

  for (var i = children.length - 1; i >= 0; i--) {
    var child = children[i];
    child.parentElement.removeChild(child);
  }

};

var getRandomElement = function (min, max) {
  var element = min + Math.random() * (max + 1 - min);
  return Math.floor(element);
};

var getRandomComments = function (count) {
  var comments = [];

  for (var i = 0; i < count; i++) {
    var comment = {
      avatar: AVATARS[getRandomElement(0, (AVATARS.length - 1))],
      message: MESSAGES[getRandomElement(0, (MESSAGES.length - 1))],
      name: NAMES[getRandomElement(0, (NAMES.length - 1))]
    };

    comments.push(comment);
  }

  return comments;
};

var getDescriptionPhoto = function (count) {
  var descriptions = [];

  for (var i = 1; i <= count; i++) {
    var commentsCount = getRandomElement(COMMENTS.MIN, COMMENTS.MAX);

    var description = {
      url: 'photos/' + i + '.jpg',
      description: 'описание- ' + i,
      likes: getRandomElement(LIKES.MIN, LIKES.MAX),
      comments: getRandomComments(commentsCount)
    };

    descriptions.push(description);
  }

  return descriptions;
};

var similarPhotoTemplate = document.querySelector('#picture')
  .content;

var getPhotosElement = function (array) {
  var photoElement = similarPhotoTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = array.url;
  photoElement.querySelector('.picture__likes').textContent = array.likes;
  photoElement.querySelector('.picture__comments').textContent = array.comments.length;

  return photoElement;
};

var renderPhotos = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(getPhotosElement(array[i]));
  }

  similarListElement.appendChild(fragment);
};

var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

var createComment = function (comment) {
  var listItem = makeElement('li', 'social__comment');

  var avatar = makeElement('img', 'social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  listItem.appendChild(avatar);

  var text = makeElement('p', 'social__text', comment.message);
  listItem.appendChild(text);

  return listItem;
};

var createPhotoContent = function (data) {
  document.querySelector('.big-picture__img img').src = data.url;
  document.querySelector('.likes-count').textContent = data.likes;
  document.querySelector('.comments-count').textContent = data.comments.length;
  var socialComments = document.querySelector('.social__comments');
  removeChildren(socialComments);

  var comments = data.comments;
  for (var i = 0; i < comments.length; i++) {
    var commentsItem = createComment(comments[i]);
    socialComments.appendChild(commentsItem);
  }

  document.querySelector('.social__caption').textContent = data.description;
};

var photos = getDescriptionPhoto(PHOTOS_COUNT);
renderPhotos(photos);
showElement(bigPicture, 'hidden');
createPhotoContent(photos[0]);
hiddenElement(commentCount, 'visually-hidden');
hiddenElement(commentsLoader, 'visually-hidden');
