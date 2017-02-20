module AppController {

    export function parseParameters() : void {
        let paramDist = parseFloat(getParamValue('dist'));
        if (paramDist) MapController.setDistance(paramDist);

        let paramLat = parseFloat(getParamValue('lat'));
        let paramLng = parseFloat(getParamValue('lng'));
        if (paramLat && paramLng) this.createUserMarker(paramLat, paramLng);
    }

    export function getParamValue(name: string) {
        let url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

        let rule = "[\\?&]" + name + "=([^&#]*)";
        let regex = new RegExp(rule);
        let results = regex.exec(url);

        return results == null ? null : results[1];
    }

    export function toggleBtn(key: string, obj: HTMLBodyElement) {
        let classname = obj.className.split(" ")[1];
        let enabled = classname && classname == "disabled";
        obj.className = enabled ? "sidebarBtn enable" : "sidebarBtn disabled";
        MapController.toggleMarkers(key, enabled);
    }

    export function showDescrBar() {
        $('#descrBar').show().animate({right: 0});
    }

    export function hideDescrBar() {
        $('#descrBar').animate({right: -355}).hide();
    }

    export function setSidebarInformation(name: string, urlImage: string, description: string): void {
        $("#descr-name").html(name);

        if (!description) {
            description = "";
        }
        $("#descr-details").html(description);

        if (urlImage) {
            $("#descr-img").attr('src', urlImage);
            $("#descr-img").addEventListener('click', function () {
                //$("#overlay").show();
                //$("#overlay-img").attr("src", urlImage);
            });
        } else {
            AppController.getImage(name);
        }
    }

    export function getImage(query: string) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonResponse = JSON.parse(this.responseText);
                let url = "";
                if (jsonResponse.items) {
                    url = jsonResponse.items[0];
                }
                $("#descr-img").attr('src', url);
            }
        };
        xhttp.open("GET", "https://www.googleapis.com/customsearch/v1?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY&cx=015911799653155271639%3Ayxc2mwmxfwy&searchType=image&fileType=jpg&q=" + query + " Montreal", true);
        xhttp.send();
    }


}