//when the jQuery Mobile page has loaded
$(document).on('pageshow', '#pageone', onLoad);

var map;
var markers = [];
var markPosition = [];
var m=0;

function onLoad() {
    onDeviceReady()
    initMap();
}

// Initialise device / HTML hooks
function onDeviceReady() {
    // Set map size dynamically
    $('#content').height(getRealContentHeight());

    
    
    // Button listeners
    $('#btnhere').on("click", function () {
        $("[data-role=panel]").panel("close");
        getPosition();
    });
    
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
        //clearPathDialog();
    });
    
    $('#deleteM').on("click",function(){
        $("[data-role=panel]").panel("close");
        deleteMarkers();
        //deleteMarkersDialog();
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
     console.log("addMarker" )
    var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        markers[m] = marker;
        markPosition[m] = location;
        console.log("markPosition:"+markPosition[m]);
        m++;
      }

// Sets the map on all markers in the array.
function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
        console.log("deleteMarkers")
    
        clearMarkers();
        markers = [];
        markPosition = [];
        m = 0;
      }

 // Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
        setMapOnAll(null);
      }


function deleteMarkersDialog() {

	navigator.notification.confirm(
    	'Do you want to delete markers?',// message
        deleteMarkersDismissed,         // callback
        'Confirm',          // title
        ['OK', 'Cancel']                  // buttons
    );

}

function deleteMarkersDismissed(buttonIndex) {
	
	if(buttonIndex==1) {
        deleteMarkers();
        
        new Toast({content: "Markers are deleted.", duration: 3000});
    }
   	else if(buttonIndex==2) 
        $("[data-role=panel]").panel("close");

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
    
     console.log("a " + markPosition)
    
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
   
    
    console.log("b " + markPosition[0])
    
 if(markPosition.length!=0){  
   var a = [];
   var b = [];
   var c = Math.abs(la);
   var d = Math.abs(lo);
   var e = [];
   var f = [];
   var g = [];
   var x; 
    for(x=0;x<markPosition.length;x++){
        
         console.log("c " + markPosition[x].lat());
        
        
       a[x] = Math.abs(markPosition[x].lat());
       b[x] = Math.abs(markPosition[x].lng());
       e[x] = (a[x]-c)*(a[x]-c);
       f[x] = (b[x]-d)*(b[x]-d);
       g[x] = Math.sqrt(e[x]+f[x]); 
        
       console.log("distance:"+g[x]);
        
        if(g[x]<0.0005){
          createNotification();
        } 
    }  
    x=0;
    a=[];
    b=[];
    e=[];
    f=[];
    g=[];
 }
    
    
    
    
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


function clearPathDialog() {


      
	navigator.notification.confirm(
    	'Do you want to clear the path?',// message
        clearPathDismissed,         // callback
        'Confirm',          // title
        ['OK', 'Cancel']                  // buttons
    );

}

function clearPathDismissed(buttonIndex) {
	
	if(buttonIndex==1) {
        clearTrack();
        
        new Toast({content: "Track path is cleared.", duration: 3000});
    }
   	else if(buttonIndex==2) 
        $("[data-role=panel]").panel("close");

}

//called if the position is not obtained correctly
function failTrack(error) {

	console.log("The position is not obtained correctly.");
	
}


function createNotification() {
        		
	//
    //generate a time to post notification
    //
    var currentTime = new Date().getTime(); //current time
    var notificationTime = new Date(currentTime + 1000); //delayed time  - add 1 second
    			
    //
    //setup notification
    //
    
    cordova.plugins.notification.local.schedule({ 
    	id: 		1,
        title: 		"Notification",
        message: 	"You has reached the point you set",
        date: 		notificationTime, 
        badge: 		notification_count++
   	});
    
}

