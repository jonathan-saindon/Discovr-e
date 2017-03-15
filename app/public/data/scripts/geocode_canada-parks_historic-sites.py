import geocoder
import xml.etree.ElementTree as ET

with open("../datasets/canada_national-parks_historic-sites.xml") as xml_file:
	data = ET.parse(xml_file).getroot()
	for elem in data.findall('I_PRKS'):
		latlng = ["", ""]
		
		nom = elem.find('LOW_ENG_FULL').text
		result = geocoder.google(nom)
		if len(result.latlng) == 0:
			nom = elem.find('LOW_FRE_FULL').text
			result = geocoder.google(nom)
			if len(result.latlng) > 0:
				latlng = result.latlng
		else:
			latlng = result.latlng
		
		ET.SubElement(elem, "LATITUDE").text = str(latlng[0])
		ET.SubElement(elem, "LONGITUDE").text = str(latlng[1])
	
	tree = ET.ElementTree(data)
	tree.write("../datasets/canada_national-parks_historic-sites_positions.xml")

