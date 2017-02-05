// $(function() {
var map;
var monumentMarkers = [];
var lieuMarkers = [];
var patrimoniauxMarkers = [];
const distance = 5;
var dictionaire = [];
var lat;
var lng;

function initMap() {
    console.log("init gmap");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.5016889, lng: -73.56725599999999},
        zoom: 14
    });
    loadData();
    setTimeout(function () {
        dictionaire = [monumentMarkers, lieuMarkers, patrimoniauxMarkers];
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

function showMonument() {
    setMapOnAll(map, monumentMarkers)
}
function showLieu() {
    setMapOnAll(map, lieuMarkers)
}
function showPatrimoniaux() {
    setMapOnAll(map, patrimoniauxMarkers)
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
    let allData = [];
    allData = allData.concat(monumentMarkers, lieuMarkers, patrimoniauxMarkers);
    //console.log("houla" + tab);

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
}
