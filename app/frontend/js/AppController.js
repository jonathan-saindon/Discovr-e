var AppController;
(function (AppController) {
    function init() {
        new MapController();
        AppController.parseParameters();
    }
    AppController.init = init;
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
    function closeMarker() {
        this.hideDescrBar();
        MapController.getSelectedMarker().setAnimation(null);
    }
    AppController.closeMarker = closeMarker;
    function hideDescrBar() {
        $('#descrBar').animate({ right: -355 }).hide();
    }
    AppController.hideDescrBar = hideDescrBar;
    function setSidebarInformation(tag, name, urlImage, description) {
        $("#descr-name").html(name);
        $("#descr-img").hide();
        $("#descr-img").attr('src', '');
        if (!description) {
            description = "";
        }
        $("#descr-details").html(description);
        if (urlImage) {
            $("#descr-img").attr('src', urlImage);
            $("#descr-img").show();
        }
        else if (["places", "patrimony"].indexOf(tag) >= 0) {
            getImage(name);
        }
    }
    AppController.setSidebarInformation = setSidebarInformation;
    function getImage(query) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var STATE_DONE = 4;
            var STATUS_SUCCESS = 200;
            if (this.readyState == STATE_DONE && this.status == STATUS_SUCCESS) {
                var jsonResponse = JSON.parse(this.responseText);
                if (jsonResponse.items) {
                    $("#descr-img").show();
                    $("#descr-img").attr('src', jsonResponse.items["0"].link);
                }
            }
        };
        var searchURL = "https://www.googleapis.com/customsearch/v1?&num=1&safe=high&searchType=image&imgType=photo&fileType=jpg&alt=json"
            + '&cx=006833291377027891987:fukykbj4kpg'
            + '&key=AIzaSyBWZs1YiURy-kF42Vmb6n2kktPiEC09bxU'
            + "&q=" + query;
        xhttp.open("GET", searchURL, true);
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