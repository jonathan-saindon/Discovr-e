import geocoder
import json
import csv
import xml.etree.ElementTree as ET

categories = json.load(open("../tools/categories.json", 'r'))

def getCategory(tag, text):
	if tag != None and text != None:
		subcats = categories[tag]
		for subcat in subcats:
			keywords = subcats[subcat]
			for keyword in keywords:
				if keyword.lower().encode("utf-8") in text.lower().encode("utf-8"):
					return subcat
	return None

with open("../datasets/hebergement.xml") as xml_file:
	data = ET.parse(xml_file).getroot()
	print(str(len(data.findall('ETABLISSEMENT'))))