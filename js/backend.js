'use strict';

window.backend = (function () {
  var Url = {
    GET: 'https://js.dump.academy/kekstagram/data',
    POST: 'https://js.dump.academy/kekstagram'
  };
  var TIMEOUT = 10000; // 10s
  var Status = {
    OK: 200
  };

  var createNewRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === Status.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

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
