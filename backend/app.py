import requests
from jasparAPI import get_all_possible_matrixes, calculate_seq
from flask import Flask, jsonify, request
from flask_cors import CORS
from json import dumps

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route("/matrices")
def matrices():
    r = get_matrices()
    return jsonify(r)

@app.route("/matrices/<matrix_id>")
def matrix(matrix_id):
    r = get_matrix(matrix_id)
    return jsonify(r.text)

@app.route("/calculate", methods = ['POST'])
def calculate():

    data = request.json

    return jsonify(calculate_seq(data['matrix'], data['sequence']))



def get_matrices():
    r = get_all_possible_matrixes()
    #TODO: Calculate the things
    return r

def get_matrix(matrix_id):
    r = requests.get(f"http://jaspar.genereg.net/api/v1/matrix/{matrix_id}")
    #TODO: Calculate the things
    return r

if __name__ == "__main__":
    app.run()


