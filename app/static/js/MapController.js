var MapController = (function () {
    function MapController() {
        this.initMap();
    }
    MapController.prototype.initMap = function () {
        var ctrl = this;
        MapController.markers = [];
        MapController.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.5016889, lng: -73.567256 },
            zoom: 14
        });
        ctrl.loadData();
        if (!MapController.userMarker)
            ctrl.geoLocalisation();
    };
    MapController.setDistance = function (distance) {
        MapController.distance = distance;
    };
    MapController.prototype.loadData = function () {
        var ctrl = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                for (var tag in data) {
                    MapController.markers[tag] = [];
                    for (var index in data[tag]) {
                        var element = data[tag][index];
                        ctrl.addMarker(tag, { lat: element.lat, lng: element.lng }, element.nom, element.description, element.urlImg);
                    }
                }
            }
        };
        xhttp.open("GET", "./static/data/data.json", true);
        xhttp.send();
    };
    MapController.prototype.addMarker = function (tag, location, name, description, urlImage) {
        var marker = new google.maps.Marker({
            position: location,
            map: MapController.map
        });
        marker.addListener('click', function () {
            AppController.setSidebarInformation(name, urlImage, description);
            AppController.showDescrBar();
        });
        MapController.markers[tag].push(marker);
    };
    MapController.prototype.geoLocalisation = function () {
        var ctrl = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                var lat = jsonResponse.location.lat;
                var lng = jsonResponse.location.lng;
                ctrl.createUserMarker(lat, lng);
                ctrl.showMarkersNear(lat, lng);
                MapController.map.setCenter({ lat: lat, lng: lng });
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
    };
    MapController.prototype.createUserMarker = function (lat, lng) {
        MapController.userMarker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: MapController.map,
            icon: MapIcons.getYouAreHereIcon()
        });
    };
    MapController.toggleMarkers = function (key, enabled) {
        var markers = MapController.markers[key];
        var map = enabled ? MapController.map : null;
        var myLat = MapController.userMarker.position.lat();
        var myLng = MapController.userMarker.position.lng();
        for (var index in markers) {
            var marker = markers[index];
            if (MathUtil.arePointsCloserThan(myLat, myLng, marker.position.lat(), marker.position.lng(), MapController.distance)) {
                marker.setMap(map);
            }
        }
    };
    MapController.prototype.showMarkersNear = function (lat, lng) {
        var markers = MapController.markers;
        for (var tag in markers) {
            for (var index in markers[tag]) {
                var element = markers[tag][index];
                if (MathUtil.arePointsCloserThan(lat, lng, element.position.lat(), element.position.lng(), MapController.distance)) {
                    element.setMap(MapController.map);
                }
                else {
                    element.setMap(null);
                }
            }
        }
    };
    return MapController;
}());
MapController.distance = 5;
//# sourceMappingURL=MapController.js.map