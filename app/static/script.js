// Добавляем функцию для выбора варианта
function selectOption(option) {
    var chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += '<div class="system-message">' + 'Вселенная: Вы выбрали персонажа <i>' + option + '</i></div>';

    // Отправляем выбранный вариант на сервер для обработки
    fetch('/processOption', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'option=' + option,
    })
    .then(response => response.text())
    .then(data => {
        // Отображаем анимацию с изображением в левой части страницы
        var animationContainer = document.getElementById('animation-container');
        animationContainer.innerHTML = `<img id="animation" src="static/images/` + data + `" width=" 300" height="402">`

        // Очищаем поле ввода
        document.getElementById('user-input').value = '';
    });
}

// Добавляем функцию для отправки сообщения пользователя
function sendMessage() {
    var userInput = document.getElementById('user-input').value;

    // Отправка данных на сервер для обработки
    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + userInput,
    })
    .then(response => response.text())
    .then(data => {
        var chatBox = document.getElementById('chat-box');
        chatBox.innerHTML += '<div class="user-message">' + userInput + '</div>'; // Вывод сообщения пользователя справа
        chatBox.innerHTML += '<div class="system-message">' + data + '</div>'; // Вывод обработанных данных слева
        document.getElementById('user-input').value = ''; // Очистка поля ввода
    });
}
