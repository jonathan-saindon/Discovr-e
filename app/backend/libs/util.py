import math

R = 6371; # Radius of the earth in km

def arePointsCloserThan(lat1, lng1, lat2, lng2, distance):
    return _getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) < distance;

def _getDistanceFromLatLonInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    dLat = _deg2rad(lat2 - lat1);
    dLon = _deg2rad(lng2 - lng1);
    a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_deg2rad(lat1)) * math.cos(_deg2rad(lat2)) *
        math.sin(dLon / 2) * math.sin(dLon / 2);
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    return R * c

def _deg2rad(deg):
    return deg * (math.pi / 180)
