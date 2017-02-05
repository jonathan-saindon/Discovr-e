var map;
function initMap() {
    console.log("hola123123");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
   // addMarker({ lat: 12.97, lng: 77.59 }, map);


}

// Adds a marker to the map.
function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
}


// $(function() {
    initMap();
// });
// google.maps.event.addDomListener(window, 'load', initMap);