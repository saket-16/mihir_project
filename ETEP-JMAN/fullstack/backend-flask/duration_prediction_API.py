from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app, origins='http://localhost:3002')

# Load the trained model
model = joblib.load('duration_prediction_model.pkl')

# Define the encoding map for categorical features
encoded_map = {
    'Domain': {'Android Development': 0, 'Blockchain': 1, 'Cloud Computing': 2, 'Cybersecurity': 3,
               'Data Analytics': 4, 'Data Engineering': 5, 'Data Science': 6, 'DevOps': 7,
               'Machine Learning': 8, 'Software Architecture': 9, 'Web Development': 10},
    'Trainee_Type': {'employee': 0, 'intern': 1},
    'Mode': {'offline': 0, 'online': 1},
    'Level': {'advanced': 0, 'beginner': 1, 'intermediate': 2}
}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Decode input data using the encoding map
        encoded_input = [encoded_map[feature][value] for feature, value in request.json.items()]
        
        # Predict duration using the model
        duration_prediction = model.predict([encoded_input])
        
        # Return prediction with a 200 status code
        return jsonify({'prediction': duration_prediction[0]}), 200
    except KeyError as e:
        # Handle KeyError (e.g., invalid input) with a 400 status code
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        # Handle other exceptions with a 500 status code
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
