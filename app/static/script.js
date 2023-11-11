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
