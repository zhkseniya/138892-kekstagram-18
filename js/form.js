'use strict';

window.form = (function () {
  var SCALE = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };
  var HASHTAGSCOUNT = 5;
  var REGEXHASHTAG = {
    SYMBOL: /^#/,
    LENGTH: /^#[\S]{1,19}$/,
    DUPLICATE: /^#[^#\s]{1,19}$/
  };
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

  // загрузка файла
  var uploadFile = document.querySelector('#upload-file');
  var uploadCancel = document.querySelector('#upload-cancel');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var imgUploadPreview = document.querySelector('.img-upload__preview img');
  var imgEffectsPreview = document.querySelectorAll('.effects__preview');
  // масштаб
  var scaleControl = document.querySelectorAll('button.scale__control');
  var scaleControlValue = document.querySelector('.scale__control--value');
  // эффекты
  var effectLevel = document.querySelector('.effect-level');
  var effectPin = document.querySelector('.effect-level__pin');
  var effectDepth = document.querySelector('.effect-level__depth');
  var effectLine = document.querySelector('.effect-level__line');
  var effectValue = document.querySelector('input[name="effect-level"]');
  var effectsItem = document.querySelector('.effects__list');
  var effectsRadio = document.querySelectorAll('.effects__radio');
  // хеш-тэги
  var hashtags = document.querySelector('.text__hashtags');
  // комментарии
  var description = document.querySelector('.text__description');

  var onUploadEscPress = function (evt) {
    window.utils.isEscEvent(evt, closeUpload);
  };

  // загрузка файла
  var openUpload = function () {
    window.utils.showElement(imgUploadOverlay, 'hidden');
    document.addEventListener('keydown', onUploadEscPress);
  };

  var closeUpload = function () {
    uploadFile.value = '';
    window.utils.hiddenElement(imgUploadOverlay, 'hidden');
    document.removeEventListener('keydown', onUploadEscPress);
  };

  uploadCancel.addEventListener('click', closeUpload);

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
  window.utils.hiddenElement(effectLevel, 'hidden');

  var onEffectsRadioChange = function (evt) {
    evt.preventDefault();
    resetEffectFilter();
    window.utils.hiddenElement(effectLevel, 'hidden');
    imgUploadPreview.classList = '';
    if (evt.target.value !== 'none') {
      imgUploadPreview.classList.toggle(EFFECTSPARAMETERS[evt.target.value].CLASS);
      window.utils.showElement(effectLevel, 'hidden');
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
      if (!hashtag.match(REGEXHASHTAG.SYMBOL)) {
        errorMessage = 'хеш-тег должен начинаться с символа #';
      } else if (!hashtag.match(REGEXHASHTAG.LENGTH)) {
        errorMessage = 'минимальная длина хеш-тега - 2 символа, максимальная - 20 символов';
      } else if (!hashtag.match(REGEXHASHTAG.DUPLICATE)) {
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
  hashtags.addEventListener('focusin', function () {
    document.removeEventListener('keydown', onUploadEscPress);
  });
  hashtags.addEventListener('focusout', function () {
    document.addEventListener('keydown', onUploadEscPress);
  });

  // 2.4. Комментарий
  description.addEventListener('invalid', function () {
    if (description.validity.tooLong) {
      description.setCustomValidity('Комментарий не должен превышать 140-ка символов');
    } else {
      description.setCustomValidity('');
    }
  });

  description.addEventListener('focusin', function () {
    document.removeEventListener('keydown', onUploadEscPress);
  });
  description.addEventListener('focusout', function () {
    document.addEventListener('keydown', onUploadEscPress);
  });
})();
