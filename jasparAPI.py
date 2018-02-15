import requests
import json
import re
import numpy as np
print("Doing request")
r = requests.get("http://jaspar.genereg.net/api/v1/matrix/?page_size=800&tax_id=9606")

print("Request done")

matrix_id = []
for matrix in r.json()['results']:
    matrix_id.append(matrix['matrix_id'])

print(matrix_id)


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
print(matrices)
print(i)
print(j)