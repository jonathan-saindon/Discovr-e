import json
import csv
import xml.etree.ElementTree as ET

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

output_file = "data.json"
wrapper = {
	"art": [],
	"lieuxCulturels": [],
	"monuments": [],
	"parcs": [],
	"patrimoine": [],
	"attraits": []
}

with open("monument.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		element = {
			"lng": elem["LONG"],
			"lat": elem["LAT"],
			"nom": elem["NOM"],
			"description": "",
			"urlImg": ""
		}
		wrapper["monuments"].append(element)

with open("muralesSubventionnees.json", 'r') as data_file:
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

with open("SitePatrimoniaux.json", 'r') as data_file:
	data = json.load(data_file)
	for x in range(1, len(data)):
		if ((data[x]["FIELD12"] != None) and (data[x]["FIELD11"] != None)):
			element = {
				"lng": float(data[x]["FIELD12"]),
				"lat": float(data[x]["FIELD11"]),
				"nom": data[x]["FIELD1"],
				"description": str(data[x]["FIELD4"]) + " " + data[x]["FIELD3"],
				"urlImg": ""
			}
		wrapper["patrimoine"].append(element)

with open("sitesPatQc.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for x in range(1, len(data)):
		element = {
			"lng": float(data[x]["properties"]["latitude"]),
			"lat": float(data[x]["properties"]["longitude"]),
			"nom": data[x]["properties"]["nom_bien"],
			"description": data[x]["properties"]["description_bien"],
			"urlImg": data[x]["properties"]["url_photo"]
		}
		wrapper["patrimoine"].append(element)

with open("PatrimoineQc.csv", 'r') as data_file:
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

with open("lieuCulturel.json", 'r') as data_file:
	data = json.load(data_file)
	for x in range(1, len(data)):
		websites = data[x]["FIELD9"].split(",")
		website = ""
		if len(websites) > 2:
			website += websites[1]
		element = {
			"lng": float(data[x]["FIELD10"]),
			"lat": float(data[x]["FIELD11"]),
			"nom": data[x]["FIELD3"],
			"description": str(data[x]["FIELD12"]) + website,
			"urlImg": ""
		}
		wrapper["lieuxCulturels"].append(element)

with open("grandsparcsmtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		position = meanPosition(elem["geometry"]["coordinates"])
		element = {
			"lng": position["lat"],
			"lat": position["lng"],
			"nom": elem["properties"]["Nom_parc"],
			"description": elem["properties"]["Generique2"],
			"urlImg": ""
		}
		wrapper["parcs"].append(element)

with open("piscinesMtl.geojson", 'r') as data_file:
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

with open("gatineau_lieuxPublics.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		type = elem["properties"]["TYPE"]
		element = {
			"lng": float(elem["geometry"]["coordinates"][1]),
			"lat": float(elem["geometry"]["coordinates"][0]),
			"nom": elem["properties"]["NOM_TOPOGR"],
			"description": str(type + " - " + elem["properties"]["ADR_COMPLE"]),
			"urlImg": ""
		}
		if any(type in x for x in ["Autre parc", "Baie", "Lac", "Marina", "Parc récréatif", "Piscine", "Réserve faunique"]):
			wrapper["parcs"].append(element)
		elif any(type in x for x in ["Aménagement public", "Aréna", "Bibliothèque", "Centre culturel", "Édifice municipal", "Édifice provincial", "Musée"]):
			wrapper["lieuxCulturels"].append(element)
		elif any(type in x for x in ["Monument et site historique"]):
			wrapper["monuments"].append(element)
		elif any(type in x for x in ["Lieu de culte"]):
			wrapper["patrimoine"].append(element)
		elif any(type in x for x in ["Galerie d'art"]):
			wrapper["art"].append(element)
	
with open('attraitsQc.xml', 'r') as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
		nom = elem.find('ETBL_NOM_FR').text
		desc = elem.find('ETBL_DESC_FR').text
		adrs = elem.find('ADRESSES')
		adr = adrs[0] if adrs != None else None
		
		if adr != None:
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
				wrapper["attraits"].append(element)

with open(output_file, "w") as f:
	f.write(json.dumps(wrapper, ensure_ascii=False))