#!/bin/python3

import csv

s = set()
with open('data/indian_food.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
    for row in spamreader:
        # print(row[1].lower())
        row[1] = row[1].lower()
        row.pop()
        row.pop()
        row.pop()
        row.pop()
        row.pop()
        row.pop()
        row.pop()
        for i in row[1].split(','):
            print(i.strip())
            s.add(i.strip())

f = open("ingredients.csv", 'w')
for i in s:
    f.write(i+"\n")
print(len(s))
