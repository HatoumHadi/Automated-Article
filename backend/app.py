from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
CORS(app)

# Configure OpenAI API
openai.api_key = os.getenv('OPENAI_KEY')

# Add this right after your OpenAI API key setup
print("OpenAI Key:", "Loaded" if openai.api_key else "Missing!")

@app.route('/generate', methods=['POST'])
def generate_content():
    data = request.json
    text = data.get('text')
    option = data.get('option')
    
    try:
        if option == 'title':
            prompt = f"Generate a compelling title for this article idea: {text}"
        elif option == 'article':
            prompt = f"Write a detailed article based on this idea: {text}"
        elif option == 'summary':
            prompt = f"Generate a concise summary for this article: {text}"
        else:
            return jsonify({'error': 'Invalid option'}), 400
        
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # Updated to use GPT-4o model
            messages=[{"role": "user", "content": prompt}],
            temperature=1,  # Increased from 0.7 to 1 for more creativity
            max_tokens=500, 
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        
        generated_text = response.choices[0].message.content
        return jsonify({'result': generated_text})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)