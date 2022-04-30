#!/bin/python3

import csv

a = [[]]
with open('data/indian_food.csv', newline='') as csvfile:
    with open('indian_food_new.csv', 'w') as f:
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
            # for i in row:
                # i[2] = i[2].upper()
            print(', '.join(row))
            # create the csv writer
            writer = csv.writer(f)
            # write a row to the csv file
            writer.writerow(row)

