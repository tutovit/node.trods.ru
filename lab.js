var webpage = require('webpage').create();
webpage
    .open('http://google.com')
    .then(function () {
        webpage.clipRect = {top: 14, left: 3, width: 400, height: 300}; // для использования этой функции нам должны быть известно позиционирование каптчи
        var screen = webpage.renderBase64('png'); // обычно я кодирую изображение в base64, так его проще передать сторонему сервису
        var webpage2 = require('webpage').create(); // создаем второе соединени
        webpage2
            .open('http://yandex.ru')
            .then(function () {  //...далее думаю уже должно быть понятно
            });
    });