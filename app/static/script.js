let selectedOption = null;  // здесь хранится выбранный персонаж
let history = []

// Добавляем функцию для выбора варианта
function selectOption(option) {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += '<div class="system-message">' + 'Система: Вы выбрали персонажа <i>' + option + '</i></div>';

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
            history = []
        });
}

// Добавляем функцию для отправки сообщения пользователя
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');

    chatBox.innerHTML += '<div class="user-message">' + userInput + '</div>'; // Вывод сообщения пользователя справа

    // Вывод системного сообщения
    let systemMessageTemplate = '<div class="system-message">Система: Призываем духов';
    let regExp = new RegExp(systemMessageTemplate + '[^<]*<\/div>')
    chatBox.innerHTML += systemMessageTemplate + '</div>';

    // Увеличение количества точек каждую секунду
    let dotsCount = 0;
    const interval = setInterval(() => {
        dotsCount %= 3
        dotsCount++;
        let systemMessage = systemMessageTemplate + '.'.repeat(dotsCount);
        console.log(regExp.test('<div class="system-message">Система: Призываем духов...</div>'))
        chatBox.innerHTML = chatBox.innerHTML.replace(regExp, systemMessage + '</div>');
    }, 1000);

    // Отправка данных на сервер для обработки
    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"data": userInput, "option": selectedOption, "history": history}),
    })
        .then(response => response.text())
        .then(data => {
            clearInterval(interval);
            chatBox.innerHTML = chatBox.innerHTML.replace(regExp, '<div class="system-message">' + data + '</div>')
            document.getElementById('user-input').value = ''; // Очистка поля ввода
            history.push(userInput)
            history.push(data)
        });
}
