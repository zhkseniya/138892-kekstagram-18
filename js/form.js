'use strict';

window.form = (function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var Scale = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };
  var Pin = {
    MIN: 0,
    MAX: 100
  };
  var HASHTAGS_COUNT = 5;
  var RegexHashtag = {
    SYMBOL: /^#/,
    LENGTH: /^#[\S]{1,19}$/,
    DUPLICATE: /^#[^#\s]{1,19}$/
  };
  var DEFAULT_EFFECT = 'none';
  var EffectsParameters = {
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

  // форма
  var form = document.querySelector('#upload-select-image');
  var submitButton = document.querySelector('.img-upload__submit');
  // загрузка файла
  var uploadFile = document.querySelector('#upload-file');
  var uploadCancel = document.querySelector('#upload-cancel');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var imgUploadPreview = document.querySelector('.img-upload__preview img');
  var imgEffectsPreview = document.querySelectorAll('.effects__preview');
  // масштаб
  var scaleControls = document.querySelectorAll('button.scale__control');
  var scaleControlValue = document.querySelector('.scale__control--value');
  // эффекты
  var effectLevel = document.querySelector('.effect-level');
  var effectPin = document.querySelector('.effect-level__pin');
  var effectDepth = document.querySelector('.effect-level__depth');
  var effectLine = document.querySelector('.effect-level__line');
  var effectValue = document.querySelector('input[name="effect-level"]');
  var effectsItem = document.querySelector('.effects__list');
  var effectsRadio = document.querySelectorAll('.effects__radio');
  var defaultEffect = document.querySelector('#effect-' + DEFAULT_EFFECT);
  // хеш-тэги
  var hashtags = document.querySelector('.text__hashtags');
  // комментарии
  var description = document.querySelector('.text__description');

  var onUploadEscPress = function (evt) {
    window.utils.isEscEvent(evt, onCloseUpload);
  };

  // загрузка файла
  var openUpload = function () {
    window.utils.showElement(imgUploadOverlay, 'hidden');
    document.addEventListener('keydown', onUploadEscPress);
  };

  var onCloseUpload = function () {
    uploadFile.value = '';
    defaultEffect.checked = true;
    resetUserSettings();
    window.utils.hiddenElement(imgUploadOverlay, 'hidden');
    document.removeEventListener('keydown', onUploadEscPress);
    submitButton.disabled = false;
  };

  uploadCancel.addEventListener('click', onCloseUpload);

  var setPreviewImage = function (imgUpdate, imgFile, backgroundImg) {

    var fileName = imgFile.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (backgroundImg) {
          imgUpdate.style.backgroundImage = 'url("' + reader.result + '")';
        } else {
          imgUpdate.src = reader.result;
        }
      });

      reader.readAsDataURL(imgFile);

      openUpload();
    }
  };

  var onUploadFileChange = function (evt) {
    evt.preventDefault();
    setPreviewImage(imgUploadPreview, uploadFile.files[0], false);

    imgEffectsPreview.forEach(function (previewImg) {
      setPreviewImage(previewImg, uploadFile.files[0], true);
    });
  };

  uploadFile.addEventListener('change', onUploadFileChange);

  // 2.1. Масштаб:
  var onScaleControlClick = function (evt) {
    evt.preventDefault();
    var value = parseInt(scaleControlValue.value, 10);
    if (evt.target.className.includes('smaller')) {
      if (value > Scale.MIN) {
        value -= Scale.STEP;
      }
    } else {
      if (value < Scale.MAX) {
        value += Scale.STEP;
      }
    }
    scaleControlValue.value = value + '%';
    imgUploadPreview.style.transform = 'scale(' + value / 100 + ')';
  };

  scaleControls.forEach(function (control) {
    control.addEventListener('click', onScaleControlClick);
  });

  var resetScaleValue = function () {
    scaleControlValue.value = Scale.MAX;
    imgUploadPreview.style.transform = 'scale(' + Scale.MAX / 100 + ')';
  };

  // 2.2. Наложение эффекта на изображение:
  var resetEffectFilter = function () {
    effectValue.value = '100';
    effectDepth.style.width = '100%';
    effectPin.style.left = '100%';
    imgUploadPreview.style.filter = 'none';
    window.utils.hiddenElement(effectLevel, 'hidden');
  };

  var changeEffectFilterValue = function (effect, position) {
    var effectLevelValue = ((position * EffectsParameters[effect].MAX) / 100);
    imgUploadPreview.style.filter = EffectsParameters[effect].EFFECT + '(' + effectLevelValue + EffectsParameters[effect].UNIT + ')';
    effectValue.value = effectLevelValue;
  };

  var calculateEffectLevel = function (pinPosition) {
    effectValue.value = pinPosition;
    effectDepth.style.width = pinPosition + '%';
    effectPin.style.left = pinPosition + '%';
    var effectName = effectsItem.querySelector('input[name="effect"]:checked');
    changeEffectFilterValue(effectName.value, pinPosition);
  };

  var onEffectPinMouseDown = function (evt) {
    evt.preventDefault();
    var startCoordsX = evt.clientX;

    var onEffectPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var sliderEffectLineRect = effectLine.getBoundingClientRect();
      var shiftX = startCoordsX - moveEvt.clientX;
      startCoordsX = moveEvt.clientX;
      var movePinPosition = Math.round((effectPin.offsetLeft - shiftX) / sliderEffectLineRect.width * 100);

      if (movePinPosition <= Pin.MIN) {
        movePinPosition = Pin.MIN;
      } else if (movePinPosition >= Pin.MAX) {
        movePinPosition = Pin.MAX;
      }

      calculateEffectLevel(movePinPosition);
    };

    var onEffectPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onEffectPinMouseMove);
      document.removeEventListener('mouseup', onEffectPinMouseUp);
    };

    document.addEventListener('mousemove', onEffectPinMouseMove);
    document.addEventListener('mouseup', onEffectPinMouseUp);
  };

  effectPin.addEventListener('mousedown', onEffectPinMouseDown);
  window.utils.hiddenElement(effectLevel, 'hidden');

  var onEffectsRadioChange = function (evt) {
    evt.preventDefault();
    resetEffectFilter();
    window.utils.hiddenElement(effectLevel, 'hidden');
    imgUploadPreview.classList = '';
    if (evt.target.value !== DEFAULT_EFFECT) {
      imgUploadPreview.classList.toggle(EffectsParameters[evt.target.value].CLASS);
      window.utils.showElement(effectLevel, 'hidden');
      changeEffectFilterValue(evt.target.value, Pin.MAX);
    }
  };

  effectsRadio.forEach(function (button) {
    button.addEventListener('change', onEffectsRadioChange);
  });

  // 2.3. хеш-теги
  var resetHashtagValue = function () {
    hashtags.value = '';
  };

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
      if (!hashtag.match(RegexHashtag.SYMBOL)) {
        errorMessage = 'хеш-тег должен начинаться с символа #';
      } else if (!hashtag.match(RegexHashtag.LENGTH)) {
        errorMessage = 'минимальная длина хеш-тега - 2 символа, максимальная - 20 символов';
      } else if (!hashtag.match(RegexHashtag.DUPLICATE)) {
        errorMessage = 'в хеш-теге может быть не больше одного символа #';
      } else if (cleanArray.length > HASHTAGS_COUNT) {
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
  var resetDescriptionValue = function () {
    description.value = '';
  };

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

  // сбросить все пользовательские настройки для фотографии
  var resetUserSettings = function () {
    resetScaleValue();
    resetEffectFilter();
    resetHashtagValue();
    resetDescriptionValue();
  };

  var successHandler = function () {
    onCloseUpload();
    resetUserSettings();
    window.success.showMessage();
  };

  var errorHandler = function (errorMessage) {
    onCloseUpload();
    resetUserSettings();
    window.message.showMessage(errorMessage);
  };

  // отправка формы
  form.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(form), successHandler, errorHandler);
    submitButton.disabled = true;
    evt.preventDefault();
  });
})();
