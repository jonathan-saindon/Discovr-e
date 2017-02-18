class MapController {
    private static markers: Array<google.maps.Marker>;
    private static userMarker: google.maps.Marker;
    private static map: google.maps.Map;
    private static distance: number = 5;

    constructor() {
        this.initMap();
    }

    private initMap(): void {
        let ctrl = this;
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
    }

    setDistance(distance: number) : void {
        MapController.distance = distance;
    }

    /**
     * Get json data from server
     */
    private loadData() {
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

    public addMarker(tag: string, location: Object, name: string, description: string, urlImage: string): void { //google.maps.Marker {
        let ctrl = this;
        let marker = new google.maps.Marker({
            position: location,
            map: MapController.map
        });
        marker.addListener('click', function () {
            ctrl.setSidebarInformation(name, urlImage, description);
            $('#descrBar').show().animate({right: 0});
        });
        MapController.markers[tag].push(marker);
    }

    private geoLocalisation() {
        let ctrl = this;
        let icon = 'http://i.stack.imgur.com/orZ4x.png';

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonResponse = JSON.parse(this.responseText);
                let lat = jsonResponse.location.lat;
                let lng = jsonResponse.location.lng;
                MapController.userMarker = new google.maps.Marker({
                    position: {lat: lat, lng: lng},
                    map: MapController.map
                });
                ctrl.showNear(lat, lng);
                MapController.map.setCenter({lat: lat, lng: lng});
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
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

        let myLat = MapController.userMarker.position.lat();
        let myLng = MapController.userMarker.position.lng();
        for (let index in markers) {
            if (MapController.isNear(myLat, myLng, markers[index].position.lat(), markers[index].position.lng())) {
                markers[index].setMap(map);
            }
        }
    }

    private showNear(lat: number, lng: number) : void {
        let markers = MapController.markers;
        for (let tag in markers) {
            for (let index in markers[tag]) {
                let element:google.maps.Marker = markers[tag][index];
                if (MapController.isNear(lat, lng, element.position.lat(), element.position.lng())) {
                    element.setMap(MapController.map);
                } else {
                    element.setMap(null);
                }
            }
        }
    }

    public static isNear(lat1: number, lng1: number, lat2: number, lng2: number) : boolean {
        return MapController.getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) < MapController.distance;
    }

    private static getDistanceFromLatLonInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
        let R = 6371; // Radius of the earth in km
        let dLat = MapController.deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = MapController.deg2rad(lng2 - lng1);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(MapController.deg2rad(lat1)) * Math.cos(MapController.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static deg2rad(deg: number): number {
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
        let userMarker = MapController.userMarker;
        for (let i = 0; i < arr.length; i++) {
            if (MapController.getDistanceFromLatLonInKm(userMarker.position.lat(), userMarker.position.lnt(), arr[i].position.lat(), arr[i].position.lng()) < MapController.distance) {
                arr[i].setMap(map);
            } else {
                arr[i].setMap(null);
            }
        }
    }
}