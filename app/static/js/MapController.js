var MapController = (function () {
    function MapController() {
        this.distance = 5;
        MapController.instance = this;
        $("#distance")[0].value = this.distance;
        this.initMap();
    }
    MapController.getSelectedMarker = function () {
        return MapController.instance.selectedMarker;
    };
    MapController.setDistance = function (distance) {
        MapController.instance.distance = distance;
    };
    MapController.prototype.initMap = function () {
        var ctrl = MapController.instance;
        ctrl.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.5016889, lng: -73.567256 },
            zoom: 14
        });
        ctrl.geocoder = new google.maps.Geocoder();
        ctrl.loadData();
        if (!ctrl.userMarker)
            ctrl.geoLocalisation();
    };
    MapController.prototype.loadData = function () {
        var ctrl = MapController.instance;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                ctrl.markers = {};
                for (var tag in data) {
                    ctrl.markers[tag] = [];
                    for (var index in data[tag]) {
                        ctrl.addMarker(tag, data[tag][index]);
                    }
                }
                ctrl.initMarkerClusterer();
            }
        };
        xhttp.open("GET", "./static/data/data.json", true);
        xhttp.send();
    };
    MapController.prototype.initMarkerClusterer = function () {
        var ctrl = MapController.instance;
        var mcOptions = {
            imagePath: '/static/img/cluster/m',
            maxZoom: 14
        };
        ctrl.clusterer = new MarkerClusterer(ctrl.map, this.concatMarkers(), mcOptions);
    };
    MapController.prototype.addMarker = function (tag, element) {
        var ctrl = MapController.instance;
        var position = { lat: element.lat, lng: element.lng };
        var marker = new google.maps.Marker({
            position: position,
            map: ctrl.map,
            icon: MapIcons.getIcon(element.categorie)
        });
        marker.addListener('click', function () {
            AppController.setSidebarInformation(element.nom, element.urlImg, element.description);
            AppController.showDescrBar();
            if (ctrl.selectedMarker !== undefined) {
                ctrl.selectedMarker.setAnimation(null);
            }
            this.setAnimation(google.maps.Animation.BOUNCE);
            ctrl.selectedMarker = this;
        });
        ctrl.markers[tag].push(marker);
    };
    MapController.prototype.createUserMarker = function (position) {
        var ctrl = MapController.instance;
        window.setTimeout(function () {
            ctrl.userMarker = new google.maps.Marker({
                position: position,
                map: ctrl.map,
                draggable: true,
                icon: MapIcons.getYouAreHereIcon(),
                animation: google.maps.Animation.DROP
            });
            ctrl.userMarker.addListener('dragend', function () {
                MapController.showNearUser();
            });
        }, 200);
    };
    MapController.prototype.geoLocalisation = function () {
        var ctrl = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                var lat = jsonResponse.location.lat;
                var lng = jsonResponse.location.lng;
                ctrl.createUserMarker({ lat: lat, lng: lng });
                ctrl.showMarkersNear(lat, lng);
                ctrl.map.setCenter({ lat: lat, lng: lng });
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
    };
    MapController.showNearUser = function () {
        var ctrl = MapController.instance;
        if (ctrl.userMarker != null) {
            var position = ctrl.userMarker.position;
            ctrl.showMarkersNear(position.lat(), position.lng());
        }
    };
    MapController.prototype.showMarkersNear = function (lat, lng) {
        var ctrl = MapController.instance;
        var markers = ctrl.markers;
        var visibleMarkers = [];
        for (var tag in markers) {
            for (var index in markers[tag]) {
                var element = markers[tag][index];
                if (MathUtil.arePointsCloserThan(lat, lng, element.position.lat(), element.position.lng(), ctrl.distance)) {
                    element.setMap(ctrl.map);
                    visibleMarkers.push(element);
                }
                else {
                    element.setMap(null);
                }
            }
        }
        if (ctrl.clusterer) {
            ctrl.clusterer.clearMarkers();
            ctrl.clusterer.addMarkers(visibleMarkers);
            ctrl.clusterer.repaint();
        }
    };
    MapController.setUserMarkerAt = function (location) {
        var ctrl = MapController.instance;
        ctrl.map.setCenter(location);
        ctrl.userMarker.setMap(null);
        ctrl.createUserMarker(location);
        ctrl.map.panTo(location);
        MapController.showNearUser();
    };
    MapController.toggleMarkers = function (key, enabled) {
        var ctrl = MapController.instance;
        var markers = ctrl.markers[key];
        var map = enabled ? ctrl.map : null;
        var myLat = ctrl.userMarker.position.lat();
        var myLng = ctrl.userMarker.position.lng();
        for (var index in markers) {
            var marker = markers[index];
            if (MathUtil.arePointsCloserThan(myLat, myLng, marker.position.lat(), marker.position.lng(), ctrl.distance)) {
                marker.setMap(map);
            }
        }
        ctrl.toggleCustererMarkers(markers, enabled);
    };
    MapController.prototype.toggleCustererMarkers = function (markers, enabled) {
        var ctrl = MapController.instance;
        if (enabled) {
            ctrl.clusterer.addMarkers(markers);
        }
        else {
            ctrl.clusterer.removeMarkers(markers);
        }
        ctrl.clusterer.repaint();
    };
    MapController.prototype.concatMarkers = function () {
        var ctrl = MapController.instance;
        var array = [];
        for (var key in ctrl.markers) {
            var markers = ctrl.markers[key];
            for (var index in markers) {
                array.push(markers[index]);
            }
        }
        return array;
    };
    return MapController;
}());
//# sourceMappingURL=MapController.js.map