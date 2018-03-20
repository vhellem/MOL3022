import requests
from jasparAPI import get_all_possible_matrices, calculate_seq
from flask import Flask, jsonify, request
from flask_cors import CORS
from json import dumps

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return ('<p>This api exposes 2 end points: `/matrices` and `/calculate`.\nCheck out the <a href="https://mol3022-frontend.herokuapp.com">frontend</a> to use them!</p>')


@app.route("/matrices")
def matrices():
    r = get_all_possible_matrices()
    return jsonify(r)


@app.route("/calculate", methods = ['POST'])
def calculate():

    data = request.json

    #Splits sequence data if there are multiple sequences.
    sequenceData = data['sequence'].strip()

    if ";" in sequenceData:
        sequenceData = sequenceData.split(";")

    return jsonify(calculate_seq(data['matrix'], sequenceData, float(data['background'])))

if __name__ == "__main__":
    app.run(host='0.0.0.0')
