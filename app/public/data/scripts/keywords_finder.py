import json
import csv
import xml.etree.ElementTree as ET
import msvcrt as m #WINDOWS ONLY
import sys

basepath = "../datasets/"
output_file = "../tools/keywords_raw.json"
keywords = []

def addCategory(name):
	if name != None and not any(name in x for x in keywords):
		keywords.append(name);

def consoleLog(msg):
	sys.stdout.write("\n" + msg)
	sys.stdout.flush()

with open(basepath + "ArtPublicMtl.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		addCategory(elem["CategorieObjet"] + ", " + elem["SousCategorieObjet"])

with open(basepath + "attraitsQc.xml", 'r') as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
		types = elem.find('ETBL_TYPES')
		if (types != None and len(types) > 0):
			type = types[0]
			addCategory(type.find('ETBL_TYPE_FR').text)

with open(basepath + "gatineau_lieuxPublics.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		addCategory(elem["properties"]["TYPE"])

with open(basepath + "grandsparcsmtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		addCategory(elem["properties"]["Generique2"])

with open(basepath + "hebergement.xml") as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
		types = elem.find('ETBL_TYPES')
		if (types != None and len(types) > 0):
			type = types[0]
			addCategory(type.find('ETBL_TYPE_FR').text)

with open(basepath + "lieuCulturel.json", 'r') as data_file:
	data = json.load(data_file)
	for x in range(1, len(data)):
		elem = data[x]
		addCategory(elem["FIELD2"])

with open(basepath + "Patrimoine_Municipal.csv", 'r') as data_file:
	data = csv.reader(data_file, dialect="excel", delimiter=',')
	next(data)
	tag = "patrimony"
	for elem in data:
		addCategory(elem[7])

with open(basepath + "piscinesMtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		addCategory(elem["properties"]["TYPE"])

with open(basepath + "SitePatrimoniaux.json", 'r') as data_file:
	data = json.load(data_file)
	for x in range(1, len(data)):
		elem = data[x]
		addCategory(elem["FIELD21"])

with open(basepath + "sitesPatQc.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for x in range(1, len(data)):
		elem = data[x]
		addCategory(elem["properties"]["sous_usage"])

with open(output_file, "w") as f:
	sorted(keywords)
	f.write(json.dumps(keywords, ensure_ascii=False))

consoleLog("Categories found: " + str(len(keywords)))
consoleLog("\nPress any key to exit...")
m.getch()
sys.exit()