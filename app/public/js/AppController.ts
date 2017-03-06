module AppController {
    export function parseParameters() : void {
        let paramDist = parseFloat(getParamValue('dist'));
        if (paramDist) MapController.setDistance(paramDist);

        let paramLat = parseFloat(getParamValue('lat'));
        let paramLng = parseFloat(getParamValue('lng'));
        if (paramLat && paramLng)MapController.setUserMarkerAt({ paramLat, paramLng });
    }

    function getParamValue(name: string) {
        let url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

        let rule = "[\\?&]" + name + "=([^&#]*)";
        let regex = new RegExp(rule);
        let results = regex.exec(url);

        return results == null ? null : results[1];
    }

    export function toggleBtn(key: string, obj: HTMLBodyElement) {
        let classname = obj.className.split(" ")[2];
        let enabled = classname && classname == "disabled";
        obj.className = enabled ? "sidebarBtn tooltip enable" : "sidebarBtn tooltip disabled";
        MapController.toggleMarkers(key, enabled);
    }

    export function showDescrBar() {
        $('#descrBar').show().animate({right: 0});
    }

    export function closeMarker() {
        this.hideDescrBar();
        MapController.getSelectedMarker().setAnimation(null);
    }

    export function hideDescrBar() {
        $('#descrBar').animate({right: -355}).hide();
    }

    export function setSidebarInformation(tag: string, name: string, urlImage: string, description: string): void {
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
            //$("#descr-img").addEventListener('click', function () {
                //$("#overlay").show();
                //$("#overlay-img").attr("src", urlImage);
            //});
        } else if (["places", "patrimony"].indexOf(tag) >= 0) {
            getImage(name);
        }
    }

    function getImage(query: string) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            let STATE_DONE = 4;
            let STATUS_SUCCESS = 200;
            if (this.readyState == STATE_DONE && this.status == STATUS_SUCCESS) {
                let jsonResponse = JSON.parse(this.responseText);
                if (jsonResponse.items) {
                    $("#descr-img").show();
                    $("#descr-img").attr('src', jsonResponse.items["0"].link);
                }
            }
        };
        let searchURL = "https://www.googleapis.com/customsearch/v1?&num=1&safe=high&searchType=image&imgType=photo&fileType=jpg&alt=json"
        + '&cx=006833291377027891987:fukykbj4kpg' // Custom search engine ID
        + '&key=AIzaSyBWZs1YiURy-kF42Vmb6n2kktPiEC09bxU' // Google API key
        + "&q=" + query; // Query search terms
        xhttp.open("GET", searchURL, true);
        xhttp.send();
    }

    export function searchAddress() {
        let address = $("#address")[0].value;
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function (results: Array<google.maps.Geolocation>, status: string) {
            if (status == google.maps.GeocoderStatus.OK) {
                MapController.setUserMarkerAt(results[0].geometry.location);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    export function onDistanceChange() : void {
        let distance = $("#distance")[0].value;
        MapController.setDistance(distance);
        MapController.showNearUser();
    }
}