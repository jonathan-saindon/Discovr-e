var map;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
function initMap() {
    console.log("hola123123");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.5016889, lng: -73.56725599999999},
        zoom: 14
    });
   addMarker({ lat: 45.5016889, lng: -73.56725599999999 }, map);


}

// Adds a marker to the map.
function addMarker(location, map, name) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: name,
        map: map
    });
}



// $(function() {
initMap();
// });
// google.maps.event.addDomListener(window, 'load', initMap);