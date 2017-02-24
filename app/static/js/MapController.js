var GMarker = (function () {
    function GMarker(obj) {
        this.lat = obj.lat;
        this.lng = obj.lng;
        this.nom = obj.nom;
        this.description = obj.description;
        this.urlImg = obj.urlImg;
        this.categorie = obj.categorie;
    }
    return GMarker;
}());
var MapController = (function () {
    function MapController() {
        this.initMap();
    }
    MapController.getSelectedMarker = function () {
        return MapController.selectedMarker;
    };
    MapController.setDistance = function (distance) {
        MapController.distance = distance;
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
    MapController.createUserMarker = function (lat, lng) {
        MapController.userMarker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: MapController.map,
            icon: MapIcons.getYouAreHereIcon()
        });
    };
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
    MapController.prototype.loadData = function () {
        var ctrl = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                for (var tag in data) {
                    MapController.markers[tag] = [];
                    for (var index in data[tag]) {
                        ctrl.addMarker(tag, data[tag][index]);
                    }
                }
            }
        };
        xhttp.open("GET", "./static/data/data.json", true);
        xhttp.send();
    };
    MapController.prototype.initMarkerClusterer = function () {
        var mcOptions = {
            imagePath: '/static/img/cluster/m',
            minimumClusterSize: 5,
            maxZoom: 14
        };
        MapController.clusterer = new MarkerClusterer(MapController.map, this.concatMarkers(), mcOptions);
    };
    MapController.prototype.concatMarkers = function () {
        var array = [];
        for (var key in MapController.markers) {
            var markers = MapController.markers[key];
            for (var index in markers) {
                array.push(markers[index]);
            }
        }
        return array;
    };
    MapController.prototype.addMarker = function (tag, element) {
        var position = { lat: element.lat, lng: element.lng };
        var marker = new google.maps.Marker({
            position: position,
            map: MapController.map,
            icon: MapIcons.getIcon(element.categorie)
        });
        marker.addListener('click', function () {
            AppController.setSidebarInformation(element.nom, element.urlImg, element.description);
            AppController.showDescrBar();
            if (MapController.selectedMarker !== undefined) {
                MapController.selectedMarker.setAnimation(null);
            }
            this.setAnimation(google.maps.Animation.BOUNCE);
            2;
            MapController.selectedMarker = this;
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
                MapController.createUserMarker(lat, lng);
                ctrl.showMarkersNear(lat, lng);
                MapController.map.setCenter({ lat: lat, lng: lng });
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
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