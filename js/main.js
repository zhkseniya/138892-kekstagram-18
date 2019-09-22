'use strict';

var NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var AVATARS = ['img/avatar-1.svg', 'img/avatar-2.svg', 'img/avatar-3.svg', 'img/avatar-4.svg', 'img/avatar-5.svg', 'img/avatar-6.svg'];
var MESSAGES = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var PHOTOS_COUNT = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS_MIN = 1;
var COMMENTS_MAX = 6;

var similarListElement = document.querySelector('.pictures');

var getRandomElement = function (min, max) {
  var element = min + Math.random() * (max + 1 - min);
  return Math.floor(element);
};

var getRandomComments = function (count) {
  var array = [];

  for (var i = 0; i < count; i++) {
    var comment = {
      avatar: AVATARS[getRandomElement(0, (AVATARS.length - 1))],
      message: MESSAGES[getRandomElement(0, (MESSAGES.length - 1))],
      name: NAMES[getRandomElement(0, (NAMES.length - 1))]
    };

    array.push(comment);
  }

  return array;
};

var getDescriptionPhoto = function (count) {
  var array = [];

  for (var i = 1; i <= count; i++) {
    var commentCount = getRandomElement(COMMENTS_MIN, COMMENTS_MAX);

    var description = {
      url: 'photos/' + i + '.jpg',
      description: 'описание- ' + i,
      likes: getRandomElement(LIKES_MIN, LIKES_MAX),
      comments: getRandomComments(commentCount)
    };

    array.push(description);
  }

  return array;
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

var photos = getDescriptionPhoto(PHOTOS_COUNT);
renderPhotos(photos);
