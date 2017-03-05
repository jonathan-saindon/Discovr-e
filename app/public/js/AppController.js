var AppController;
(function (AppController) {
    function parseParameters() {
        var paramDist = parseFloat(getParamValue('dist'));
        if (paramDist)
            MapController.setDistance(paramDist);
        var paramLat = parseFloat(getParamValue('lat'));
        var paramLng = parseFloat(getParamValue('lng'));
        if (paramLat && paramLng)
            MapController.setUserMarkerAt({ paramLat: paramLat, paramLng: paramLng });
    }
    AppController.parseParameters = parseParameters;
    function getParamValue(name) {
        var url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var rule = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(rule);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    }
    function toggleBtn(key, obj) {
        var classname = obj.className.split(" ")[2];
        var enabled = classname && classname == "disabled";
        obj.className = enabled ? "sidebarBtn tooltip enable" : "sidebarBtn tooltip disabled";
        MapController.toggleMarkers(key, enabled);
    }
    AppController.toggleBtn = toggleBtn;
    function showDescrBar() {
        $('#descrBar').show().animate({ right: 0 });
    }
    AppController.showDescrBar = showDescrBar;
    function hideDescrBar() {
        $('#descrBar').animate({ right: -355 }).hide();
        MapController.getSelectedMarker().setAnimation(null);
    }
    AppController.hideDescrBar = hideDescrBar;
    function setSidebarInformation(name, urlImage, description) {
        $("#descr-name").html(name);
        if (!description) {
            description = "";
        }
        $("#descr-details").html(description);
        if (urlImage) {
            $("#descr-img").attr('src', urlImage);
        }
        else {
            getImage(name);
        }
    }
    AppController.setSidebarInformation = setSidebarInformation;
    function getImage(query) {
        var STATE_DONE = 4;
        var STATUS_SUCCESS = 200;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == STATE_DONE && this.status == STATUS_SUCCESS) {
                var jsonResponse = JSON.parse(this.responseText);
                if (jsonResponse.items) {
                    $("#descr-img").attr('src', jsonResponse.items[0]);
                }
            }
        };
        xhttp.open("GET", "https://www.googleapis.com/customsearch/v1?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY&cx=015911799653155271639%3Ayxc2mwmxfwy&searchType=image&fileType=jpg&q=" + query + " Montreal", true);
        xhttp.send();
    }
    function searchAddress() {
        var address = $("#address")[0].value;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                MapController.setUserMarkerAt(results[0].geometry.location);
            }
            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
    AppController.searchAddress = searchAddress;
    function onDistanceChange() {
        var distance = $("#distance")[0].value;
        MapController.setDistance(distance);
        MapController.showNearUser();
    }
    AppController.onDistanceChange = onDistanceChange;
})(AppController || (AppController = {}));
//# sourceMappingURL=AppController.js.map