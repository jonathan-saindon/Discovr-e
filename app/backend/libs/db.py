import pymongo
import libs.util as util
import os

class Database():
    __init__(self):
        self.initConnection()

    def initConnection(self):
        username = os.environment['DISCOVRE_USERNAME']
        password = os.environment['DISCOVRE_PASSWORD']
        url = os.environment['DISCOVRE_URL']
        client = MongoClient("mongodb://" + username + ":" + password + "@" + url)
        self.db = client.discovre

    def findInRadius(self, lat, lng, dist, groups):
        results = self.db.geolocations.find({ "group": groups })
        filteredResults = []
        for result in results:
            if (util.arePointsCloserThan(lat, lng, result['lat'], result['lng'], dist)):
                filteredResults.append(result)
        return filteredResults
