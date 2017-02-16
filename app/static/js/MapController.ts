class MapController {
    private static markers: Array<google.maps.Marker>;
    private static map: google.maps.Map;
    private lat: number;
    private lng: number;
    private distance: number = 5;

    constructor() {
        this.initMap();
    }

    initMap(): void {
        let ctrl = this;
        MapController.markers = [];
        MapController.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 45.5016889,
                lng: -73.56725599999999
            },
            zoom: 14
        });
        ctrl.loadData();
        ctrl.geoLocalisation(ctrl.lat, ctrl.lng, ctrl.distance);
    }

    setLat(lat: number) : void {
        this.lat = lat;
    }

    setLng(lng: number) : void {
        this.lng = lng;
    }

    setDistance(distance: number) : void {
        this.distance = distance;
    }

    addMarker(tag: string, location: Object, name: string, description: string, urlImage: string): void { //google.maps.Marker {
        let ctrl = this;
        let marker = new google.maps.Marker({
            position: location,
            map: MapController.map
        });
        marker.addListener('click', function () {
            ctrl.setSidebarInformation(name, urlImage, description);
            if ($("#descrBar").style('display', 'none')) {
                $('#descrBar').show().animate({right: 0});
            }
        });
        MapController.markers[tag].push(marker);
    }

    /**
     * Get json data from server
     */
    loadData() {
        /*
         * TODO
         * Optimiser les données envoyer pour accélérer le temps de réponse
         */
        let ctrl = this;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(this.responseText);
                for (let tag in data) {
                    MapController.markers[tag] = [];
                    for (let index in data[tag]) {
                        let element = data[tag][index]
                        ctrl.addMarker(
                            tag,
                            { lat: element.lat, lng: element.lng },
                            element.nom,
                            element.description,
                            element.urlImg
                        );
                    }
                }
            }
        };
        xhttp.open("GET", "./static/data/data.json", true);
        xhttp.send();
    }

    geoLocalisation(lat: number, lng: number, distance: number) {
        let ctrl = this;
        let icon = 'http://i.stack.imgur.com/orZ4x.png';
        if (!lat) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonResponse = JSON.parse(this.responseText);
                    lat = jsonResponse.location.lat;
                    lng = jsonResponse.location.lng;

                    ctrl.addMarker({lat: lat, lng: lng}, "You are here", "Your current position.", icon);
                    ctrl.showNear(lat, lng, distance);
                    MapController.map.setCenter({lat: lat, lng: lng});
                }
            };
            xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
            xhttp.send();
        } else {
            ctrl.addMarker({lat: lat, lng: lng}, "You are here", "Your current position.", icon);
            ctrl.showNear(lat, lng, distance);
            MapController.map.setCenter({lat: lat, lng: lng});
        }
    }

    public static toggleBtn(key: string, obj: Object) {
        let markers = MapController.markers[key];
        let map;

        let classname = obj.className.split(" ")[1];
        if (classname && classname == "disabled") {
            obj.className = "sidebarBtn enable";
            map = MapController.map;
        } else {
            obj.className = "sidebarBtn disabled";
            map = null;
        }

        for (let index in markers) {
            markers[index].setMap(map);
        }
    }

    showNear(lat: number, long: number, distance: number) : void {
        let ctrl = this;
        let markers = MapController.markers;
        for (let tag in markers) {
            for (let index in markers[tag]) {
                let element:google.maps.Marker = markers[tag][index];
                if (ctrl.getDistanceFromLatLonInKm(lat, long, element.lat, element.lng) < distance) {
                    element.setMap(MapController.map);
                } else {
                    element.setMap(null);
                }
            }
        }
    }

    getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
        let ctrl = this;
        let R = 6371; // Radius of the earth in km
        let dLat = ctrl.deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = ctrl.deg2rad(lon2 - lon1);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(ctrl.deg2rad(lat1)) * Math.cos(ctrl.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    deg2rad(deg: number): number {
        return deg * (Math.PI / 180)
    }

    setSidebarInformation(name: string, urlImage: string, description: string): void {
        let ctrl = this;
        //$("#descr-name").html(name);
        document.getElementById("descr-name").innerHTML = name;

        if (!description) {
            description = "";
        }
        document.getElementById("descr-details").innerHTML = description;

        if (urlImage) {
            document.getElementById("descr-img").src = urlImage;
            document.getElementById("descr-img").addEventListener('click', function () {
                //$("#overlay").show();
                //$("#overlay-img").attr("src", urlImage);
            });
        } else {
            ctrl.getImage(name);
        }
    }

    getImage(query: string) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonResponse = JSON.parse(this.responseText);
                let url = "";
                if (jsonResponse.items) {
                    url = jsonResponse.items[0];
                }
                $("#descr-img").attr('src', url);
            }
        };
        xhttp.open("GET", "https://www.googleapis.com/customsearch/v1?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY&cx=015911799653155271639%3Ayxc2mwmxfwy&searchType=image&fileType=jpg&q=" + query + " Montreal", true);
        xhttp.send();
    }

    setMapOnAll(map: google.maps.Map, arr: Array<google.maps.Marker>) {
        for (let i = 0; i < arr.length; i++) {
            if (this.getDistanceFromLatLonInKm(this.lat, this.lng, arr[i].position.lat(), arr[i].position.lng()) < this.distance) {
                arr[i].setMap(map);
            } else {
                arr[i].setMap(null);
            }
        }
    }
}