var MapController = (function () {
    function MapController() {
        this.markers = [];
        this.distance = 5;
        this.initMap();
    }
    MapController.prototype.initMap = function () {
        var ctrl = this;
        ctrl.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 45.5016889,
                lng: -73.56725599999999
            },
            zoom: 14
        });
        ctrl.loadData();
        ctrl.geoLocalisation(ctrl.lat, ctrl.lng, ctrl.distance, function (lat, lng, dist) {
        });
        return ctrl.map;
    };
    MapController.prototype.setLat = function (lat) {
        this.lat = lat;
    };
    MapController.prototype.setLng = function (lng) {
        this.lng = lng;
    };
    MapController.prototype.setDistance = function (distance) {
        this.distance = distance;
    };
    MapController.prototype.addMarker = function (tag, location, name, description, urlImage) {
        var ctrl = this;
        var marker = new google.maps.Marker({
            position: location,
            map: ctrl.map
        });
        marker.addListener('click', function () {
            ctrl.setSidebarInformation(name, urlImage, description);
            if (document.getElementById("descrBar").style('display') == "none") {
                $('#descrBar').show().animate({ right: 0 });
            }
        });
        ctrl.markers.push(marker);
    };
    MapController.prototype.loadData = function () {
        var ctrl = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                ctrl.markers = [];
                for (var tag in data) {
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
    MapController.prototype.geoLocalisation = function (lat, lng, distance, callback) {
        var ctrl = this;
        if (!lat) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var jsonResponse = JSON.parse(this.responseText);
                    lat = jsonResponse.location.lat;
                    lng = jsonResponse.location.lng;
                    var icon = 'http://i.stack.imgur.com/orZ4x.png';
                    ctrl.addMarker("MyPosition", { lat: lat, lng: lng }, "You are here", "Your current position.", icon);
                    ctrl.showNear(lat, lng, distance);
                    ctrl.map.setCenter({ lat: lat, lng: lng });
                }
            };
            xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
            xhttp.send();
        }
        else {
        }
    };
    MapController.prototype.showNear = function (lat, long, distance) {
        var ctrl = this;
        var allData = ctrl.getAllData();
        for (var tag in allData) {
            for (var i = 0; i < allData[tag].length; i++) {
                if (ctrl.getDistanceFromLatLonInKm(lat, long, allData[tag][i].position.lat(), allData[tag][i].position.lng()) < distance) {
                    allData[tag][i].setMap(ctrl.map);
                }
                else {
                    allData[tag][i].setMap(null);
                }
            }
        }
    };
    MapController.prototype.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
        var ctrl = this;
        var R = 6371;
        var dLat = ctrl.deg2rad(lat2 - lat1);
        var dLon = ctrl.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(ctrl.deg2rad(lat1)) * Math.cos(ctrl.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };
    MapController.prototype.deg2rad = function (deg) {
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
            ctrl.getImage(name, function (url) {
                document.getElementById("descr-img").src = url;
            });
        }
    };
    MapController.prototype.getImage = function (query, callback) {
        var ctrl = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                var url = "";
                if (jsonResponse.items) {
                    url = jsonResponse.items[0];
                }
                callback(url);
            }
        };
        xhttp.open("GET", "https://www.googleapis.com/customsearch/v1?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY&cx=015911799653155271639%3Ayxc2mwmxfwy&searchType=image&fileType=jpg&q=" + query + " endroit montreal", true);
        xhttp.send();
    };
    MapController.prototype.getAllData = function () {
        var ctrl = this;
        return ctrl.markers;
    };
    MapController.prototype.setMapOnAll = function (map, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (this.getDistanceFromLatLonInKm(this.lat, this.lng, arr[i].position.lat(), arr[i].position.lng()) < this.distance) {
                arr[i].setMap(map);
            }
            else {
                arr[i].setMap(null);
            }
        }
    };
    return MapController;
}());
//# sourceMappingURL=MapController.js.map