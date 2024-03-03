from flask import Flask, request, jsonify, abort
from openai import OpenAI
import logging
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

#Logging configuration
logging.basicConfig(filename='flask_app.log', level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s: %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')

#Getting allowed URL origins from the ENV, to reject API calls from other sources than the user browser
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
app.logger.info(f"ALLOWED_ORIGINS: {ALLOWED_ORIGINS}")

#Checking the origin or refer URLs
@app.before_request
def validate_origin_and_referer():
    origin = request.headers.get('Origin')
    referer = request.headers.get('Referer')

    if origin:
        if any(origin == allowed_origin for allowed_origin in ALLOWED_ORIGINS):
            app.logger.debug(f"Allowed origin: {origin}")
            return
    else:
        if referer:
            if any(referer.startswith(allowed_origin) for allowed_origin in ALLOWED_ORIGINS):
                app.logger.debug(f"Allowed referer: {referer}")
                return

    app.logger.warning(f"Access denied for origin: {origin} and referer: {referer}")
    abort(403, 'Access Denied: The request origin is not allowed.')


#Endpoint to retrieve ChatGPT answers
@app.route('/api/chatgpt-query', methods=['POST'])
def chatgpt_query():

    client = OpenAI()

    data = request.json
    app.logger.debug(f"Request data: {data['question']}\n{data['weatherData']}")

    #Concatenation of the user question and the weather data
    messages = [
        {
            "role": "user",
            "content": f"{data['question']}\n{data['weatherData']}"
        }
    ]

    try:

        app.logger.info("Sending request to OpenAI")

        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=messages,
            temperature=1,
            max_tokens=4095,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        message_content = response.choices[0].message.content

        app.logger.debug(f"OpenAI response: {message_content}")

        return jsonify({"response": message_content})
    except Exception as e:
        app.logger.error(f"Error processing the chatgpt-query: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
