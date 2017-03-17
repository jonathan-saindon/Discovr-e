# Common libraries, variables and functions used in other python scripts for this project

#
# LIBRARIES
#

import geocoder
import json
import csv
import xml.etree.ElementTree as ET
import sys
import time
import msvcrt as m #WINDOWS ONLY

#
# VARIABLES
#

datapath = "../datasets/"
toolpath = "../tools/"
newline = "<br /><br />"
categories = json.load(open("../tools/categories.json", 'r'))
keywords = []
start_time = time.time()

#
# FUNCTIONS
#

def getCategory(tag, text):
	if tag != None and text != None:
		subcats = categories[tag]
		for subcat in subcats:
			keywords = subcats[subcat]
			for keyword in keywords:
				if keyword.lower().encode("utf-8") in text.lower().encode("utf-8"):
					return subcat
	return None

def addCategory(name):
	if name != None and not any(name in x for x in keywords):
		keywords.append(name);

def meanPosition(positions):
	n = 0
	totalLat = 0
	totalLong = 0
	for x in range(0, len(positions)):
		for y in range(0, len(positions[x])):
			if len(positions[x][y]) > 2:
				for z in range(0, len(positions[x][y])):
					totalLong += positions[x][y][z][0]
					totalLat += positions[x][y][z][1]
					n += 1
			else:
				totalLong += positions[x][y][0]
				totalLat += positions[x][y][1]
				n += 1
	mean = {
		"lat": totalLat / n,
		"lng": totalLong / n
	}
	return mean

def printTimeFromStart(title):
	snapshot = time.time()
	consoleLog(title + " parsed in " + str(snapshot - start_time) + " seconds")

def printEndTime():
	end_time = time.time()
	consoleLog("\nDone in " + str(end_time - start_time) + " seconds")

def consoleLog(msg):
	sys.stdout.write(msg + "\n")
	sys.stdout.flush()

# WINDOWS ONLY
def promptExit():
	consoleLog("\nPress any key to exit...")
	m.getch()
	sys.exit()

