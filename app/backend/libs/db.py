import pymongo
import libs.util as util

class Database():
    __init__(self):
        self.initConnection()

    def initConnection(self):
        client = MongoClient("mongodb://jonathan:saindon@ds231090.mlab.com:31090/discovre")
        self.db = client.discovre

    def findInRadius(self, lat, lng, dist, groups):
        results = self.db.geolocations.find({ "group": groups })
        filteredResults = []
        for result in results:
            if (util.arePointsCloserThan(lat, lng, result['lat'], result['lng'], dist)):
                filteredResults.append(result)
        return filteredResults
