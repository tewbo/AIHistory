from flask import *
from openai import OpenAI

from config import chatgpt_token

client = OpenAI(api_key=chatgpt_token)

app = Flask(__name__)
prefix = "Ты император России, Петр Первый. Сейчас 1725 год. Говори языком того времени"


def send_message_to_gpt(content: str) -> str:
    completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": prefix},
            {
                "role": "user",
                "content": content,
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

    processed_data = send_message_to_gpt(user_input)
    return processed_data


if __name__ == "__main__":
    app.run()
    # text = 'Как тебя зовут?'
    # resp = send_message_to_gpt(text)
    # print(resp)
