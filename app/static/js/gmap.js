// $(function() {
var map;
var monumentMarkers = [];
var lieuMarkers = [];
var patrimoniauxMarkers = [];

function initMap() {
    console.log("init gmap");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.5016889, lng: -73.56725599999999},
        zoom: 14
    });
}

// Adds a marker to the map.
function addMarker(location, map, name, urlImage, description) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: name.charAt(0),
        map: map
    });
    marker.addListener('click', function () {
        setSidebarInformation(name, urlImage, description);

    });
    return marker;
}

function setSidebarInformation(name, urlImage, description) {
    document.getElementById("sidebar-name").innerHTML = name;
    if(urlImage){
        document.getElementById("sidebar-img").src = urlImage;
    }
    document.getElementById("sidebar-description").innerHTML = description;
    // window.alert(name+""+urlImage);
}

require(['./static/js/dataHandler.js'], function (dataHandler) {
    dataHandler.getMonument(function (data) {
        for (var i = 0; i < data.length; i++) {
            monumentMarkers.push(addMarker({lat: data[i].LAT, lng: data[i].LONG}, map, data[i].NOM));
        }
    });
    dataHandler.getLieuxCulturel(function (data) {
        for (var i = 0; i < data.length; i++) {
            lieuMarkers.push(addMarker({lat: parseFloat(data[i].FIELD11), lng: parseFloat(data[i].FIELD10)}, map, data[i].FIELD3,null,data[i].FIELD12));
        }
    });
    dataHandler.getSitePatrimoniaux(function (data) {
        for (var i = 1; i <data.length; i++) {
            patrimoniauxMarkers.push(addMarker({lat: parseFloat(data[i].FIELD11), lng: parseFloat(data[i].FIELD12)}, map, data[i].FIELD1,null,data[i].FIELD4));
        }
    });
});

//ex hideMarker(monumentMarkers)
function hideMarker(name) {
    setMapOnAll(null, name)
}

function showMonument(name){
    setMapOnAll(map, name)
}

initMap();
