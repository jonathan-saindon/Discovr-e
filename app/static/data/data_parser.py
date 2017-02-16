import json
import csv
import xml.etree.ElementTree as ET

basepath = "datasets/"
output_file = "data.json"
wrapper = {
	"art": [],
	"landmarks": [],
	"lieuxCulturels": [],
	"parcs": [],
	"patrimoine": []
}
newline = "<br /><br />"

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

with open(basepath + "monument.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		element = {
			"lng": elem["LONG"],
			"lat": elem["LAT"],
			"nom": elem["NOM"],
			"description": "",
			"urlImg": ""
		}
		wrapper["landmarks"].append(element)

with open(basepath + "muralesSubventionnees.json", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		element = {
			"lng": float(elem["properties"]["longitude"]),
			"lat": float(elem["properties"]["latitude"]),
			"nom": elem["properties"]["adresse"],
			"description": elem["properties"]["artiste"] + ", " + str(elem["properties"]["annee"]),
			"urlImg": elem["properties"]["image"]
		}
		wrapper["art"].append(element)

with open(basepath + "SitePatrimoniaux.json", 'r') as data_file:
	data = json.load(data_file)
	for x in range(1, len(data)):
		elem = data[x]
		if ((elem["FIELD12"] != None) and (elem["FIELD11"] != None)):
			descr = elem["FIELD8"] + newline + elem["FIELD3"]
			if elem["FIELD21"] != None:
				descr += (newline + elem["FIELD21"])
			if elem["FIELD4"] != None:
				descr += (newline + elem["FIELD4"])
			element = {
				"lng": float(elem["FIELD12"]),
				"lat": float(elem["FIELD11"]),
				"nom": elem["FIELD1"],
				"description": descr,
				"urlImg": ""
			}
		wrapper["patrimoine"].append(element)

with open(basepath + "sitesPatQc.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for x in range(1, len(data)):
		elem = data[x]
		element = {
			"lng": float(elem["properties"]["latitude"]),
			"lat": float(elem["properties"]["longitude"]),
			"nom": elem["properties"]["nom_bien"],
			"description": elem["properties"]["description_bien"],
			"urlImg": elem["properties"]["url_photo"]
		}
		wrapper["patrimoine"].append(element)

with open(basepath + "PatrimoineQc.csv", 'r') as data_file:
	data = csv.reader(data_file, dialect="excel")
	next(data)
	for elem in data:
		element = {
			"lng": float(elem[11]),
			"lat": float(elem[10]),
			"nom": elem[0],
			"description": elem[3],
			"urlImg": elem[25] if elem[25] != "NULL" else ""
		}
		#if element["urlImg"] == "NULL":
			#element["urlImg"] = ""
		wrapper["patrimoine"].append(element)

with open(basepath + "lieuCulturel.json", 'r') as data_file:
	data = json.load(data_file)
	for x in range(1, len(data)):
		elem = data[x]
		websites = elem["FIELD9"].split(",")
		website = ""
		if len(websites) > 2:
			website += websites[1]
		element = {
			"lng": float(elem["FIELD10"]),
			"lat": float(elem["FIELD11"]),
			"nom": elem["FIELD3"],
			"description": str(elem["FIELD12"]) + newline + website,
			"urlImg": ""
		}
		wrapper["lieuxCulturels"].append(element)

with open(basepath + "grandsparcsmtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		position = meanPosition(elem["geometry"]["coordinates"])
		element = {
			"lng": position["lng"],
			"lat": position["lat"],
			"nom": elem["properties"]["Nom_parc"],
			"description": elem["properties"]["Generique2"],
			"urlImg": ""
		}
		wrapper["parcs"].append(element)

with open(basepath + "piscinesMtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		element = {
			"lng": float(elem["geometry"]["coordinates"][1]),
			"lat": float(elem["geometry"]["coordinates"][0]),
			"nom": elem["properties"]["NOM"],
			"description": elem["properties"]["TYPE"],
			"urlImg": ""
		}
		wrapper["parcs"].append(element)

with open(basepath + "gatineau_lieuxPublics.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		type = elem["properties"]["TYPE"]
		element = {
			"lng": float(elem["geometry"]["coordinates"][1]),
			"lat": float(elem["geometry"]["coordinates"][0]),
			"nom": elem["properties"]["NOM_TOPOGR"],
			"description": str(type + newline + elem["properties"]["ADR_COMPLE"]),
			"urlImg": ""
		}
		if any(type in x for x in ["Autre parc", "Baie", "Lac", "Marina", "Parc récréatif", "Piscine", "Réserve faunique"]):
			wrapper["parcs"].append(element)
		elif any(type in x for x in ["Aménagement public", "Aréna", "Bibliothèque", "Centre culturel", "Édifice municipal", "Édifice provincial", "Musée"]):
			wrapper["lieuxCulturels"].append(element)
		elif any(type in x for x in ["Monument et site historique"]):
			wrapper["landmarks"].append(element)
		elif any(type in x for x in ["Lieu de culte"]):
			wrapper["patrimoine"].append(element)
		elif any(type in x for x in ["Galerie d'art"]):
			wrapper["art"].append(element)
	
with open(basepath + "attraitsQc.xml", 'r') as xml_file:
	attraitsTypes = json.load(open(basepath + "attraitsQcTypes.json"))
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
		nom = elem.find('ETBL_NOM_FR').text
		desc = elem.find('ETBL_DESC_FR').text
		adrs = elem.find('ADRESSES')
		adr = adrs[0] if adrs != None else None
		
		if adr != None:
			types = elem.find('ETBL_TYPES')
			type = types[0] if types != None else None
			
			if not any(type in attraitsTypes[tag] for tag in attraitsTypes) and len(types) > 1:
				type = types[1]
			
			if any(type in attraitsTypes[tag] for tag in attraitsTypes):
				lng = adr.find('ADR_LONGITUDE').text
				lat = adr.find('ADR_LATITUDE').text
				if (lng != None and lat != None):
					element = {
						"lng": float(lng),
						"lat": float(lat),
						"nom": nom,
						"description": desc if desc != None else "",
						"urlImg": ""
					}
					wrapper[tag].append(element)

with open(output_file, "w") as f:
	f.write(json.dumps(wrapper, ensure_ascii=False))