from common import *

noAddr = 0

with open(datapath + "/services.xml", 'r') as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('ETABLISSEMENT'):
	
		addrs = elem.find('ADRESSES')
		if addrs != None and len(addrs) > 0:
			name = elem.find('ETBL_TYPES')[0].find('ETBL_TYPE_FR').text
			addCategory(name)
		else:
			noAddr += 1
	print("N elements: " + str(len(data.findall('ETABLISSEMENT'))))
	print("N categories: " + str(len(keywords)))
	print("No address: " + str(noAddr))
	print(keywords)
