from flask import Flask, request, jsonify, render_template, url_for
import requests

# Initialize the Flask app
app = Flask(__name__, static_folder='static')

# Google Login Route (Commented if not used, uncomment for Google Login functionality)
# from google.oauth2 import id_token
# from google.auth.transport import requests
# @app.route('/google-login', methods=['POST'])
# def google_login():
#     token = request.json.get('credential')
#     try:
#         # Verify the token using Google's library
#         idinfo = id_token.verify_oauth2_token(token, requests.Request(), "YOUR_GOOGLE_CLIENT_ID")
#         user_id = idinfo['sub']  # User's unique Google ID
#         email = idinfo['email']
#         return jsonify({'message': 'Login successful', 'email': email}), 200
#     except ValueError:
#         return jsonify({'message': 'Invalid token'}), 400

# Legal Chatbot Logic
API_KEY = "AIzaSyCWb4pLYfTO1ox55g3-MPeMTSRTfoKtR7g"
BASE_URL = "https://api.gemini.com/v1"
LEGAL_TOPICS = [
    "contracts",
    "intellectual property",
    "labor law",
    "criminal law",
    "family law",
    "corporate law",
    "property law"
]

def is_legal_query(user_input):
    """
    Check if the query is related to legal topics by keyword matching.
    """
    user_input_lower = user_input.lower()
    return any(topic in user_input_lower for topic in LEGAL_TOPICS)

def fetch_legal_response(user_input):
    """
    Send the user's query to the Gemini API and get a response.
    """
    url = f"{BASE_URL}/chat"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"input": user_input}

    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            return response.json().get("output", "Sorry, no response available.")
        else:
            return f"Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"An error occurred: {str(e)}"

@app.route('/legal-chat', methods=['POST'])
def legal_chat():
    """
    Handle legal queries sent via POST requests.
    """
    data = request.json
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    if not is_legal_query(user_input):
        return jsonify({
            "reply": "Sorry, I can only assist with legal queries. Please provide a question related to legal topics."
        })

    # Fetch response for legal queries
    response = fetch_legal_response(user_input)
    return jsonify({"reply": response})

# Routes for Static Pages
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about_us')
def about_us():
    return render_template('About_us.html')

@app.route('/help_portal')
def help_portal():
    return render_template('help_portal.html')

@app.route('/payment_form')
def payment_form():
    return render_template('payment_form.html')

@app.route('/login_page')
def login_page():
    return render_template('login_page.html')

@app.route('/study_section')
def study_section():
    return render_template('study_section.html')

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

# Dynamic Chapter Routes
for i in range(1, 21):
    app.add_url_rule(f'/chapters/chapter{i}', f'chapter{i}', lambda i=i: render_template(f'chapters/chapter{i}.html'))

# 404 Error Handler
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Main entry point
if __name__ == '__main__':
    app.run(debug=True)
