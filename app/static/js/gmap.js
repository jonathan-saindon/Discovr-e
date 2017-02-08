/* ---- VARIABLES ---- */
var map;
var monumentMarkers = [];
var lieuMarkers = [];
var patrimoniauxMarkers = [];
var muralesMarkers = [];
var distance = 5;
var dictionaire = [];
var lat;
var lng;

/* ---- FUNCTIONS ---- */
function initMap() {
    console.log("init gmap");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.5016889, lng: -73.56725599999999},
        zoom: 14
    });
    loadData();
    setTimeout(function () {
        dictionaire = [monumentMarkers, lieuMarkers, patrimoniauxMarkers];
        geoLocalisation(function(lat,lng, dist){
            showNear(lat,lng, dist);
            var icon = 'http://i.stack.imgur.com/orZ4x.png';
            addMarker({lat: lat, lng: lng}, map, "You are here", null, null, icon);
            map.setCenter({lat: lat, lng: lng});
        });
    }, 1000);
}

// Adds a marker to the map.
function addMarker(location, map, name, urlImage, description, icon) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    let marker = new google.maps.Marker({
        position: location,
        // label: name.charAt(0),
        map: map,
        icon: icon
    });
    marker.addListener('click', function () {
        setSidebarInformation(name, urlImage, description);

        if (document.getElementById("descrBar").style.display == "none") {
            showDescrBar();
        }
    });
    return marker;
}

function showDescrBar() {
    $('#descrBar').show().animate({right: 0});
}

function hideDescrBar() {
    $('#descrBar').animate({right: -355}).hide();
}

function setSidebarInformation(name, urlImage, description) {
    document.getElementById("descr-name").innerHTML = name;

    if (!description) {
        description = "";
    }
    document.getElementById("descr-details").innerHTML = description;

    if (urlImage) {
        document.getElementById("descr-img").src = urlImage;
        $("#descr-img").addEventListener('click', function() {
            $("#overlay").show();
            $("#overlay-img").attr("src", urlImage);
        });
    } else {
        getImage(name, function (url) {
            document.getElementById("descr-img").src = url;
        })
    }
}

function loadData() {
    require(['./static/js/dataHandler.js'], function (dataHandler) {
        dataHandler.getMonument(function (data) {
            for (let i = 0; i < data.length; i++) {
                monumentMarkers.push(addMarker({lat: data[i].LAT, lng: data[i].LONG}, null, data[i].NOM));
            }
        });
        dataHandler.getLieuxCulturel(function (data) {
            for (let i = 0; i < data.length; i++) {
                lieuMarkers.push(addMarker({
                    lat: parseFloat(data[i].FIELD11),
                    lng: parseFloat(data[i].FIELD10)
                }, null, data[i].FIELD3, null, data[i].FIELD12));
            }
        });
        dataHandler.getSitePatrimoniaux(function (data) {
            for (let i = 1; i < data.length; i++) {
                patrimoniauxMarkers.push(addMarker({
                    lat: parseFloat(data[i].FIELD11),
                    lng: parseFloat(data[i].FIELD12)
                }, null, data[i].FIELD1, null, data[i].FIELD4));
            }
        });
        dataHandler.getMuralesSubventionnees(function (data) {
            for (let i = 1; i < data.length; i++) {
                var properties = data[i].properties;
                muralesMarkers.push(addMarker({
                    lat: parseFloat(properties.latitude),
                    lng: parseFloat(properties.longitude)
                }, null, "Murale par " + properties.artiste, properties.image, "Année de création: " + properties.annee + "\n\nAdresse: " + properties.adresse));
            }
        });
    });
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

function hideMarker(index) {
    setMapOnAll(null, index)
}

function hideMonument() {
    setMapOnAll(null, monumentMarkers)
}

function hideLieu() {
    setMapOnAll(null, lieuMarkers)
}

function hidePatrimoniaux() {
    setMapOnAll(null, patrimoniauxMarkers)
}

function hideMurales() {
    setMapOnAll(null, muralesMarkers)
}

function showMonument() {
    setMapOnAll(map, monumentMarkers)
}

function showLieu() {
    setMapOnAll(map, lieuMarkers)
}

function showPatrimoniaux() {
    setMapOnAll(map, patrimoniauxMarkers)
}

function showMurales() {
    setMapOnAll(map, muralesMarkers)
}

function setMapOnAll(map, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (getDistanceFromLatLonInKm(lat, lng, arr[i].position.lat(), arr[i].position.lng()) < distance) {
            arr[i].setMap(map);
        } else {
            arr[i].setMap(null);
        }
    }
}

function showNear(lat, long, distance) {
    let allData = getAllData();
    for (let i = 0; i < allData.length; i++) {
        if (getDistanceFromLatLonInKm(lat, long, allData[i].position.lat(), allData[i].position.lng()) < distance) {
            allData[i].setMap(map);
        } else {
            allData[i].setMap(null);
        }
    }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function geoLocalisation(callback) {
    if (!lat) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonResponse = JSON.parse(this.responseText);
                lat = jsonResponse.location.lat;
                lng = jsonResponse.location.lng;
                callback(lat, lng, distance);
            }
        };
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
        xhttp.send();
    } else {
        callback(lat, lng, distance);
    }
}

function getImage(query, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(this.responseText);
            var url = "";
            if (jsonResponse.items) {
                url = jsonResponse.items[0];
            }
            callback(url.link);
        }
    };
    xhttp.open("GET", "https://www.googleapis.com/customsearch/v1?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY&cx=015911799653155271639%3Ayxc2mwmxfwy&searchType=image&fileType=jpg&q=" + query+ " endroit montreal", true);
    xhttp.send();
}

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

function getAllData() {
    return allData.concat(monumentMarkers, lieuMarkers, patrimoniauxMarkers, muralesMarkers);
}

function searchByName(name) {
    let allData = getAllData();
    let matches = [];
    for (let i = 0; i < allData.length; i++) {
        for (let j = 0; i < allData[i]; i++) {
            var elemName = allData[i][j];
            if (elemName == name) {
                matches.push(elemName);
            }
        }
    }
    return matches;
}

function addTooltip() {

}

/* ---- SCRIPT ---- */
$(document).tooltip();
var dist = gup('distance');
lat = parseFloat(gup('lat'));
lng = parseFloat(gup('lng'));
if (dist) {
    distance = dist;
}
