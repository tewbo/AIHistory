let selectedOption = null;  // здесь хранится выбранный персонаж

// Добавляем функцию для выбора варианта
function selectOption(option) {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += '<div class="system-message">' + 'Вселенная: Вы выбрали персонажа <i>' + option + '</i></div>';

    // Сохраняем выбор пользователя в локальной переменной
    selectedOption = option;

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
        const animationContainer = document.getElementById('animation-container');
        animationContainer.innerHTML = `<img id="animation" src="static/images/` + data + `" width=" 300" height="402" alt="Картинка с персонажем">`
        animationContainer.classList.remove('run-animation');
        animationContainer.offsetWidth;
        animationContainer.classList.add('run-animation');

        // Очищаем поле ввода
        document.getElementById('user-input').value = '';
    });
}

// Добавляем функцию для отправки сообщения пользователя
function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += '<div class="user-message">' + userInput + '</div>'; // Вывод сообщения пользователя справа
    // Отправка данных на сервер для обработки
    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + userInput  + '&option=' + selectedOption,
    })
    .then(response => response.text())
    .then(data => {
        chatBox.innerHTML += '<div class="system-message">' + data + '</div>'; // Вывод обработанных данных слева
        document.getElementById('user-input').value = ''; // Очистка поля ввода
    });
}
