//when the jQuery Mobile page has loaded
$(document).on('pageshow', '#pageone', onLoad);

var map;
var markers = [];
var markPosition = [];
var m=0;

function onLoad() {
    alert("onLoad");
    console.log("onLoad");
    
    checkConnection();
    
    onDeviceReady();
   
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
       // clearTrack();
        clearPathDialog();
    });
    
    $('#deleteM').on("click",function(){
        $("[data-role=panel]").panel("close");
        //deleteMarkers();
        deleteMarkersDialog();
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

function checkConnection() {
    
   // alert("checkConnection");
    
    console.log("checkConnection");
    
    
    
    var networkState = navigator.connection.type;
    
    console.log(networkState);
    
    alert(networkState);
   /* var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
 
    alert('Connection type: ' + states[networkState]);*/
 
  /* if (networkState == "none")
        {
            alert('No network connection');
            //new Toast({content: "Sorry, no network connection", duration: 10000});
        }*/
    
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
    
    
    
    // Add a style-selector control to the map.
    /*    var styleControl = document.getElementById('style-selector-control');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);

        // Set the map's style to the initial value of the selector.
        var styleSelector = document.getElementById('style-selector');
        map.setOptions({styles: styles[styleSelector.value]});

        // Apply new JSON when the user selects a different style.
        styleSelector.addEventListener('change', function() {
          map.setOptions({styles: styles[styleSelector.value]});
        });*/
    
    
}



 /*var styles = {
        default: null,
        silver: [
          {
            elementType: 'geometry',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#bdbdbd'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#ffffff'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#dadada'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#c9c9c9'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          }
        ],

        night: [
          {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          }
        ],

        retro: [
          {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{color: '#c9b2a6'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{color: '#dcd2be'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#ae9e90'}]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#93817c'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{color: '#a5b076'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#447530'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#f5f1e6'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{color: '#fdfcf8'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#f8c967'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#e9bc62'}]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{color: '#e98d58'}]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{color: '#db8555'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#806b63'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{color: '#8f7d77'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#ebe3cd'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{color: '#b9d3c2'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#92998d'}]
          }
        ],

        hiding: [
          {
            featureType: 'poi.business',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          }
        ]
      };


*/




// Adds a marker to the map and push to the array.
function addMarker(location) {
     console.log("addMarker" )
    var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        markers[m] = marker;
       // markPosition[m] = { lat:location.lat(), lng:location.lng(), notified:no };
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
    
    checkConnection();  
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
        
         console.log("c " + markPosition[x]);
        
        
       a[x] = Math.abs(markPosition[x].lat());
       b[x] = Math.abs(markPosition[x].lng());
       e[x] = (a[x]-c)*(a[x]-c);
       f[x] = (b[x]-d)*(b[x]-d);
       g[x] = Math.sqrt(e[x]+f[x]); 
        
       console.log("distance:"+g[x]);
        
        if(g[x]<0.005){
         createVibrate();
        // alert( "You has reached the point you set");
           
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
    
    // checkConnection();

	console.log("The position is not obtained correctly.");
	
}


function createVibrate() {
        		
  navigator.vibrate(6000);
  new Toast({content: "You has reached the point you set.", duration: 3000});
    
}

