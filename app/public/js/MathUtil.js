var MathUtil;
(function (MathUtil) {
    function arePointsCloserThan(lat1, lng1, lat2, lng2, distance) {
        return getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) < distance;
    }
    MathUtil.arePointsCloserThan = arePointsCloserThan;
    function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
        var R = 6371;
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lng2 - lng1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    MathUtil.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
})(MathUtil || (MathUtil = {}));
//# sourceMappingURL=MathUtil.js.map