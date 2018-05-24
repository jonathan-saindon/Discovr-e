# coding=utf-8
import itertools
from common import *

#
# GLOBAL VARIABLES
#
output_file = "../data.json"
# wrapper = {
# 	"beaux-arts": dict([("name", "beaux-arts"), ("data", [])]),
# 	"hotel": dict([("name", "hotel"), ("data", [])]),
# 	"places": dict([("name", "places"), ("data", [])]),
# 	"parks": dict([("name", "parks"), ("data", [])]),
# 	"patrimony": dict([("name", "patrimony"), ("data", [])]),
# 	"entertainment": dict([("name", "entertainment"), ("data", [])]),
# 	"unesco": dict([("name", "unesco"), ("data", [])])
# }
wrapper = []
positions = [] # Utilisé pour éviter d'ajouter des doublons en fonction des positions LatLng
duplicates = 0
attraitsTypes = json.load(open(toolpath + "attraitsQcTypes.json")) # Utilisé pour catégoriser les éléments provenants de 'attraitsQc.xml'
# counter = itertools.count() # Itérateur pour générer les ID

#
# FUNCTION DEFINITIONS
#
def createElement(lat, lng, nom, descr, url, cat, tag):
	if cat == None:
		return None

	# id = next(counter)
	return {
		# "id": id,
		"lat": lat,
		"lng": lng,
		"name": nom,
		"description": descr,
		"img": url,
		"category": cat,
		"group": tag
	}

# Return 0 if successfuly appended element
# Return 0 if failed to append because element is None
# Return 1 if failed to append because duplicate
def appendElementTo(tag, element):
	if element != None:
		latlng = [element["lat"], element["lng"]]
		if not latlng in positions:
			wrapper.append(element)
			positions.append(latlng)
		else:
			return 1
	return 0

def getAttraitTypeTag(typeId):
	for tag in attraitsTypes:
		if typeId in attraitsTypes[tag]:
			return tag

def countAll():
	total = 0
	for tag in wrapper:
		total += len(wrapper[tag])
	return total

#
# File Parsers
#
def parseArtPublicMtl(content):
	data = json.load(content)
	tag = "beaux-arts"
	duplicates = 0
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
			getCategory(tag, catText),
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseAttraitsQc(content):
	data = ET.parse(content).getroot()
	duplicates = 0
	for elem in data.findall('ETABLISSEMENT'):
		nom = elem.find('ETBL_NOM_FR').text
		desc = elem.find('ETBL_DESC_FR').text
		adrs = elem.find('ADRESSES')

		if adrs != None:
			adr = adrs[0]
			lng = adr.find('ADR_LONGITUDE').text
			lat = adr.find('ADR_LATITUDE').text
			types = elem.find('ETBL_TYPES')
			if (lng != None and lat != None and types != None):
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
					getCategory(tag, type.find('ETBL_TYPE_FR').text),
					tag)
				duplicates += appendElementTo(tag, element)
	return duplicates

def parseCanadaHeritage(content):
	data = csv.reader(content, dialect="excel", delimiter=',')
	next(data)
	tag = "patrimony"
	duplicates = 0
	for elem in data:
		element = createElement(
			float(elem[9]),
			float(elem[10]),
			elem[2],
			elem[8],
			"",
			getCategory(tag, str(elem[2] + " " + elem[8])),
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseCanadaNationalParks(content):
	data = ET.parse(content).getroot()
	duplicates = 0
	for elem in data.findall('I_PRKS'):
		tag = "parks"

		lat = elem.find('LATITUDE').text
		lng = elem.find('LONGITUDE').text
		if lat != None and lng != None:
			element = createElement(
				float(lat),
				float(lng),
				elem.find('LOW_FRE').text,
				elem.find('LOW_FRE_FULL').text,
				"",
				getCategory(tag, elem.find('LOW_FRE_FULL').text),
				tag)
			duplicates += appendElementTo(tag, element)
	return duplicates

def parseGatineauLieuxPublics(content):
	data = json.load(content)
	duplicates = 0
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
				getCategory(tag, type),
				tag)
			duplicates += appendElementTo(tag, element)
	return duplicates

def parseGrandsParcsMtl(content):
	data = json.load(content)["features"]
	tag = "parks"
	duplicates = 0
	for elem in data:
		position = meanPosition(elem["geometry"]["coordinates"])
		element = createElement(
			position["lat"],
			position["lng"],
			elem["properties"]["Nom_parc"],
			elem["properties"]["Generique2"],
			"",
			getCategory(tag, elem["properties"]["Generique2"]),
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseHebergement(content):
	data = ET.parse(content).getroot()
	duplicates = 0
	for elem in data.findall('ETABLISSEMENT'):
		tag = "hotel"

		addr = elem.find('ADRESSES')[0];
		lat = addr.find('ADR_LATITUDE').text
		lng = addr.find('ADR_LONGITUDE').text

		if lat != None and lng != None:
			nom = elem.find('ETBL_NOM_FR').text
			desc = elem.find('ETBL_DESC_FR').text

			etbl_type = elem.find('ETBL_TYPES')[0]
			type = etbl_type.find('ETBL_TYPE_FR').text if etbl_type.find('ETBL_TYPE_FR').text != None else etbl_type.find('ETBL_TYPE_GRP_FR').text
			element = createElement(
				float(lat),
				float(lng),
				nom,
				desc if desc != None else "",
				"",
				getCategory(tag, type),
				tag)
			duplicates += appendElementTo(tag, element)
	return duplicates

def parseImmeublesPatrimoniaux(content):
	data = json.load(content)["features"]
	tag = "patrimony"
	duplicates = 0
	for elem in data:
		elem = elem["properties"]
		element = createElement(
			elem["latitude"],
			elem["longitude"],
			elem["nom_bien"],
			elem["description_bien"],
			elem["url_photo"],
			getCategory(tag, elem["usage"]),
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseInstitutionsMuseales(content):
	data = json.load(content)["features"]
	duplicates = 0
	for obj in data:
		tag = "beaux-arts"
		elem = obj["properties"]

		if not elem["typologie"] in categories["beaux-arts"]["musee"]:
			tag = "patrimony"

		desc = elem["typologie"] + newline + elem["institutions_museales"]
		if elem["corporations"] != None:
			desc += newline + elem["corporations"]

		element = createElement(
			elem["latitude"],
			elem["longitude"],
			elem["institutions_museales"],
			desc,
			"",
			getCategory(tag, elem["typologie"]),
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseLieuCulturel(content):
	data = json.load(content)
	tag = "places"
	duplicates = 0
	for x in range(1, len(data)):
		elem = data[x]

		desc = elem["FIELD12"]
		websites = elem["FIELD9"].split(",")
		if len(websites) > 2:
			desc += newline + "<a>" + websites[1] + "</a>"

		element = createElement(
			float(elem["FIELD11"]),
			float(elem["FIELD10"]),
			elem["FIELD3"],
			desc,
			"",
			getCategory(tag, elem["FIELD2"]),
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseMonument(content):
	data = json.load(content)
	tag = "beaux-arts"
	duplicates = 0
	for elem in data:
		element = createElement(
			float(elem["LAT"]),
			float(elem["LONG"]),
			elem["NOM"],
			"",
			"",
			"monument",
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseMurales(content):
	data = json.load(content)["features"]
	duplicates = 0
	tag = "murale"
	for elem in data:
		element = createElement(
			float(elem["properties"]["latitude"]),
			float(elem["properties"]["longitude"]),
			elem["properties"]["adresse"],
			elem["properties"]["artiste"] + ", " + str(elem["properties"]["annee"]),
			elem["properties"]["image"],
			tag,
			tag)
		duplicates += appendElementTo("beaux-arts", element)
	return duplicates

def parsePanneauxInterpretation(content):
	data = json.load(content)
	tag = "patrimony"
	duplicates = 0
	for elem in data:
		element = createElement(
			float(elem["LATITUDE"]),
			float(elem["LONGITUDE"]),
			elem["TITRE"],
			elem["TEXTE"],
			"",
			"panel",
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parsePatrimoineMunicipal(content):
	data = csv.reader(content, dialect="excel", delimiter=',')
	next(data)
	tag = "patrimony"
	duplicates = 0
	for elem in data:
		lat = elem[10]
		lng = elem[11]
		if lat != "" and lng != "":
			element = createElement(
				float(lat),
				float(lng),
				elem[0],
				elem[3],
				elem[4] if elem[4] != "NULL" else "",
				getCategory(tag, elem[0]),
				tag)
			duplicates += appendElementTo(tag, element)
	return duplicates

def parsePiscinesMtl(content):
	data = json.load(content)["features"]
	tag = "parks"
	duplicates = 0
	for elem in data:
		element = createElement(
			float(elem["geometry"]["coordinates"][1]),
			float(elem["geometry"]["coordinates"][0]),
			elem["properties"]["NOM"],
			elem["properties"]["TYPE"],
			"",
			getCategory(tag, elem["properties"]["TYPE"]),
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseServices(content):
	data = ET.parse(content).getroot()
	duplicates = 0
	for elem in data.findall('ETABLISSEMENT'):
		tag = "places"

		addrs = elem.find('ADRESSES');
		if addrs != None and len(addrs) > 0:
			addr = addrs[0]
			lat = addr.find('ADR_LATITUDE').text
			lng = addr.find('ADR_LONGITUDE').text

			if lat != None and lng != None:
				nom = elem.find('ETBL_NOM_FR').text
				desc = elem.find('ETBL_DESC_FR').text

				etbl_type = elem.find('ETBL_TYPES')[0]
				type = etbl_type.find('ETBL_TYPE_FR').text if etbl_type.find('ETBL_TYPE_FR').text != None else etbl_type.find('ETBL_TYPE_GRP_FR').text
				element = createElement(
					float(lat),
					float(lng),
					nom,
					desc,
					"",
					getCategory(tag, type),
					tag)
				duplicates += appendElementTo(tag, element)
	return duplicates

def parseSitesPatrimoniaux(content):
	data = json.load(content)
	tag = "patrimony"
	duplicates = 0
	for x in range(1, len(data)):
		elem = data[x]
		if ((elem["FIELD12"] != None) and (elem["FIELD11"] != None)):
			website = elem["FIELD3"]
			descr = elem["FIELD8"] + newline + "<a href='" + website + "'>" + website + "</a>"
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
				getCategory(tag, elem["FIELD21"]),
				tag)
			duplicates += appendElementTo(tag, element)
	return duplicates

def parseSitesPatQc(content):
	data = json.load(content)["features"]
	tag = "patrimony"
	duplicates = 0
	for x in range(1, len(data)):
		elem = data[x]
		element = createElement(
			float(elem["properties"]["latitude"]),
			float(elem["properties"]["longitude"]),
			elem["properties"]["nom_bien"],
			elem["properties"]["description_bien"],
			elem["properties"]["url_photo"],
			getCategory(tag, elem["properties"]["sous_usage"]),
			tag)
		duplicates += appendElementTo(tag, element)
	return duplicates

def parseUnesco(content):
	data = ET.parse(content).getroot()
	tag = "unesco"
	duplicates = 0
	for elem in data.findall('row'):
		lat = float(elem.find('latitude').text)
		lng = float(elem.find('longitude').text)

		if lat != None and lng != None:
			nom = "Unesco - " + elem.find('category').text + " (" + elem.find('date_inscribed').text + ")"
			desc = elem.find('short_description').text
			url = elem.find('image_url').text
			element = createElement(
				lat,
				lng,
				nom,
				desc,
				url,
				tag,
				tag)
			duplicates += appendElementTo(tag, element)
	return duplicates

dataset = [
	{ 'filename': "ArtPublicMtl.json", 'parser': parseArtPublicMtl },
	{ 'filename': "attraitsQc.xml", 'parser': parseAttraitsQc },
	{ 'filename': "canada_heritage.csv", 'parser': parseCanadaHeritage },
	{ 'filename': "canada_national-parks_historic-sites.xml", 'parser': parseCanadaNationalParks },
	{ 'filename': "gatineau_lieuxPublics.json", 'parser': parseGatineauLieuxPublics },
	{ 'filename': "grandsparcsmtl.geojson", 'parser': parseGrandsParcsMtl },
	{ 'filename': "hebergement.xml", 'parser': parseHebergement },
	{ 'filename': "Immeubles_Patrimoniaux_Qc.geojson", 'parser': parseImmeublesPatrimoniaux },
	{ 'filename': "institutions_museales.geojson", 'parser': parseInstitutionsMuseales },
	{ 'filename': "lieuCulturel.json", 'parser': parseLieuCulturel },
	{ 'filename': "monument.json", 'parser': parseMonument },
	{ 'filename': "muralesSubventionnees.json", 'parser': parseMurales },
	{ 'filename': "panneaux_interpretation.json", 'parser': parsePanneauxInterpretation },
	{ 'filename': "Patrimoine_Municipal.csv", 'parser': parsePatrimoineMunicipal },
	{ 'filename': "piscinesMtl.geojson", 'parser': parsePiscinesMtl },
	{ 'filename': "services.xml", 'parser': parseServices },
	{ 'filename': "SitesPatrimoniaux.json", 'parser': parseSitesPatrimoniaux },
	{ 'filename': "sitesPatQc.geojson", 'parser': parseSitesPatQc },
	{ 'filename': "unesco.xml", 'parser': parseUnesco }
]

for data in dataset:
	with open(datapath + data['filename'], 'r', encoding='utf-8', errors='ignore') as content:
		duplicates += data['parser'](content)
		printTimeFromStart(data['filename'])

#
# OUTPUT FILE WRITING
#
with open(output_file, "w", encoding='utf-8', errors='ignore') as f:
	f.write(json.dumps(wrapper, ensure_ascii=False))

#
# SCRIPT CONCLUSION
# DATA INFORMATION
#
printEndTime()
# count = countAll()
count = len(wrapper)
consoleLog("Elements added: " + str(count))
consoleLog("Duplicates rejected: " + str(duplicates) + " (" + str(round((duplicates/count), 4)) + "%)")
# input("Press Enter to continue...")
