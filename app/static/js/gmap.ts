import MapCtrl from "./MapController"

module GMap {
    export function hideDescrBar() {
        $('#descrBar').animate({right: -355}).hide();
    }

    export function toggleBtn(index, obj) {
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

    export function hideMonument() {
        mapCtrl.hideMonument();
    }

    export function hideLieu() {
        mapCtrl.hideLieu();
    }

    export function hidePatrimoniaux() {
        mapCtrl.hidePatrimoniaux();
    }

    export function hideMurales() {
        mapCtrl.hideMurales();
    }

    export function showMonument() {
        mapCtrl.showMonument();
    }

    export function showLieu() {
        mapCtrl.showLieu();
    }

    export function showPatrimoniaux() {
        mapCtrl.showPatrimoniaux();
    }

    export function showMurales() {
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

}