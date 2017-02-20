class MapController {
    private static markers: Array<google.maps.Marker>;
    private static userMarker: google.maps.Marker;
    private static map: google.maps.Map;
    private static distance: number = 5;

    constructor() {
        this.initMap();
    }

    private initMap() : void {
        let ctrl = this;
        MapController.markers = [];
        MapController.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.5016889, lng: -73.567256 },
            zoom: 14
        });
        ctrl.loadData();

        if (!MapController.userMarker)
            ctrl.geoLocalisation();
    }

    public static setDistance(distance: number) : void {
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

    public addMarker(tag: string, location: Object, name: string, description: string, urlImage: string): void {
        let marker = new google.maps.Marker({
            position: location,
            map: MapController.map
        });
        marker.addListener('click', function () {
            AppController.setSidebarInformation(name, urlImage, description);
            AppController.showDescrBar();
        });
        MapController.markers[tag].push(marker);
    }

    private geoLocalisation() {
        let ctrl = this;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonResponse = JSON.parse(this.responseText);
                let lat = jsonResponse.location.lat;
                let lng = jsonResponse.location.lng;
                ctrl.createUserMarker(lat, lng);
                ctrl.showMarkersNear(lat, lng);
                MapController.map.setCenter({lat: lat, lng: lng});
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
    }

    private createUserMarker(lat: number, lng:number) {
        MapController.userMarker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            map: MapController.map,
            icon: MapIcons.getYouAreHereIcon()
        });
    }

    public static toggleMarkers(key: string, enabled: boolean) {
        let markers = MapController.markers[key];
        let map = enabled ? MapController.map : null;
        let myLat = MapController.userMarker.position.lat();
        let myLng = MapController.userMarker.position.lng();
        for (let index in markers) {
            let marker = markers[index];
            if (MathUtil.arePointsCloserThan(
                    myLat, myLng,
                    marker.position.lat(), marker.position.lng(),
                    MapController.distance))
            {
                marker.setMap(map);
            }
        }
    }

    private showMarkersNear(lat: number, lng: number) : void {
        let markers = MapController.markers;
        for (let tag in markers) {
            for (let index in markers[tag]) {
                let element:google.maps.Marker = markers[tag][index];
                if (MathUtil.arePointsCloserThan(lat, lng, element.position.lat(), element.position.lng(), MapController.distance)) {
                    element.setMap(MapController.map);
                } else {
                    element.setMap(null);
                }
            }
        }
    }

}