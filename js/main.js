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
var KEYCODE = {
  ESC: 27,
  ENTER: 13
};
var SCALE = {
  MIN: 25,
  MAX: 100,
  STEP: 25
};
var HASHTAGSCOUNT = 5;
var EFFECTSPARAMETERS = {
  chrome: {
    CLASS: 'effects__preview--chrome',
    EFFECT: 'grayscale',
    MIN: 0,
    MAX: 1,
    UNIT: ''
  },
  sepia: {
    CLASS: 'effects__preview--sepia',
    EFFECT: 'sepia',
    MIN: 0,
    MAX: 1,
    UNIT: ''
  },
  marvin: {
    CLASS: 'effects__preview--marvin',
    EFFECT: 'invert',
    MIN: 0,
    MAX: 100,
    UNIT: '%'
  },
  phobos: {
    CLASS: 'effects__preview--phobos',
    EFFECT: 'blur',
    MIN: 0,
    MAX: 3,
    UNIT: 'px'
  },
  heat: {
    CLASS: 'effects__preview--heat',
    EFFECT: 'brightness',
    MIN: 1,
    MAX: 3,
    UNIT: ''
  }
};

var similarListElement = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var commentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');
var hashtags = document.querySelector('.text__hashtags');

var showElement = function (element, className) {
  element.classList.remove(className);
};

var hiddenElement = function (element, className) {
  element.classList.add(className);
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
  socialComments.innerHTML = '';

  var comments = data.comments;
  for (var i = 0; i < comments.length; i++) {
    var commentsItem = createComment(comments[i]);
    socialComments.appendChild(commentsItem);
  }

  document.querySelector('.social__caption').textContent = data.description;
};

//  просмотр любой фотографии в полноразмерном режиме;
var photos = getDescriptionPhoto(PHOTOS_COUNT);
renderPhotos(photos);
var picturesLink = document.querySelectorAll('.picture');

//  открытие окна полноразмерного просмотра
var onPictureEnterPress = function (evt) {
  if (evt.keyCode === KEYCODE.ENTER) {
    openBigPicture(evt.target.querySelector('.picture__img'));
  }
};

var openBigPicture = function (element) {
  var photoSrc = new URL(element.src);
  var photoData = photos.filter(function (item) {
    return item.url === photoSrc.pathname.replace(/^\//, '');
  });
  showElement(bigPicture, 'hidden');
  createPhotoContent(photoData[0]);
  hiddenElement(commentCount, 'visually-hidden');
  hiddenElement(commentsLoader, 'visually-hidden');
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
  if (evt.keyCode === KEYCODE.ESC) {
    closeBigPicture();
  }
};

var closeBigPicture = function () {
  hiddenElement(bigPicture, 'hidden');
  document.removeEventListener('keydown', onBigPictrueCancelPress);
};

bigPictureCancel.addEventListener('click', function () {
  closeBigPicture();
});

// Выбор изображения для загрузки
var uploadFile = document.querySelector('#upload-file');
var uploadCancel = document.querySelector('#upload-cancel');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadPreview = document.querySelector('.img-upload__preview img');
var imgEffectsPreview = document.querySelectorAll('.effects__preview');

var onUploadEscPress = function (evt) {
  if (evt.keyCode === KEYCODE.ESC) {
    closeUpload();
  }
};

var openUpload = function () {
  showElement(imgUploadOverlay, 'hidden');
  document.addEventListener('keydown', onUploadEscPress);
};

var closeUpload = function () {
  hiddenElement(imgUploadOverlay, 'hidden');
  document.removeEventListener('keydown', onUploadEscPress);
};

uploadCancel.addEventListener('click', function () {
  closeUpload();
});

var setPreviewImage = function (imgUpdate, imgFile, backgroundImg) {
  var reader = new FileReader();
  reader.onloadend = function () {
    if (backgroundImg) {
      imgUpdate.style.backgroundImage = 'url("' + reader.result + '")';
    } else {
      imgUpdate.src = reader.result;
    }
  };
  if (imgFile.type.startsWith('image/')) {
    reader.readAsDataURL(imgFile);
  }
};

var onUploadFileChange = function () {
  setPreviewImage(imgUploadPreview, uploadFile.files[0], false);

  imgEffectsPreview.forEach(function (previewImg) {
    setPreviewImage(previewImg, uploadFile.files[0], true);
  });

  openUpload();
};

uploadFile.addEventListener('change', onUploadFileChange);

// 2.1. Масштаб:
var scaleControl = document.querySelectorAll('button.scale__control');
var scaleControlValue = document.querySelector('.scale__control--value');

var onScaleControlClick = function (evt) {
  evt.preventDefault();
  var value = parseInt(scaleControlValue.value, 10);
  if (evt.target.className.includes('smaller')) {
    if (value > SCALE.MIN) {
      value -= SCALE.STEP;
    }
  } else {
    if (value < SCALE.MAX) {
      value += SCALE.STEP;
    }
  }
  scaleControlValue.value = value + '%';
  imgUploadPreview.style.transform = 'scale(' + value / 100 + ')';
};

scaleControl.forEach(function (control) {
  control.addEventListener('click', onScaleControlClick);
});

// 2.2. Наложение эффекта на изображение:
var effectLevel = document.querySelector('.effect-level');
var effectPin = document.querySelector('.effect-level__pin');
var effectDepth = document.querySelector('.effect-level__depth');
var effectLine = document.querySelector('.effect-level__line');
var effectValue = document.querySelector('input[name="effect-level"]');
var effectsItem = document.querySelector('.effects__list');

var getCoordsElement = function (elem) {
  var boxCoords = elem.getBoundingClientRect();
  return {
    width: boxCoords.width,
    left: boxCoords.left,
    right: boxCoords.right
  };
};

var getPinPosition = function () {
  var pinCords = getCoordsElement(effectPin);
  var lineCords = getCoordsElement(effectLine);
  var pinPosition = Math.round((pinCords.right - (pinCords.width / 2)) - lineCords.left);
  var defaultValue = Math.round((pinPosition * 100) / lineCords.width);
  return defaultValue;
};

var resetEffectFilter = function () {
  effectValue.value = '100';
  effectDepth.style.width = '100%';
  effectPin.style.left = '100%';
  imgUploadPreview.style.filter = 'none';
};

var changeEffectFilterValue = function (effect) {
  var defaultPinPosition = getPinPosition();
  var effectLevelValue = ((defaultPinPosition * EFFECTSPARAMETERS[effect].MAX) / 100);
  imgUploadPreview.style.filter = EFFECTSPARAMETERS[effect].EFFECT + '(' + effectLevelValue + EFFECTSPARAMETERS[effect].UNIT + ')';
  effectValue.value = effectLevelValue;
};

var calculateEffectLevel = function () {
  var pinPosition = getPinPosition();
  effectValue.value = pinPosition;
  effectDepth.style.width = pinPosition + '%';
  var effectName = effectsItem.querySelector('input[name="effect"]:checked');
  changeEffectFilterValue(effectName.value);
};

var onEffectPinMouseup = function () {
  calculateEffectLevel();
};

effectPin.addEventListener('mouseup', onEffectPinMouseup);

var effectsRadio = document.querySelectorAll('.effects__radio');
hiddenElement(effectLevel, 'hidden');

var onEffectsRadioChange = function (evt) {
  evt.preventDefault();
  resetEffectFilter();
  hiddenElement(effectLevel, 'hidden');
  imgUploadPreview.classList = '';
  if (evt.target.value !== 'none') {
    imgUploadPreview.classList.toggle(EFFECTSPARAMETERS[evt.target.value].CLASS);
    showElement(effectLevel, 'hidden');
  }
  changeEffectFilterValue(evt.target.value);
};

effectsRadio.forEach(function (button) {
  button.addEventListener('change', onEffectsRadioChange);
});

// 2.3. хеш-теги
var getDuplicateHashtags = function (arrayElements) {
  for (var i = 0; i < arrayElements.length; i++) {
    for (var j = i + 1; j < arrayElements.length; j++) {
      if (arrayElements[j] === arrayElements[i]) {
        return true;
      }
    }
  }
  return false;
};

var checkHashtags = function () {
  var errorMessage = '';
  var arrayHashtags = hashtags.value.toLowerCase().split(' ');
  var cleanArray = arrayHashtags.filter(function (item) {
    return item !== '';
  });
  cleanArray.forEach(function (hashtag) {
    if (!hashtag.match(/^#/)) {
      errorMessage = 'хеш-тег должен начинаться с символа #';
    } else if (!hashtag.match(/^#[\S]{1,19}$/)) {
      errorMessage = 'минимальная длина хеш-тега - 2 символа, максимальная - 20 символов';
    } else if (!hashtag.match(/^#[^#\s]{1,19}$/)) {
      errorMessage = 'в хеш-теге может быть не больше одного символа #';
    } else if (cleanArray.length > HASHTAGSCOUNT) {
      errorMessage = 'количесвто хэш-тегов не может быть больше 5';
    } else if (getDuplicateHashtags(cleanArray)) {
      errorMessage = 'один и тот же хэш-тег не может быть использован больше одного раза';
    }
  });

  hashtags.setCustomValidity(errorMessage);
};

var onTextHashtagsChange = function () {
  checkHashtags();
};

hashtags.addEventListener('input', onTextHashtagsChange);
hashtags.addEventListener('change', onTextHashtagsChange);
hashtags.addEventListener('focus', function () {
  document.removeEventListener('keydown', onUploadEscPress);
});

// 2.4. Комментарий
var description = document.querySelector('.text__description');

description.addEventListener('invalid', function () {
  if (description.validity.tooLong) {
    description.setCustomValidity('Комментарий не должен превышать 140-ка символов');
  } else {
    description.setCustomValidity('');
  }
});

description.addEventListener('focus', function () {
  document.removeEventListener('keydown', onUploadEscPress);
});
