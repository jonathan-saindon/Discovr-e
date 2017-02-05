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
                xhttp.open("GET", "./data/monument", true);
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
            xhttp.open("GET", "./data/lieuCulturel", true);
            xhttp.send();
        }
    };
});