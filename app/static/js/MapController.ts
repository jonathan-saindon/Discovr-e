class MapController {
    private markers = [];
    /*
    private monumentMarkers: Array<google.maps.Marker>;
    private lieuMarkers: Array<google.maps.Marker>;
    private patrimoniauxMarkers: Array<google.maps.Marker>;
    private muralesMarkers: Array<google.maps.Marker>;
    */
    private lat: number;
    private lng: number;
    private distance: number = 5;
    private map: google.maps.Map;

    constructor() {
        this.initMap();
    }

    initMap(): void {
        var ctrl = this;
        ctrl.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 45.5016889,
                lng: -73.56725599999999
            },
            zoom: 14
        });
        ctrl.loadData();
        ctrl.geoLocalisation(ctrl.lat, ctrl.lng, ctrl.distance,
            function (lat: number, lng: number, dist: number) {
                /*ctrl.showNear(lat, lng, dist);
                var icon = 'http://i.stack.imgur.com/orZ4x.png';
                ctrl.addMarker({lat: lat, lng: lng}, "You are here", "Your current position.", icon);
                ctrl.map.setCenter({lat: lat, lng: lng});*/
            }
        );
        return ctrl.map;
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

    addMarker(tag:string, location: Object, name: string, description: string, urlImage: string): void { //google.maps.Marker {
        var ctrl = this;
        let marker = new google.maps.Marker({
            position: location,
            map: ctrl.map
        });
        marker.addListener('click', function () {
            ctrl.setSidebarInformation(name, urlImage, description);
            if (document.getElementById("descrBar").style('display') == "none") {
                $('#descrBar').show().animate({right: 0});
            }
        });
        ctrl.markers.push(marker);
        //return marker;
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

                ctrl.markers = [];
                for (let tag in data) {
                    for (let index in data[tag]) {
                        let element = data[tag][index]
                        ctrl.addMarker(
                            tag,
                            {lat: element.lat, lng: element.lng},
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

    geoLocalisation(lat: number, lng: number, distance: number, callback: Function) {
        let ctrl = this;
        if (!lat) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var jsonResponse = JSON.parse(this.responseText);
                    lat = jsonResponse.location.lat;
                    lng = jsonResponse.location.lng;

                    var icon = 'http://i.stack.imgur.com/orZ4x.png';
                    ctrl.addMarker("MyPosition", {lat: lat, lng: lng}, "You are here", "Your current position.", icon);
                    ctrl.showNear(lat, lng, distance);
                    ctrl.map.setCenter({lat: lat, lng: lng});
                }
            };
            xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
            xhttp.send();
        } else {
            //callback(lat, lng, distance);
        }
    }

    showNear(lat: number, long: number, distance: number) : void {
        var ctrl = this;
        let allData = ctrl.getAllData();
        for (let tag in allData) {
            for (let i = 0; i < allData[tag].length; i++) {
                if (ctrl.getDistanceFromLatLonInKm(lat, long, allData[tag][i].position.lat(), allData[tag][i].position.lng()) < distance) {
                    allData[tag][i].setMap(ctrl.map);
                } else {
                    allData[tag][i].setMap(null);
                }
            }
        }
    }

    getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
        var ctrl = this;
        let R = 6371; // Radius of the earth in km
        let dLat = ctrl.deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = ctrl.deg2rad(lon2 - lon1);
        let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(ctrl.deg2rad(lat1)) * Math.cos(ctrl.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    deg2rad(deg: number): number {
        return deg * (Math.PI / 180)
    }

    setSidebarInformation(name: string, urlImage: string, description: string): void {
        var ctrl = this;
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
            ctrl.getImage(name, function (url:string) {
                //$("#descr-img").attr('src', url);
                document.getElementById("descr-img").src = url;
            })
        }
    }

    getImage(query: string, callback: Function) {
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
    }

    getAllData() : Object { //Array<google.maps.Marker> {
        var ctrl = this;
        //return [].concat(this.monumentMarkers, this.lieuMarkers, this.patrimoniauxMarkers, this.muralesMarkers);
        return ctrl.markers;
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

    /*
    hideMonument() {
        this.setMapOnAll(null, this.monumentMarkers)
    }

    hideLieu() {
        this.setMapOnAll(null, this.lieuMarkers)
    }

    hidePatrimoniaux() {
        this.setMapOnAll(null, this.patrimoniauxMarkers)
    }

    hideMurales() {
        this.setMapOnAll(null, this.muralesMarkers)
    }

    showMonument() {
        this.setMapOnAll(this.map, this.monumentMarkers)
    }

    showLieu() {
        this.setMapOnAll(this.map, this.lieuMarkers)
    }

    showPatrimoniaux() {
        this.setMapOnAll(this.map, this.patrimoniauxMarkers)
    }

    showMurales() {
        this.setMapOnAll(this.map, this.muralesMarkers)
    }
    */
}