"use strict";
var GMap;
(function (GMap) {
    function hideDescrBar() {
        $('#descrBar').animate({ right: -355 }).hide();
    }
    GMap.hideDescrBar = hideDescrBar;
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
        }
        else {
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
    GMap.toggleBtn = toggleBtn;
    function hideMonument() {
        mapCtrl.hideMonument();
    }
    GMap.hideMonument = hideMonument;
    function hideLieu() {
        mapCtrl.hideLieu();
    }
    GMap.hideLieu = hideLieu;
    function hidePatrimoniaux() {
        mapCtrl.hidePatrimoniaux();
    }
    GMap.hidePatrimoniaux = hidePatrimoniaux;
    function hideMurales() {
        mapCtrl.hideMurales();
    }
    GMap.hideMurales = hideMurales;
    function showMonument() {
        mapCtrl.showMonument();
    }
    GMap.showMonument = showMonument;
    function showLieu() {
        mapCtrl.showLieu();
    }
    GMap.showLieu = showLieu;
    function showPatrimoniaux() {
        mapCtrl.showPatrimoniaux();
    }
    GMap.showPatrimoniaux = showPatrimoniaux;
    function showMurales() {
        mapCtrl.showMurales();
    }
    GMap.showMurales = showMurales;
    function gup(name, url) {
        if (!url)
            url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    }
})(GMap || (GMap = {}));
//# sourceMappingURL=gmap.js.map