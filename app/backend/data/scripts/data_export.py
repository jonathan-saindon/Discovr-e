from pymongo import MongoClient
import json

# Cloud
url = "mongodb://jonathan:saindon@ds231090.mlab.com:31090/discovre"

# Local
# url = "mongodb://jonathan:saindon@127.0.0.1/discovre"

client = MongoClient(url)
db = client["discovre"]

print("Exporting groups")
groups = [ "beaux-arts", "hotel", "places", "parks", "patrimony", "entertainment", "unesco" ]
for group in groups:
    db['group'].insert({ "name": group })

with open('../data.json') as json_data:
    print("Exporting data to MongoDB")
    data = json.load(json_data)
    db['geolocation'].insert(data)
    # for category in data:
    #     name = data[category]["name"]
    #     items = data[category]["data"]
    #     print(name, ":", len(items))
    #     if len(items) > 0:
    #         db['geolocation'].insert(items)
