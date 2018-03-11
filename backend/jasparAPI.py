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
    maxProb = max(prob)
    minProb = min(prob)
    prob = [(ele-minProb)/(maxProb-minProb) for ele in prob]
    print(prob)
    return prob

#print(get_sequence_probability_from_pwm(get_pfm_of_matrix('MA0004.1'), "agtCACGTGttcc".upper()))

def calculate_seq(matrix, sequence, bg):

    if type(sequence) is list:
        matrix = get_pfm_of_matrix(matrix, bg)
        matrixes = []
        for seq in sequence:

            matrixes.append(get_sequence_probability_from_pwm(matrix, seq.strip().upper()))
        return matrixes

    else:
        return get_sequence_probability_from_pwm(get_pfm_of_matrix(matrix, bg), sequence.upper())


"""
for key, value in matrices.items():

    total = np.sum(value, axis=0)[0]
    newRow = []
    i = 0
    for row in value:
        newRow.append([])
        for element in row:
            element = pwm(element, total)
            newRow[i].append(element)
        i += 1
    newRow = np.array(newRow)
    matrices[key] = newRow

#print(matrices)



doRead = True
i = 0
j = 0
matrices = {}
current_m = ""
mat = []
with open("matrices.txt") as file:
    for linje in file.readlines():
        if (linje.startswith(">")):

            j += 1
            if linje[1:9] in matrix_id:
                mat = np.array(mat)
                matrices[current_m] = mat
                mat = []
                current_m = linje[1:9]
                i += 1
                doRead = True
            else:
                doRead =False
        elif doRead:
            temp = linje[linje.index("[")+1:linje.index("]")]
            temp = re.sub(r'\s+', ',', temp)
            temp = temp[1:-1]
            temp = temp.split(",")
            temp = [int(x) for x in temp]
            mat.append(temp)
            #print(mat)
            #print(linje)
"""