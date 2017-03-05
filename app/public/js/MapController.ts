interface IMarkers {
    [key: string] : Array<google.maps.Marker>
}

class MapController {
    private markers: IMarkers;
    private clusterer: MarkerClusterer;
    private userMarker: google.maps.Marker;
    private selectedMarker: google.maps.Marker;
    private geocoder: google.maps.Geocoder;

    private map: google.maps.Map;
    private distance: number = 5;

    private static instance: MapController;

    constructor() {
        MapController.instance = this;
        $("#distance")[0].value = this.distance;
        this.initMap();
    }

    public static getSelectedMarker() : google.maps.Marker {
        return MapController.instance.selectedMarker;
    }

    public static setDistance(distance: number) : void {
        MapController.instance.distance = distance;
    }

    private initMap(): void {
        let ctrl = MapController.instance;
        ctrl.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.5016889, lng: -73.567256 },
            zoom: 14
        });
        //MapController.map.setMyLocationEnabled(true);
        ctrl.geocoder = new google.maps.Geocoder();
        ctrl.loadData();

        if (!ctrl.userMarker)
            ctrl.geoLocalisation();
    }

    private loadData() {
        let ctrl = MapController.instance;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(this.responseText);
                ctrl.markers = {};
                // TODO Otimiser les données envoyer pour accélérer le temps de réponse
                for (let tag in data) {
                    ctrl.markers[tag] = [];
                    for (let index in data[tag]) {
                        ctrl.addMarker(tag, data[tag][index]);
                    }
                }
                ctrl.initMarkerClusterer();
            }
        };
        xhttp.open("GET", "/data/data.json", true);
        xhttp.send();
    }

    private initMarkerClusterer() {
        let ctrl = MapController.instance;
        let mcOptions = {
            imagePath: '/img/cluster/m',
            //minimumClusterSize: 5,
            maxZoom: 14
        };
        ctrl.clusterer = new MarkerClusterer(ctrl.map, this.concatMarkers(), mcOptions);
    }

    public addMarker(tag: string, element: google.maps.Marker): void {
        let ctrl = MapController.instance;
        let position = { lat: element.lat, lng: element.lng };
        let marker = new google.maps.Marker({
            position: position,
            map: ctrl.map,
            icon: MapIcons.getIcon(element.categorie)
        });
        marker.addListener('click', function () {
            AppController.setSidebarInformation(element.nom, element.urlImg, element.description);
            AppController.showDescrBar();

            // Clear other marker animation
            if (ctrl.selectedMarker !== undefined) {
                ctrl.selectedMarker.setAnimation(null);
            }

            this.setAnimation(google.maps.Animation.BOUNCE);
            ctrl.selectedMarker = this;
        });
        ctrl.markers[tag].push(marker);
    }

    public createUserMarker(position: google.maps.LatLng) {
        let ctrl = MapController.instance;
        window.setTimeout(function() {
            ctrl.userMarker = new google.maps.Marker({
                position: position,
                map: ctrl.map,
                draggable: true,
                icon: MapIcons.getYouAreHereIcon(),
                animation: google.maps.Animation.DROP
            });
            MapController.showNearUser();

            ctrl.userMarker.addListener('dragend', function () {
                MapController.showNearUser();
            });
        }, 200);
    }

    private geoLocalisation() {
        let ctrl = this;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonResponse = JSON.parse(this.responseText);
                let lat = jsonResponse.location.lat;
                let lng = jsonResponse.location.lng;
                ctrl.createUserMarker({ lat, lng });
                ctrl.showMarkersNear(lat, lng);
                ctrl.map.setCenter({ lat: lat, lng: lng });
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
    }

    public static showNearUser() : void {
        let ctrl = MapController.instance;
        if (ctrl.userMarker != null) {
            let position = ctrl.userMarker.position;
            ctrl.showMarkersNear(position.lat(), position.lng());
        }
    }

    private showMarkersNear(lat: number, lng: number) : void {
        let ctrl = MapController.instance;
        let markers = ctrl.markers;
        let visibleMarkers:google.maps.Marker = [];
        for (let tag in markers) {
            for (let index in markers[tag]) {
                let element:google.maps.Marker = markers[tag][index];
                if (MathUtil.arePointsCloserThan(lat, lng, element.position.lat(), element.position.lng(), ctrl.distance)) {
                    element.setMap(ctrl.map);
                    visibleMarkers.push(element);
                } else {
                    element.setMap(null);
                }
            }
        }

        if (ctrl.clusterer) {
            ctrl.clusterer.clearMarkers();
            ctrl.clusterer.addMarkers(visibleMarkers);
            ctrl.clusterer.repaint();
        }
    }

    public static setUserMarkerAt(location: google.maps.LatLng) {
        let ctrl = MapController.instance;
        ctrl.map.setCenter(location);
        ctrl.userMarker.setMap(null);

        ctrl.createUserMarker(location);
        ctrl.map.panTo(location);
        MapController.showNearUser();
    }

    public static toggleMarkers(key: string, enabled: boolean) : void {
        let ctrl = MapController.instance;
        let markers = ctrl.markers[key];
        let map = enabled ? ctrl.map : null;
        let myLat = ctrl.userMarker.position.lat();
        let myLng = ctrl.userMarker.position.lng();
        for (let index in markers) {
            let marker:google.maps.Marker = markers[index];
            if (MathUtil.arePointsCloserThan(
                    myLat, myLng,
                    marker.position.lat(), marker.position.lng(),
                    ctrl.distance))
            {
                marker.setMap(map);
            }
        }
        ctrl.toggleCustererMarkers(markers, enabled);
    }

    private toggleCustererMarkers(markers: Array<google.maps.Marker>, enabled: boolean) : void {
        let ctrl = MapController.instance;
        if (enabled) {
            ctrl.clusterer.addMarkers(markers);
        } else {
            ctrl.clusterer.removeMarkers(markers);
        }
        ctrl.clusterer.repaint();
    }

    private concatMarkers() : Array<google.maps.Marker> {
        let ctrl = MapController.instance;
        let array:Array<google.maps.Marker> = [];
        for (let key in ctrl.markers) {
            let markers = ctrl.markers[key];
            for (let index in markers) {
                array.push(markers[index]);
            }
        }
        return array;
    }

}