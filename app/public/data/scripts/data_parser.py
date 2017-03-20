import itertools
from common import *

#
# GLOBAL VARIABLES
#
output_file = "../data.json"
wrapper = {
	"beaux-arts": [],
	"hotel": [],
	"places": [],
	"parks": [],
	"patrimony": [],
	"entertainment": [],
	"unesco": [] }
positions = [] # Utilisé pour éviter d'ajouter des doublons en fonction des positions LatLng
duplicates = 0
attraitsTypes = json.load(open(toolpath + "attraitsQcTypes.json")) # Utilisé pour catégoriser les éléments provenants de 'attraitsQc.xml'
counter = itertools.count() # Itérateur pour générer les ID

#
# FUNCTION DEFINITIONS
#
def createElement(lat, lng, nom, descr, url, cat):
	if cat == None:
		return None
	
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

# Return 0 if successfuly appended element
# Return 0 if failed to append because element is None
# Return 1 if failed to append because duplicate
def appendElementTo(tag, element):
	if element != None:
		latlng = [element["lat"], element["lng"]]
		if not latlng in positions:
			wrapper[tag].append(element)
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
# FILES TO READ
#
with open(datapath + "ArtPublicMtl.json", 'r') as data_file:
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
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Art public Mtl")

with open(datapath + "attraitsQc.xml", 'r') as xml_file:
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
					duplicates += appendElementTo(tag, element)
	printTimeFromStart("Attraits Qc")

with open(datapath + "canada_heritage.csv", 'r') as data_file:
	data = csv.reader(data_file, dialect="excel", delimiter=',')
	next(data)
	tag = "patrimony"
	for elem in data:
		element = createElement(
			float(elem[9]),
			float(elem[10]),
			elem[2],
			elem[8],
			"",
			getCategory(tag, str(elem[2] + " " + elem[8])))
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Canada heritage")

with open(datapath + "canada_national-parks_historic-sites.xml") as xml_file:
	data = ET.parse(xml_file).getroot()
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
				getCategory(tag, elem.find('LOW_FRE_FULL').text))
			duplicates += appendElementTo(tag, element)
	printTimeFromStart("Canada national parks & historic sites")

with open(datapath + "gatineau_lieuxPublics.json", 'r') as data_file:
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
			duplicates += appendElementTo(tag, element)
	printTimeFromStart("Gatineau lieux publics")
	
with open(datapath + "grandsparcsmtl.geojson", 'r') as data_file:
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
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Grands parcs Mtl")

with open(datapath + "hebergement.xml", 'r', encoding='utf-8', errors='ignore') as xml_file:
	data = ET.parse(xml_file).getroot()
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
				getCategory(tag, type))
			duplicates += appendElementTo(tag, element)
	printTimeFromStart("Hebergement")
	
with open(datapath + "Immeubles_Patrimoniaux_Qc.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	tag = "patrimony"
	for elem in data:
		elem = elem["properties"]
		element = createElement(
			elem["latitude"],
			elem["longitude"],
			elem["nom_bien"],
			elem["description_bien"],
			elem["url_photo"],
			getCategory(tag, elem["usage"]))
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Grands parcs Mtl")
	
with open(datapath + "institutions_museales.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for obj in data:
		tag = "places"
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
			getCategory(tag, elem["typologie"]))
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Institutions muséales")
	
with open(datapath + "lieuCulturel.json", 'r') as data_file:
	data = json.load(data_file)
	tag = "places"
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
			getCategory(tag, elem["FIELD2"]))
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Lieux culturels")

with open(datapath + "monument.json", 'r') as data_file:
	data = json.load(data_file)
	tag = "beaux-arts"
	for elem in data:
		element = createElement(
			float(elem["LAT"]),
			float(elem["LONG"]),
			elem["NOM"],
			"",
			"",
			"monument")
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Monument")

with open(datapath + "muralesSubventionnees.json", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		element = createElement(
			float(elem["properties"]["latitude"]), 
			float(elem["properties"]["longitude"]), 
			elem["properties"]["adresse"],
			elem["properties"]["artiste"] + ", " + str(elem["properties"]["annee"]),
			elem["properties"]["image"],
			"murale")
		duplicates += appendElementTo("beaux-arts", element)
	printTimeFromStart("Murales subventionnees")

with open(datapath + "panneaux_interpretation.json", 'r') as data_file:
	data = json.load(data_file)
	tag = "patrimony"
	for elem in data:
		element = createElement(
			float(elem["LATITUDE"]),
			float(elem["LONGITUDE"]),
			elem["TITRE"],
			elem["TEXTE"],
			"",
			"panel")
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Panneaux Interprétation")

with open(datapath + "Patrimoine_Municipal.csv", 'r') as data_file:
	data = csv.reader(data_file, dialect="excel", delimiter=',')
	next(data)
	tag = "patrimony"
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
				getCategory(tag, elem[0]))
			duplicates += appendElementTo(tag, element)
	printTimeFromStart("Patrimoine Municipal")

with open(datapath + "piscinesMtl.geojson", 'r') as data_file:
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
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Piscines Mtl")

with open(datapath + "services.xml", 'r', encoding='utf-8', errors='ignore') as xml_file:
	data = ET.parse(xml_file).getroot()
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
					getCategory(tag, type))
				duplicates += appendElementTo(tag, element)
	printTimeFromStart("Services")

with open(datapath + "SitePatrimoniaux.json", 'r') as data_file:
	data = json.load(data_file)
	tag = "patrimony"
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
				getCategory(tag, elem["FIELD21"]))
			duplicates += appendElementTo(tag, element)
	printTimeFromStart("Site Patrimoniaux")

with open(datapath + "sitesPatQc.geojson", 'r') as data_file:
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
		duplicates += appendElementTo(tag, element)
	printTimeFromStart("Sites Pat Qc")

with open(datapath + "unesco.xml", 'r', encoding='utf-8', errors='ignore') as xml_file:
	data = ET.parse(xml_file).getroot()
	tag = "unesco";
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
				tag)
			duplicates += appendElementTo(tag, element)
	printTimeFromStart("Unesco")

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
consoleLog("Elements added: " + str(countAll()))
consoleLog("Duplicates rejected: " + str(duplicates))
promptExit()