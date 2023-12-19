from time import sleep

from flask import *
from openai import OpenAI

from config import chatgpt_token

client = OpenAI(api_key=chatgpt_token)

app = Flask(__name__)
petrPromptName = "Петр 1 промпт.txt"
ivanPromptName = "промпт иван грозный.txt"
stalinPromptName = "Сталин промпт.txt"

petrOption = "Пётр I"
ivanOption = "Иван Грозный"
stalinOption = "Иосиф Сталин"

def readFile(tup):
    option, filename = tup
    with open("prompts/" + filename, "rb") as file:
        return option, file.read().decode()


prefixes = dict(map(readFile, {petrOption: petrPromptName,
                               ivanOption: ivanPromptName,
                               stalinOption: stalinPromptName}.items()))


def send_message_to_gpt(content: str, prefix: str) -> str:
    completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": prefix},
            {
                "role": "user",
                "content": "Холоп:" + content,
            }
        ],
        model="gpt-3.5-turbo")
    return completion.choices[0].message.content


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/process', methods=['POST'])
def process():
    user_input = request.form['data']
    chosen_character = request.form['option']
    if chosen_character not in prefixes:
        return "Система: Выберите персонажа для диалога"
    try:
        processed_data = send_message_to_gpt(user_input, prefixes[chosen_character])
    except:
        sleep(3)
        return "Система: Включите vpn для работы приложения"
    return f"{chosen_character}: {processed_data}"


@app.route('/processOption', methods=['POST'])
def processOption():
    user_input = request.form['option']
    table = {
        petrOption: "petya.png",
        ivanOption: "vanya.png",
        stalinOption: "stalin.png"
    }

    return table[user_input]


if __name__ == "__main__":
    app.run()
