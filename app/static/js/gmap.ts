import MapCtrl from "./MapController"

export module GMap {
    /* ---- VARIABLES ---- */
    private mapCtrl: MapController;

    /* ---- FUNCTIONS ---- */
    export function initMap() {
        mapCtrl = new MapController();
        map = mapCtrl.initMap();
        setTimeout(function () {
            dictionaire = [monumentMarkers, lieuMarkers, patrimoniauxMarkers];
            mapCtrl.geoLocalisation();
        }, 1000);
    }

    function hideDescrBar() {
        $('#descrBar').animate({right: -355}).hide();
    }

    function toggleBtn(index, obj) {
        var classname = obj.className.split(" ")[1];
        if (classname && classname == "disabled") {
            obj.className = "sidebarBtn enable";
            switch (index) {
                case 0:
                    showMonument();
                    break;
                case 1:
                    showLieu();
                    break;
                case 2:
                    showPatrimoniaux();
                    break;
                case 3:
                    showMurales();
                    break;
            }
        } else {
            obj.className = "sidebarBtn disabled";
            switch (index) {
                case 0:
                    hideMonument();
                    break;
                case 1:
                    hideLieu();
                    break;
                case 2:
                    hidePatrimoniaux();
                    break;
                case 3:
                    hideMurales();
                    break;
            }
        }
    }

    function hideMonument() {
        mapCtrl.hideMonument();
    }

    function hideLieu() {
        mapCtrl.hideLieu();
    }

    function hidePatrimoniaux() {
        mapCtrl.hidePatrimoniaux();
    }

    function hideMurales() {
        mapCtrl.hideMurales();
    }

    function showMonument() {
        mapCtrl.showMonument();
    }

    function showLieu() {
        mapCtrl.showLieu();
    }

    function showPatrimoniaux() {
        mapCtrl.showPatrimoniaux();
    }

    function showMurales() {
        mapCtrl.showMurales();
    }

    function gup(name, url) {
        if (!url) url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    }

    /* ---- SCRIPT ---- */
    $(document).tooltip();
    var dist = gup('distance');
    mapCtrl.setLat(parseFloat(gup('lat')));
    mapCtrl.setLng(parseFloat(gup('lng')));
    if (dist) {
        mapCtrl.setDistance(dist);
    }
}