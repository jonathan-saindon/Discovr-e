define(function () {
    return {
        getMonument: function (callback) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var jsonResponse = JSON.parse(this.responseText);
                        callback(jsonResponse);
                    }
                };
                xhttp.open("GET", "./static/data/monument.json", true);
                xhttp.send();
        },
        getLieuxCulturel: function (callback) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var jsonResponse = JSON.parse(this.responseText);
                    callback(jsonResponse);
                }
            };
            xhttp.open("GET", "./static//data/lieuCulturel.json", true);
            xhttp.send();
        },
        getSitePatrimoniaux: function (callback) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var jsonResponse = JSON.parse(this.responseText);
                    callback(jsonResponse);
                }
            };
            xhttp.open("GET", "./static/data/SitePatrimoniaux.json", true);
            xhttp.send();
        },
        getMuralesSubventionnees: function (callback) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var jsonResponse = JSON.parse(this.responseText);
                    callback(jsonResponse.features);
                }
            };
            xhttp.open("GET", "./static/data/muralesSubventionnees.json", true);
            xhttp.send();
        },
    };
});