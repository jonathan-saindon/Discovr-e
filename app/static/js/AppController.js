var AppController;
(function (AppController) {
    function parseParameters() {
        var paramDist = parseFloat(getParamValue('dist'));
        if (paramDist)
            MapController.setDistance(paramDist);
        var paramLat = parseFloat(getParamValue('lat'));
        var paramLng = parseFloat(getParamValue('lng'));
        if (paramLat && paramLng)
            this.createUserMarker(paramLat, paramLng);
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
    AppController.getParamValue = getParamValue;
    function toggleBtn(key, obj) {
        var classname = obj.className.split(" ")[1];
        var enabled = classname && classname == "disabled";
        obj.className = enabled ? "sidebarBtn enable" : "sidebarBtn disabled";
        MapController.toggleMarkers(key, enabled);
    }
    AppController.toggleBtn = toggleBtn;
    function showDescrBar() {
        $('#descrBar').show().animate({ right: 0 });
    }
    AppController.showDescrBar = showDescrBar;
    function hideDescrBar() {
        $('#descrBar').animate({ right: -355 }).hide();
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
            $("#descr-img").addEventListener('click', function () {
            });
        }
        else {
            AppController.getImage(name);
        }
    }
    AppController.setSidebarInformation = setSidebarInformation;
    function getImage(query) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                var url = "";
                if (jsonResponse.items) {
                    url = jsonResponse.items[0];
                }
                $("#descr-img").attr('src', url);
            }
        };
        xhttp.open("GET", "https://www.googleapis.com/customsearch/v1?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY&cx=015911799653155271639%3Ayxc2mwmxfwy&searchType=image&fileType=jpg&q=" + query + " Montreal", true);
        xhttp.send();
    }
    AppController.getImage = getImage;
})(AppController || (AppController = {}));
//# sourceMappingURL=AppController.js.map