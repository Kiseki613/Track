//when the jQuery Mobile page has loaded
$(document).on('pageshow', '#pageone', onLoad);

var map;
var markers = [];

function onLoad() {
    onDeviceReady()
    initMap();
}

// Initialise device / HTML hooks
function onDeviceReady() {
    // Set map size dynamically
    $('#content').height(getRealContentHeight());

    // Button listeners
    $('#start').on("click", function () {
        $("[data-role=panel]").panel("close");
        $('#trackText').text("ON");
        startTrack();
    });
    $('#stop').on("click", function () {
        $("[data-role=panel]").panel("close");
        $('#trackText').text("OFF");
        stopTrack();
    });
    $('#clear').on("click", function () {
        $("[data-role=panel]").panel("close");
        clearTrack();
    });

    $('#btnhere').on("click", function () {
        $("[data-role=panel]").panel("close");
        getPosition();
    });

    
    console.log("onDeviceReady");
}

// Get element sizes and dynamically calc height available for map
// Note - (sometimes) works in chrome dev tools, but ensure a device is selected
function getRealContentHeight() {
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();

    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    }
    return content_height;
}

// Initialise map
function initMap() {
    // Set initial zoom for consistency
    var initZoomLevel = 15;
    var worc = {lat:52.193636, lng:-2.221575};
    // Create map
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: initZoomLevel,
        center: worc,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    
    
   // This event listener will call addMarker() when the map is clicked.
    map.addListener('click', function(event) {
          addMarker(event.latLng);
        });


    console.log("initMap");
}

// Adds a marker to the map and push to the array.
      function addMarker(location) {
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        markers.push(marker);
      }

// Sets the map on all markers in the array.
function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
        clearMarkers();
        markers = [];
      }

 // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }



//Call this function when you want to get the current position
function getPosition() {
    navigator.geolocation.getCurrentPosition(successPosition, failPosition);
    
}

//called when the position is successfully determined
function successPosition(position) {
    var long = position.coords.longitude;
    var lat = position.coords.latitude;
    var current = new google.maps.LatLng(lat, long);
    setloc(current, 17);

}

function failPosition(err) {
    alert('ERROR(' + err.code + '): ' + err.message);
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

function setloc(loc, zoom) {
    map.setCenter(loc);
    map.setZoom(zoom);
}


<!--Tracking-->

var watchID;

//the number of saved positions
var i=0;
//the arrey to put saved positions
var trackPlanCoordinates=[];
var markTrack;
//track path
var trackPath=[];
var locationOptions = { 
	maximumAge: 10000, 
	timeout: 6000, 
	enableHighAccuracy: true
};


function startTrack(){
    
    watchID = navigator.geolocation.watchPosition(updateTrack,failTrack,locationOptions);
    
}


function updateTrack(position){
    console.log("tracking...");
    var lo = position.coords.longitude;
    var la = position.coords.latitude;
    var tracking = new google.maps.LatLng(la, lo);
    setloc(tracking, 17);
    markTrack = new google.maps.Marker({
        position: tracking,
    });
    

    
    trackPlanCoordinates[i]={lat:la,lng:lo}

       
    console.log(trackPlanCoordinates);
    trackPath[i] = new google.maps.Polyline({
    path: trackPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 15
  });
  trackPath[i].setMap(map);
    
  console.log(i);
  i++;
}


function stopTrack() {
	navigator.geolocation.clearWatch(watchID);
    
    console.log("stop tracking");
    alert("stop tracking");
}


 function clearTrack() {
     
    var n;
     
    for(n=0;n<i;n++){
        
    trackPath[n].setMap(null);
        
    }
    
  
     
    trackPlanCoordinates=[];
    i=0;
     
    console.log("track path was cleared.");
   
     
 }

//called if the position is not obtained correctly
function failTrack(error) {

	console.log("The position is not obtained correctly.");
	
}


