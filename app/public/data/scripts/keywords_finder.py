from common import *

output_file = toolpath + "keywords_raw.json"

with open(datapath + "ArtPublicMtl.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		addCategory(elem["CategorieObjet"] + ", " + elem["SousCategorieObjet"])

with open(datapath + "attraitsQc.xml", 'r') as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
		types = elem.find('ETBL_TYPES')
		if (types != None and len(types) > 0):
			type = types[0]
			addCategory(type.find('ETBL_TYPE_FR').text)

with open(datapath + "gatineau_lieuxPublics.json", 'r') as data_file:
	data = json.load(data_file)
	for elem in data:
		addCategory(elem["properties"]["TYPE"])

with open(datapath + "grandsparcsmtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		addCategory(elem["properties"]["Generique2"])

with open(datapath + "hebergement.xml", 'r', encoding='utf-8', errors='ignore') as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
		types = elem.find('ETBL_TYPES')
		if (types != None and len(types) > 0):
			type = types[0]
			addCategory(type.find('ETBL_TYPE_FR').text)

with open(datapath + "lieuCulturel.json", 'r') as data_file:
	data = json.load(data_file)
	for x in range(1, len(data)):
		elem = data[x]
		addCategory(elem["FIELD2"])

with open(datapath + "Patrimoine_Municipal.csv", 'r') as data_file:
	data = csv.reader(data_file, dialect="excel", delimiter=',')
	next(data)
	tag = "patrimony"
	for elem in data:
		addCategory(elem[7])

with open(datapath + "piscinesMtl.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for elem in data:
		addCategory(elem["properties"]["TYPE"])

with open(datapath + "services.xml", 'r') as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
		addCategory(elem.find('ETBL_TYPES')[0].find('ETBL_TYPE_FR').text)

with open(datapath + "SitePatrimoniaux.json", 'r') as data_file:
	data = json.load(data_file)
	for x in range(1, len(data)):
		elem = data[x]
		addCategory(elem["FIELD21"])

with open(datapath + "sitesPatQc.geojson", 'r') as data_file:
	data = json.load(data_file)["features"]
	for x in range(1, len(data)):
		elem = data[x]
		addCategory(elem["properties"]["sous_usage"])

with open(output_file, "w") as f:
	sorted(keywords)
	f.write(json.dumps(keywords, ensure_ascii=False))

consoleLog("Categories found: " + str(len(keywords)))
promptExit()