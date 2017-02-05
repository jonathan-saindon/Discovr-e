var map;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
function initMap() {
    console.log("init gmap");
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.5016889, lng: -73.56725599999999},
        zoom: 14
    });
   addMarker({ lat: 45.5016889, lng: -73.56725599999999 }, map, "Musee de truc",
       "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mus%C3%A9e_Goya_6.jpg/250px-Mus%C3%A9e_Goya_6.jpg",
   "description super awesome");


}

// Adds a marker to the map.
function addMarker(location, map, name, urlImage, description) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: name,
        map: map
    });
    marker.addListener('click', function() {
        setSidebarInformation(name, urlImage, description);

    });
}


function setSidebarInformation(name, urlImage, description) {
    document.getElementById("sidebar-name").innerHTML = name;
    document.getElementById("sidebar-img").src = urlImage;
    document.getElementById("sidebar-description").innerHTML = description;
    // window.alert(name+""+urlImage);
}


var dataHandler = require(['./static/js/dataHandler.js'], function(dataHandler){
    console.log(dataHandler);
    //for each
});
// console.log("hi"+dataHandler.getHello());
// console.log(user);

// console.log(result);
// $(function() {
initMap();
// });
// google.maps.event.addDomListener(window, 'load', initMap);