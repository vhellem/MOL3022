import requests

import numpy as np
import math


def get_all_possible_matrixes():
    print("Doing request")
    r = requests.get("http://jaspar.genereg.net/api/v1/matrix/?page_size=800&tax_id=9606")

    print("Request done")

    matrix_id = []
    for matrix in r.json()['results']:
        matrix_id.append(matrix['matrix_id'])
    return matrix_id


def pwm(freq, total, bg=0.25):
    p = (freq+math.sqrt(total)*1/4)/(total+(4*(math.sqrt(total)*1/4)))
    return math.log(p/bg, 2)

def get_pfm_of_matrix(matrix='MA0634.1', bg=0.25):
    """

    :param matrix: A given matrix String to lookup in Jaspar
    :param bg: A background distribution for the bases
    :return: A new Position Weight Matrix for the transcription factor
    """

    r = requests.get('http://jaspar.genereg.net/api/v1/matrix/' + matrix + "/")
    pfm = r.json()['pfm']

    arr = []

    #This converts the pfm to a pwf matrix, probably in a horrible inefficient way, but I think it works :)
    for key, value in pfm.items():
        arr.append(value)

    total = np.sum(arr, axis=0)[0]
    newRow = []
    i= 0
    for row in arr:
        newRow.append([])
        for element in row:
            newElement = pwm(element, total, bg)
            newRow[i].append(newElement)
        i += 1
    i = 0
    for key, value in pfm.items():
        pfm[key]=newRow[i]
        i+= 1
    return pfm

def get_sequence_probability_from_pwm(pwm, sequence):
    """

    :param pwm: A a position weight matrix for a given motif
    :param sequence: A DNA sequence
    :return: A probability of the motif at all given positions in the sequence
    """
    length_of_motif = len(pwm['A'])
    prob = [0]*(len(sequence)-length_of_motif)

    for i in range(len(sequence)-length_of_motif):
        seq_score = sum([pwm[sequence[j]][j-i] for j in range(i, i+length_of_motif)])
        prob[i] = seq_score
    print(prob)
    #maxProb = max(prob)
    #minProb = min(prob)
    #prob = [(ele-minProb)/(maxProb-minProb) for ele in prob]
    #print(prob)
    return prob

#print(get_sequence_probability_from_pwm(get_pfm_of_matrix('MA0004.1'), "agtCACGTGttcc".upper()))

def calculate_seq(matrices, sequence, bg):
    m = {}
    for matrix in matrices:
        if type(sequence) is list:
            pfm = get_pfm_of_matrix(matrix, bg)
            matrixes = []
            for seq in sequence:

                matrixes.append(get_sequence_probability_from_pwm(pfm, seq.strip().upper()))
            m[matrix] =  matrixes

        else:
            m[matrix] = [get_sequence_probability_from_pwm(get_pfm_of_matrix(matrix, bg), sequence.upper())]
    return m

