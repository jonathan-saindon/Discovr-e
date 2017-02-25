interface IMarkers {
    [key: string] : Array<google.maps.Marker>
}

class MapController {
    private static markers: IMarkers;
    private static clusterer: MarkerClusterer;
    private static userMarker: google.maps.Marker;
    private static selectedMarker: google.maps.Marker;
    private static geocoder: google.maps.Geocoder;

    private static map: google.maps.Map;
    private static distance: number = 5;

    private static instance: MapController;

    constructor() {
        MapController.instance = this;
        $("#distance")[0].value = MapController.distance;
        this.initMap();
    }

    public static getSelectedMarker() : google.maps.Marker {
        return MapController.selectedMarker;
    }

    public static onDistanceChange() : void {
        let distance = $("#distance")[0].value;
        MapController.setDistance(distance);
        MapController.showNearUser();
    }

    public static setDistance(distance: number) : void {
        MapController.distance = distance;
    }

    public static toggleMarkers(key: string, enabled: boolean) : void {
        let markers = MapController.markers[key];
        let map = enabled ? MapController.map : null;
        let myLat = MapController.userMarker.position.lat();
        let myLng = MapController.userMarker.position.lng();
        for (let index in markers) {
            let marker:google.maps.Marker = markers[index];
            if (MathUtil.arePointsCloserThan(
                    myLat, myLng,
                    marker.position.lat(), marker.position.lng(),
                    MapController.distance))
            {
                marker.setMap(map);
            }
        }
        MapController.toggleCustererMarkers(markers, enabled);
    }

    private static toggleCustererMarkers(markers: Array<google.maps.Marker>, enabled: boolean) : void {
        if (enabled) {
            MapController.clusterer.addMarkers(markers);
        } else {
            MapController.clusterer.removeMarkers(markers);
        }
        MapController.clusterer.repaint();
    }

    public static createUserMarker(position: google.maps.LatLng) {
        window.setTimeout(function() {
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
    }

    private static showNearUser() : void {
        if (MapController.userMarker != null) {
            let position = MapController.userMarker.position;
            MapController.instance.showMarkersNear(position.lat(), position.lng());
        }
    }

    private initMap(): void {
        let ctrl = MapController.instance;
        MapController.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.5016889, lng: -73.567256 },
            zoom: 14
        });
        //MapController.map.setMyLocationEnabled(true);
        MapController.geocoder = new google.maps.Geocoder();
        ctrl.loadData();

        if (!MapController.userMarker)
            ctrl.geoLocalisation();
    }

    private loadData() {
        let ctrl = MapController.instance;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(this.responseText);
                MapController.markers = {};
                // TODO Otimiser les données envoyer pour accélérer le temps de réponse
                for (let tag in data) {
                    MapController.markers[tag] = [];
                    for (let index in data[tag]) {
                        ctrl.addMarker(tag, data[tag][index]);
                    }
                }
                ctrl.initMarkerClusterer();
            }
        };
        xhttp.open("GET", "./static/data/data.json", true);
        xhttp.send();
    }

    private initMarkerClusterer() {
        let mcOptions = {
            imagePath: '/static/img/cluster/m',
            //minimumClusterSize: 5,
            maxZoom: 14
        };
        MapController.clusterer = new MarkerClusterer(MapController.map, this.concatMarkers(), mcOptions);
    }

    private concatMarkers() : Array<google.maps.Marker> {
        let array:Array<google.maps.Marker> = [];
        for (let key in MapController.markers) {
            let markers = MapController.markers[key];
            for (let index in markers) {
                array.push(markers[index]);
            }
        }
        return array;
    }

    public addMarker(tag: string, element: google.maps.Marker): void {
        let position = { lat: element.lat, lng: element.lng };
        let marker = new google.maps.Marker({
            position: position,
            map: MapController.map,
            icon: MapIcons.getIcon(element.categorie)
        });
        marker.addListener('click', function () {
            AppController.setSidebarInformation(element.nom, element.urlImg, element.description);
            AppController.showDescrBar();

            // Clear other marker animation
            if (MapController.selectedMarker !== undefined) {
                MapController.selectedMarker.setAnimation(null);
            }

            this.setAnimation(google.maps.Animation.BOUNCE);
            MapController.selectedMarker = this;
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
                MapController.createUserMarker({ lat, lng });
                ctrl.showMarkersNear(lat, lng);
                MapController.map.setCenter({lat: lat, lng: lng});
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
    }

    private showMarkersNear(lat: number, lng: number) : void {
        let markers = MapController.markers;
        let visibleMarkers:google.maps.Marker = [];
        for (let tag in markers) {
            for (let index in markers[tag]) {
                let element:google.maps.Marker = markers[tag][index];
                if (MathUtil.arePointsCloserThan(lat, lng, element.position.lat(), element.position.lng(), MapController.distance)) {
                    element.setMap(MapController.map);
                    visibleMarkers.push(element);
                } else {
                    element.setMap(null);
                }
            }
        }

        if (MapController.clusterer) {
            MapController.clusterer.clearMarkers();
            MapController.clusterer.addMarkers(visibleMarkers);
            MapController.clusterer.repaint();
        }
    }

    public static searchAddress() {
        let address = $("#address")[0].value;
        MapController.geocoder.geocode( { 'address': address }, function(results:Array<google.maps.Geolocation>, status:string) {
            if (status == google.maps.GeocoderStatus.OK) {
                MapController.map.setCenter(results[0].geometry.location);
                MapController.userMarker.setMap(null);

                let position = results[0].geometry.location;
                MapController.createUserMarker(position);
                MapController.map.panTo(position);
                MapController.showNearUser();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}