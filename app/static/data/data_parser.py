import time
import itertools
import json
import csv
import xml.etree.ElementTree as ET
import geocoder

#
# GLOBAL VARIABLES
#
basepath = "datasets/"
output_file = "data.json"
wrapper = {
	"beaux-arts": [],
	"places": [],
	"parks": [],
	"patrimony": [],
	"entertainment": [],
	"unesco": [] }
categories = json.load(open(basepath + "categories.json", 'r'))
attraitsTypes = json.load(open(basepath + "attraitsQcTypes.json"))
newline = "<br /><br />"
counter = itertools.count()
start_time = time.time()


#
# FUNCTION DEFINITIONS
#
def createElement(lat, lng, nom, descr, url, cat):
	if cat == None:
		return None;
	
	id = next(counter)
	return {
		"id": id,
		"lat": lat,
		"lng": lng,
		"nom": nom,
		"description": descr,
		"urlImg": url,
		"categorie": cat
	}

def appendElementTo(tag, element):
	if element != None:
		wrapper[tag].append(element)
	
def getCategory(tag, text):
	if tag != None and text != None:
		subcats = categories[tag]
		for subcat in subcats:
			keywords = subcats[subcat]
			for keyword in keywords:
				if keyword.lower().encode("utf-8") in text.lower().encode("utf-8"):
					return subcat
	return None

def getAttraitTypeTag(typeId):
	for tag in attraitsTypes:
		if typeId in attraitsTypes[tag]:
			return tag

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

def printTime(title, reference):
	snapshot = time.time()
	print(title + " parsed in " + str(snapshot - reference) + " seconds")
	

#
# FILES READ
#
with open(basepath + "ArtPublicMtl.json", 'r') as data_file:
	data = json.load(data_file)
	tag = "beaux-arts"
	for elem in data:
		catText = elem["CategorieObjet"]
		desc = elem["NomCollection"] + ", " + elem["CategorieObjet"]
		
		if elem["SousCategorieObjet"] != None:
			catText += str(", " + elem["SousCategorieObjet"])
			desc += str(", " + elem["SousCategorieObjet"])
		if elem["TitreVariante"] != None:
			desc += str(newline + elem["TitreVariante"])
		if elem["Batiment"] != None:
			desc += str(newline + elem["Batiment"])
		elif elem["Parc"] != None:
			desc += str(newline + elem["Parc"])
		if elem["AdresseCivique"] != None:
			desc += str(newline + elem["AdresseCivique"])
				
		element = createElement(
			float(elem["CoordonneeLatitude"]),
			float(elem["CoordonneeLongitude"]),
			elem["Titre"],
			desc,
			"",
			getCategory(tag, catText))
		appendElementTo(tag, element)
	printTime("Art public Mtl", start_time)

with open(basepath + "attraitsQc.xml", 'r') as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
		nom = elem.find('ETBL_NOM_FR').text
		desc = elem.find('ETBL_DESC_FR').text 
		adrs = elem.find('ADRESSES')
		
		if adrs != None:
			adr = adrs[0]
			lng = adr.find('ADR_LONGITUDE').text
			lat = adr.find('ADR_LATITUDE').text
			if (lng != None and lat != None):			
				types = elem.find('ETBL_TYPES')
				if types != None:
					type = types[0]
					
					tag = getAttraitTypeTag(int(type.find('ETBL_TYPE_ID').text))
					if tag == None and len(types) > 1:
						type = types[1]
						tag = getAttraitTypeTag(int(type.find('ETBL_TYPE_ID').text))
					
					element = createElement(
						float(lat),
						float(lng),
						nom,
						desc if desc != None else "",
						"",
						getCategory(tag, type.find('ETBL_TYPE_FR').text))
					appendElementTo(tag, element)
	printTime("Attraits Qc", start_time)

with open(basepath + "canada_heritage.csv", 'r') as data_file:
	data = csv.reader(data_file, dialect="excel", delimiter=',')
	next(data)
	tag = "patrimony"
	for elem in data:
		try:
			element = createElement(
				float(elem[10]),
				float(elem[11]),
				elem[2],
				elem[8],
				"",
				getCategory(tag, str(elem[2] + " " + elem[8])))
			appendElementTo(tag, element)
		except ValueError:
			try:				
				element = createElement(
					float(elem[10]),
					float(elem[11]),
					elem[2],
					elem[8],
					"",
					getCategory(tag, str(elem[2] + " " + elem[8])))
				appendElementTo(tag, element)
			except ValueError:
				i = 0
	printTime("Canada heritage", start_time)

with open(basepath + "canada_national-parks_historic-sites.xml") as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('I_PRKS'):
		tag = "parks"
		
		lat = elem.find('LATITUDE').text
		lng = elem.find('LONGITUDE').text
		if lat != None and lng != None:
			element = createElement(
				lat,
				lng,
				elem.find('LOW_FRE').text,
				elem.find('LOW_FRE_FULL').text,
				"",
				getCategory(tag, elem.find('LOW_FRE_FULL').text))
			appendElementTo(tag, element)
	printTime("Canada national parks & historic sites", start_time)

with open(basepath + "gatineau_lieuxPublics.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		type = elem["properties"]["TYPE"]
		
		tag = None
		if any(type in x for x in ["Autre parc", "Baie", "Lac", "Parc récréatif", "Piscine", "Réserve faunique"]):
			tag = "parks"
		elif any(type in x for x in ["Aréna", "Bibliothèque", "Centre culturel", "Édifice municipal", "Édifice provincial"]):
			tag = "places"
		elif any(type in x for x in ["Lieu de culte", "Monument et site historique"]):
			tag = "patrimony"
		elif any(type in x for x in ["Galerie d'art", "Musée"]):
			tag = "beaux-arts"
		elif any(type in x for x in ["Marina"]):
			tag = "entertainment"
		
		if (tag != None):
			element = createElement(
				float(elem["geometry"]["coordinates"][1]),
				float(elem["geometry"]["coordinates"][0]),
				elem["properties"]["NOM_TOPOGR"],
				str(type + newline + elem["properties"]["ADR_COMPLE"]),
				"",
				getCategory(tag, type))
			appendElementTo(tag, element)
	printTime("Gatineau lieux publics", start_time)
	
with open(basepath + "grandsparcsmtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	tag = "parks"
	for elem in data:
		position = meanPosition(elem["geometry"]["coordinates"])
		element = createElement(
			position["lat"],
			position["lng"],
			elem["properties"]["Nom_parc"],
			elem["properties"]["Generique2"],
			"",
			getCategory(tag, elem["properties"]["Generique2"]))
		appendElementTo(tag, element)
	printTime("Grands parcs Mtl", start_time)

with open(basepath + "lieuCulturel.json", 'r') as data_file:
	data = json.load(data_file)
	tag = "places"
	for x in range(1, len(data)):
		elem = data[x]
		
		desc = elem["FIELD12"]
		websites = elem["FIELD9"].split(",")
		if len(websites) > 2:
			desc += newline + websites[1]
		
		element = createElement(
			float(elem["FIELD11"]),
			float(elem["FIELD10"]),
			elem["FIELD3"],
			desc,
			"",
			getCategory(tag, elem["FIELD2"]))
		appendElementTo(tag, element)
	printTime("Lieux culturels", start_time)

#with open(basepath + "monument.json", 'r') as data_file:
#	data = json.load(data_file)
#	for elem in data:
#		element = createElement(elem["LAT"], elem["LONG"], elem["NOM"],  "",  "", "monument")
#		appendElementTo("patrimony", element)
#	printTime("Monuments", start_time)

with open(basepath + "muralesSubventionnees.json", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		element = createElement(
			float(elem["properties"]["latitude"]), 
			float(elem["properties"]["longitude"]), 
			elem["properties"]["adresse"],
			elem["properties"]["artiste"] + ", " + str(elem["properties"]["annee"]),
			elem["properties"]["image"],
			"murale")
		appendElementTo("beaux-arts", element)
	printTime("Murales subventionnees", start_time)

with open(basepath + "PatrimoineQc.csv", 'r') as data_file:
	data = csv.reader(data_file, dialect="excel")
	next(data)
	tag = "patrimony"
	for elem in data:
		element = createElement(
			float(elem[10]),
			float(elem[11]),
			elem[0],
			elem[3],
			elem[25] if elem[25] != "NULL" else "",
			getCategory(tag, elem[7]))
		appendElementTo(tag, element)
	printTime("Patrimoine Qc", start_time)

with open(basepath + "piscinesMtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	tag = "parks"
	for elem in data:
		element = createElement(
			float(elem["geometry"]["coordinates"][1]),
			float(elem["geometry"]["coordinates"][0]),
			elem["properties"]["NOM"],
			elem["properties"]["TYPE"],
			"",
			getCategory(tag, elem["properties"]["TYPE"]))
		appendElementTo(tag, element)
	printTime("Piscines Mtl", start_time)

with open(basepath + "SitePatrimoniaux.json", 'r') as data_file:
	data = json.load(data_file)
	tag = "patrimony"
	for x in range(1, len(data)):
		elem = data[x]
		if ((elem["FIELD12"] != None) and (elem["FIELD11"] != None)):
			descr = elem["FIELD8"] + newline + elem["FIELD3"]
			if elem["FIELD21"] != None:
				descr += (newline + elem["FIELD21"])
			if elem["FIELD4"] != None:
				descr += (newline + elem["FIELD4"])
				
			element = createElement(
				float(elem["FIELD11"]),
				float(elem["FIELD12"]),
				elem["FIELD1"],
				descr,
				"",
				getCategory(tag, elem["FIELD21"]))
			appendElementTo(tag, element)
	printTime("Site Patrimoniaux", start_time)

with open(basepath + "sitesPatQc.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	tag = "patrimony"
	for x in range(1, len(data)):
		elem = data[x]
		element = createElement(
			float(elem["properties"]["latitude"]),
			float(elem["properties"]["longitude"]),
			elem["properties"]["nom_bien"],
			elem["properties"]["description_bien"],
			elem["properties"]["url_photo"],
			getCategory(tag, elem["properties"]["sous_usage"]))
		appendElementTo(tag, element)
	printTime("Sites Pat Qc", start_time)

with open(basepath + "unesco.xml", 'rb') as xml_file:
	data = ET.parse(xml_file).getroot()
	tag = "unesco";
	for elem in data.findall('row'):
		lat = float(elem.find('latitude').text)
		lng = float(elem.find('longitude').text)
		
		if lat != None and lng != None:
			nom = "Unesco - " + elem.find('category').text + "(" + elem.find('date_inscribed').text + ")"
			desc = elem.find('short_description').text
			url = elem.find('image_url').text
			element = createElement(
				lat,
				lng,
				nom,
				desc,
				url,
				tag)
			appendElementTo(tag, element)
		else:
			print("LatLng error")
	printTime("Unesco", start_time)
					
#
# OUTPUT FILE WRITING
#
with open(output_file, "w") as f:
	f.write(json.dumps(wrapper, ensure_ascii=False))
	
end_time = time.time()
print("\nDone in " + str(end_time - start_time) + " seconds")