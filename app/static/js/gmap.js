// $(function() {
var map;
var monumentMarkers = [];
var lieuMarkers = [];
var patrimoniauxMarkers = [];
const distance = 5;

function initMap() {
    console.log("init gmap");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.5016889, lng: -73.56725599999999},
        zoom: 14
    });
    loadData();
    setTimeout(function(){
        geoLocalisation(showNear);
    }, 1000);
}

// Adds a marker to the map.
function addMarker(location, map, name, urlImage, description) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    let marker = new google.maps.Marker({
        position: location,
        label: name.charAt(0),
        map: map
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
    });
}


function toggleBtn(name, classnames) {
    //console.log(name, classnames);
    var classname = classnames.split(" ")[1];
    if (classname && classname == "disabled") {
        showMonument(name);
    } else {
        hideMarker(name);
    }
}

function hideMarker(name) {
    setMapOnAll(null, name)
}

function showMarker(name) {
    setMapOnAll(map, name)
}

function setMapOnAll(map, name) {
    for (let i = 0; i < name.length; i++) {
        name[i].setMap(map);
    }
}

function showNear(lat, long, distance) {
    let tab = monumentMarkers.splice(0).concat(lieuMarkers, patrimoniauxMarkers);
    //this might bug by making monumentMarkertooBig
    //console.log("houla" + tab);

    for (let i = 0; i < tab.length; i++) {
        if (getDistanceFromLatLonInKm(lat, long, tab[i].position.lat(), tab[i].position.lng()) < distance) {
            tab[i].setMap(map);
        } else {
            tab[i].setMap(null);
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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonResponse = JSON.parse(this.responseText);
            callback(jsonResponse.location.lat, jsonResponse.location.lng, distance);
        }
    };
    xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCfSD7mNOrtMaG7APY2RxYQr8klfpXi4HY", true);
    xhttp.send();
}
