from pymongo import MongoClient
import json

# Cloud
url = "mongodb://jonathan:saindon@ds231090.mlab.com:31090/discovre"

# Local
# url = "mongodb://jonathan:saindon@127.0.0.1/discovre"

client = MongoClient(url)
db = client["discovre"]

with open('../data.json') as json_data:
    data = json.load(json_data)
    print("Exporting data to MongoDB")
    for category in data:
        name = data[category]["name"]
        items = data[category]["data"]
        print(name, ":", len(items))
        if len(items) > 0:
            db[name].insert(items)
