var MapController = (function () {
    function MapController() {
        MapController.instance = this;
        $("#distance")[0].value = MapController.distance;
        this.initMap();
    }
    MapController.getSelectedMarker = function () {
        return MapController.selectedMarker;
    };
    MapController.onDistanceChange = function () {
        var distance = $("#distance")[0].value;
        MapController.setDistance(distance);
        MapController.showNearUser();
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
        MapController.toggleCustererMarkers(markers, enabled);
    };
    MapController.toggleCustererMarkers = function (markers, enabled) {
        if (enabled) {
            MapController.clusterer.addMarkers(markers);
        }
        else {
            MapController.clusterer.removeMarkers(markers);
        }
        MapController.clusterer.repaint();
    };
    MapController.createUserMarker = function (position) {
        window.setTimeout(function () {
            MapController.userMarker = new google.maps.Marker({
                position: position,
                map: MapController.map,
                draggable: true,
                icon: MapIcons.getYouAreHereIcon(),
                animation: google.maps.Animation.DROP
            });
            MapController.userMarker.addListener('dragend', function () {
                MapController.showNearUser();
            });
        }, 200);
    };
    MapController.showNearUser = function () {
        if (MapController.userMarker != null) {
            var position = MapController.userMarker.position;
            MapController.instance.showMarkersNear(position.lat(), position.lng());
        }
    };
    MapController.prototype.initMap = function () {
        var ctrl = MapController.instance;
        MapController.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.5016889, lng: -73.567256 },
            zoom: 14
        });
        MapController.geocoder = new google.maps.Geocoder();
        ctrl.loadData();
        if (!MapController.userMarker)
            ctrl.geoLocalisation();
    };
    MapController.prototype.loadData = function () {
        var ctrl = MapController.instance;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                MapController.markers = {};
                for (var tag in data) {
                    MapController.markers[tag] = [];
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
        var mcOptions = {
            imagePath: '/static/img/cluster/m',
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
                MapController.createUserMarker({ lat: lat, lng: lng });
                ctrl.showMarkersNear(lat, lng);
                MapController.map.setCenter({ lat: lat, lng: lng });
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
    };
    MapController.prototype.showMarkersNear = function (lat, lng) {
        var markers = MapController.markers;
        var visibleMarkers = [];
        for (var tag in markers) {
            for (var index in markers[tag]) {
                var element = markers[tag][index];
                if (MathUtil.arePointsCloserThan(lat, lng, element.position.lat(), element.position.lng(), MapController.distance)) {
                    element.setMap(MapController.map);
                    visibleMarkers.push(element);
                }
                else {
                    element.setMap(null);
                }
            }
        }
        if (MapController.clusterer) {
            MapController.clusterer.clearMarkers();
            MapController.clusterer.addMarkers(visibleMarkers);
            MapController.clusterer.repaint();
        }
    };
    MapController.searchAddress = function () {
        var address = $("#address")[0].value;
        MapController.geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                MapController.map.setCenter(results[0].geometry.location);
                MapController.userMarker.setMap(null);
                var position = results[0].geometry.location;
                MapController.createUserMarker(position);
                MapController.map.panTo(position);
                MapController.showNearUser();
            }
            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };
    return MapController;
}());
MapController.distance = 5;
//# sourceMappingURL=MapController.js.map