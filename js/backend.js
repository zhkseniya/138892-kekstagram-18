'use strict';

window.backend = (function () {
  var Url = {
    GET: 'https://js.dump.academy/kekstagram/data',
    POST: 'https://js.dump.academy/kekstagram'
  };
  var TIMEOUT = 10000; // 10s
  var Status = {
    OK: 200,
    NOT_FOUND: 400,
    INTERNAL_SERVER_ERROR: 500
  };

  var createNewRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case Status.OK:
          onSuccess(xhr.response);
          break;
        case Status.NOT_FOUND:
          onError('404 Not Found');
          break;
        case Status.INTERNAL_SERVER_ERROR:
          onError('Внутренняя ошибка сервера: ' + xhr.status + ' ' + xhr.statusText);
          break;
        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
          break;
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };

  return {
    upload: function (data, onSuccess, onError) {
      var xhr = createNewRequest(onSuccess, onError);
      xhr.open('POST', Url.POST);
      xhr.send(data);
    },
    load: function (onSuccess, onError) {
      var xhr = createNewRequest(onSuccess, onError);
      xhr.open('GET', Url.GET);
      xhr.send();
    }
  };
})();
