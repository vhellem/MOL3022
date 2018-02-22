import requests

from flask import Flask, jsonify
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
    return jsonify(r.text)

@app.route("/matrices/<matrix_id>")
def matrix(matrix_id):
    r = get_matrix(matrix_id)
    return jsonify(r.text)

def get_matrices():
    r = requests.get("http://jaspar.genereg.net/api/v1/matrix/?page_size=800&tax_id=9606")
    #TODO: Calculate the things
    return r

def get_matrix(matrix_id):
    r = requests.get(f"http://jaspar.genereg.net/api/v1/matrix/{matrix_id}")
    #TODO: Calculate the things
    return r

if __name__ == "__main__":
    app.run()


