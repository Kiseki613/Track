//when the jQuery Mobile page has loaded
$(document).on('pageshow', '#pageone', onLoad);

var map;

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

    console.log("initMap");
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
//track path
var trackPath;
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
    alert("tracking..");
    var lo = position.coords.longitude;
    var la = position.coords.latitude;
    var tracking = new google.maps.LatLng(la, lo);
    setloc(tracking, 17);
    var markTrack = new google.maps.Marker({
        position: tracking,
    });
    
    /*if(i==0){
    markTrack.setMap(map);
    }*/
    
    markTrack.setMap(map);
    
    
    trackPlanCoordinates[i]={lat:la,lng:lo}
        console.log(i);
        i++;
       
    console.log(trackPlanCoordinates);
    trackPath = new google.maps.Polyline({
    path: trackPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 15
  });
  trackPath.setMap(map);
  
}


function stopTrack() {
	navigator.geolocation.clearWatch(watchID);
    
    console.log("stop tracking");
    alert("stop tracking");
}


 function clearTrack() {
     
    trackPath.setMap(null);
    trackPlanCoordinates=[];
    i=0;
    console.log("track path was cleared.");
    alert("track path was cleared.");
     
 }

//called if the position is not obtained correctly
function failTrack(error) {
    alert("cannot get your position");

	console.log("The position is not obtained correctly.");
	
}


