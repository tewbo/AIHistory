from flask import *
from openai import OpenAI

from config import chatgpt_token

client = OpenAI(api_key=chatgpt_token)


app = Flask(__name__)
petr = "Петр 1 промпт.txt"
ivan = "промпт иван грозный.txt"
with open("prompts/" + petr, "rb") as file:
    prefix = file.read().decode()



def send_message_to_gpt(content: str) -> str:
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
    try:
        processed_data = send_message_to_gpt(user_input)
    except:
        processed_data = "Вселенная: Включите vpn для работы приложения"
    return processed_data

@app.route('/processOption', methods=['POST'])
def processOption():
    user_input = request.form['option']
    table = {
        "Пётр I": "petya.png",
        "Иван Грозный": "Vanya.png"
    }

    return table[user_input]


if __name__ == "__main__":
    app.run()
