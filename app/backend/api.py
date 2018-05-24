from flask import Flask, request
from libs.keys import Parameters as ParamKeys
from libs.db import Database

app = Flask(__name__)
db = Database()

@app.route("/api/geolocation", methods=['GET'])
def getGeolocation():
    try:
        lat  = request.headers.get(ParamKeys.latitude)
        lng  = request.headers.get(ParamKeys.longitude)
        dist = request.headers.get(ParamKeys.distance)
        try:
            results = db.find(lat, lng, dist, [])
            if len(results) > 0:
                response.status_code = 200
                response.data = results
            else:
                response.status_code = 404
                response.message = "No results matching your request"
        except:
            response.status_code = 500
            response.message = "Server error"
    except:
        response.status_code = 400
        response.message = "Bad request. Missing or invalid parameter(s)"
    return response
