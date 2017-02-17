var MapController = (function () {
    function MapController() {
        this.initMap();
    }
    MapController.prototype.initMap = function () {
        var ctrl = this;
        MapController.markers = [];
        MapController.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 45.5016889,
                lng: -73.567256
            },
            zoom: 14
        });
        ctrl.loadData();
        ctrl.geoLocalisation();
    };
    MapController.prototype.setDistance = function (distance) {
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
        var ctrl = this;
        var marker = new google.maps.Marker({
            position: location,
            map: MapController.map
        });
        marker.addListener('click', function () {
            ctrl.setSidebarInformation(name, urlImage, description);
            $('#descrBar').show().animate({ right: 0 });
        });
        MapController.markers[tag].push(marker);
    };
    MapController.prototype.geoLocalisation = function () {
        var ctrl = this;
        var icon = 'http://i.stack.imgur.com/orZ4x.png';
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                var lat = jsonResponse.location.lat;
                var lng = jsonResponse.location.lng;
                MapController.userMarker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: MapController.map
                });
                ctrl.showNear(lat, lng);
                MapController.map.setCenter({ lat: lat, lng: lng });
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
    };
    MapController.toggleBtn = function (key, obj) {
        var markers = MapController.markers[key];
        var map;
        var classname = obj.className.split(" ")[1];
        if (classname && classname == "disabled") {
            obj.className = "sidebarBtn enable";
            map = MapController.map;
        }
        else {
            obj.className = "sidebarBtn disabled";
            map = null;
        }
        var myLat = MapController.userMarker.position.lat();
        var myLng = MapController.userMarker.position.lng();
        for (var index in markers) {
            if (MapController.isNear(myLat, myLng, markers[index].position.lat(), markers[index].position.lng())) {
                markers[index].setMap(map);
            }
        }
    };
    MapController.prototype.showNear = function (lat, lng) {
        var markers = MapController.markers;
        for (var tag in markers) {
            for (var index in markers[tag]) {
                var element = markers[tag][index];
                if (MapController.isNear(lat, lng, element.position.lat(), element.position.lng())) {
                    element.setMap(MapController.map);
                }
                else {
                    element.setMap(null);
                }
            }
        }
    };
    MapController.isNear = function (lat1, lng1, lat2, lng2) {
        return MapController.getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) < MapController.distance;
    };
    MapController.getDistanceFromLatLonInKm = function (lat1, lng1, lat2, lng2) {
        var R = 6371;
        var dLat = MapController.deg2rad(lat2 - lat1);
        var dLon = MapController.deg2rad(lng2 - lng1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(MapController.deg2rad(lat1)) * Math.cos(MapController.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };
    MapController.deg2rad = function (deg) {
        return deg * (Math.PI / 180);
    };
    MapController.prototype.setSidebarInformation = function (name, urlImage, description) {
        var ctrl = this;
        document.getElementById("descr-name").innerHTML = name;
        if (!description) {
            description = "";
        }
        document.getElementById("descr-details").innerHTML = description;
        if (urlImage) {
            document.getElementById("descr-img").src = urlImage;
            document.getElementById("descr-img").addEventListener('click', function () {
            });
        }
        else {
            ctrl.getImage(name);
        }
    };
    MapController.prototype.getImage = function (query) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                var url = "";
                if (jsonResponse.items) {
                    url = jsonResponse.items[0];
                }
                $("#descr-img").attr('src', url);
            }
        };
        xhttp.open("GET", "https://www.googleapis.com/customsearch/v1?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY&cx=015911799653155271639%3Ayxc2mwmxfwy&searchType=image&fileType=jpg&q=" + query + " Montreal", true);
        xhttp.send();
    };
    MapController.prototype.setMapOnAll = function (map, arr) {
        var userMarker = MapController.userMarker;
        for (var i = 0; i < arr.length; i++) {
            if (MapController.getDistanceFromLatLonInKm(userMarker.position.lat(), userMarker.position.lnt(), arr[i].position.lat(), arr[i].position.lng()) < MapController.distance) {
                arr[i].setMap(map);
            }
            else {
                arr[i].setMap(null);
            }
        }
    };
    return MapController;
}());
MapController.distance = 5;
//# sourceMappingURL=MapController.js.map