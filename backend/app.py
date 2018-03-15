import requests
from jasparAPI import get_all_possible_matrixes, calculate_seq
from flask import Flask, jsonify, request
from flask_cors import CORS
from json import dumps

app = Flask(__name__)
CORS(app)


@app.route("/matrices")
def matrices():
    r = get_matrices()
    return jsonify(r)


@app.route("/calculate", methods = ['POST'])
def calculate():

    data = request.json

    #Splits sequence data if there are multiple sequences.
    sequenceData = data['sequence'].strip()

    if ";" in sequenceData:
        sequenceData = sequenceData.split(";")

    return jsonify(calculate_seq(data['matrix'], sequenceData, float(data['background'])))

def get_matrices():
    r = get_all_possible_matrixes()
    return r

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
