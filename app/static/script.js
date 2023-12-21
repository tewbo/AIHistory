let selectedOption = null;  // здесь хранится выбранный персонаж
let history = []

// Добавляем функцию для выбора варианта
function selectOption(option) {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += '<div class="system-message">' + '<i>Система</i>: Вы выбрали персонажа <i>' + option + '</i></div>';

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
    let systemMessageTemplate = '<div class="system-message"><i>Система</i>: Призываем духов';
    let regExp = new RegExp(systemMessageTemplate + '[^<]*<\/div>')
    chatBox.innerHTML += systemMessageTemplate + '</div>';

    // Увеличение количества точек каждую секунду
    let dotsCount = 0;
    const interval = setInterval(() => {
        dotsCount %= 3
        dotsCount++;
        let systemMessage = systemMessageTemplate + '.'.repeat(dotsCount);
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
        .then(response => response.json())
        .then(data => {
            let json = data
            clearInterval(interval);
            let character = ""
            if (json.system_resp === true) {
                character = 'Система'
            } else {
                character = selectedOption
            }
            chatBox.innerHTML = chatBox.innerHTML.replace(regExp, '<div class="system-message"><i>' + character + "</i>: " + data.message_body + '</div>')
            const allSelects = document.getElementsByClassName("system-message");
            const lastSelect = allSelects[allSelects.length - 1];
            lastSelect.scrollIntoView();
            document.getElementById('user-input').value = ''; // Очистка поля ввода
            history.push(userInput)
            history.push(json.message_body)
        });
}
