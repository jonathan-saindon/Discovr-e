var map;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
function initMap() {
    console.log("hola123123");
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

function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

function setSidebarInformation(name, urlImage, description) {
    document.getElementById("sidebar-name").innerHTML = name;
    document.getElementById("sidebar-img").src = urlImage;
    document.getElementById("sidebar-description").innerHTML = description;
    // window.alert(name+""+urlImage);
}

var dataHandler = require('/static/js/dataHandler.js');

var result = dataHandler.getData();
console.log(result);
// $(function() {
initMap();
// });
// google.maps.event.addDomListener(window, 'load', initMap);