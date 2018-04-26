/*  $(document).on("deviceready", function() {
         alert("deviceready");
        checkConnection();
    }, false);*/


//when the jQuery Mobile page has loaded
$(document).on('pageshow', '#pageone', onLoad);

var map;

//the markers set by users
var markers = [];

//store markers'position set by users
var markPosition = [];

// the number of markers
var m=0;



function onLoad() {
    
   // alert("onLoad");
    console.log("onLoad");
    
    //initialize device
    onDeviceReady();
    
    //initialize map
    initMap();
       
    
}

// Initialize device / HTML hooks
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
        
        //change the text of footer to ON
        $('#trackText').text("ON");
        startTrack();
    });
    $('#stop').on("click", function () {
        $("[data-role=panel]").panel("close");
        
        //change the text of footer to OFF
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

//check network connection, if no internet, create a toast message
function checkConnection() {
    
   // alert("checkConnection");
    
    console.log("checkConnection");
    
    var networkState = navigator.connection.type;
    console.log(networkState);
    
    //alert(networkState);
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
 
  if (networkState == "none")
        {
            //alert('No network connection');
            new Toast({content: "Sorry, no network connection", duration: 10000});
        }
    
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
       var styleControl = document.getElementById('style-selector-control');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);

        // Set the map's style to the initial value of the selector.
        var styleSelector = document.getElementById('style-selector');
        map.setOptions({styles: styles[styleSelector.value]});

        // Apply new JSON when the user selects a different style.
        styleSelector.addEventListener('change', function() {
          map.setOptions({styles: styles[styleSelector.value]});
        });
    
}



// Adds a marker to the map and push to the array.
function addMarker(location) {
     console.log("addMarker" )
    var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        markers[m] = marker;
    
    //store markers'position in the array markPosition 
        markPosition[m] = location;
        console.log("markPosition:"+markPosition[m]);
    
    //count the number of markers
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

// a dialog of confirmation of deleting markers 
function deleteMarkersDialog() {

	navigator.notification.confirm(
    	'Do you want to delete markers?',// message
        deleteMarkersDismissed,         // callback
        'Confirm',          // title
        ['OK', 'Cancel']                  // buttons
    );

}


//define the operation of delecting markers
function deleteMarkersDismissed(buttonIndex) {
	
    //when users choose OK
	if(buttonIndex==1) {
        
        //delete markers
        deleteMarkers();
        
        //create a toast message to tell users markers have been deleted
        new Toast({content: "Markers are deleted.", duration: 3000});
    }
    
    //when users choose Cancel
   	else if(buttonIndex==2) 
        
        //close the panel
        $("[data-role=panel]").panel("close");

}





//Call this function when you want to get the current position
function getPosition() {
    
    //checeking network connection before getting current position
    checkConnection();  
    
    //determine the process of getting current position when it success and fail
    navigator.geolocation.getCurrentPosition(successPosition, failPosition);
    
}


//called when the position is successfully determined
function successPosition(position) {
    var long = position.coords.longitude;
    var lat = position.coords.latitude;
    var current = new google.maps.LatLng(lat, long);
    setloc(current, 17);

}

//called when the position is failed determined
function failPosition(err) {
    alert('ERROR(' + err.code + '): ' + err.message);
    console.warn('ERROR(' + err.code + '): ' + err.message);
}


//set location by location parameter and zoom
function setloc(loc, zoom) {
    map.setCenter(loc);
    map.setZoom(zoom);
}



<!--Tracking-->

//watchID for tracking
var watchID;

//the number of saved positions
var i=0;

//the arrey to put saved positions
var trackPlanCoordinates=[];

//the markers of tracking postion, and they are not set on map
var markTrack;


//the arrey to put track path
var trackPath=[];

//location options of tracking
var locationOptions = { 
	maximumAge: 10000, 
	timeout: 6000, 
	enableHighAccuracy: true
};

//Start track and set watchID
function startTrack(){
    
    
    //call updateTrack when it success, call failTrack when it failed, and set location options
    watchID = navigator.geolocation.watchPosition(updateTrack,failTrack,locationOptions);
     new Toast({content: "Start tracking", duration: 3000});
    
}


//update tracking
function updateTrack(position){
    
    //check network before update tracking
    checkConnection();
   
    console.log("tracking...");
    console.log("a " + markPosition)
    
    //get current position' longitude and latitude
    var lo = position.coords.longitude;
    var la = position.coords.latitude;
    
    //set current location
    var tracking = new google.maps.LatLng(la, lo);
    setloc(tracking, 17);
    
    //create a marker for current location
   /* markTrack = new google.maps.Marker({
        position: tracking,
        
    });*/
    

    //store current location's latitude and longitude to an array
    trackPlanCoordinates[i]={lat:la,lng:lo}
    console.log(trackPlanCoordinates);
    
    //create tracking path by the saved location and store it to the trackPath array
    trackPath[i] = new google.maps.Polyline({
    path: trackPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 15
  });
    
    //set the trackPath to map
  trackPath[i].setMap(map);
    
  console.log(i);
    
    //count the number of stored position and track path
  i++;
    console.log("b " + markPosition[0])
    
    
//when users reach the markers'positions they set, give them information
//when the number of stored markers is bigger than 0
if(markPosition.length!=0){  
    
   //absolute value of the stored markers' latitude
   var a = [];
    
    //absolute value of the stored markers' longitude
   var b = [];
    
    //absolute value of current latitude
   var c = Math.abs(la);
    
    //absolute value of current longitude
   var d = Math.abs(lo);
    
    //the square of a 
   var e = [];
    
    //the squre of b
   var f = [];
    
    //the distance between users' current position and stored markers
   var g = [];
    
    //the number of the compared times
   var x; 
    
    //comparing current potion with the stored markers' postions
    for(x=0;x<markPosition.length;x++){
         console.log("c " + markPosition[x]);
        
        //calculate the distance between users' current position and stored markers
       a[x] = Math.abs(markPosition[x].lat());
       b[x] = Math.abs(markPosition[x].lng());
       e[x] = (a[x]-c)*(a[x]-c);
       f[x] = (b[x]-d)*(b[x]-d);
       g[x] = Math.sqrt(e[x]+f[x]); 
       console.log("distance:"+g[x]);
        
        //if the distance is less than 0.005, create vibration and a toast message
        if(g[x]<0.0005){
            
            navigator.vibrate(6000);
            new Toast({content: "You has reached the point you set.", duration: 3000});
        // alert( "You has reached the point you set");
           
        } 
    }  
    
    //initialize the parameters used for calculating distance
    x=0;
    a=[];
    b=[];
    e=[];
    f=[];
    g=[];
 }
    
    
    
    
}

//Stop tracking
function stopTrack() {
    
    //clear watchID and give a toast messsage
	navigator.geolocation.clearWatch(watchID);
    console.log("stop tracking");
    new Toast({content: "Stop tracking", duration: 3000});
}


//clear all the stored track path from map
 function clearTrack() {
     
    var n;
     
    for(n=0;n<i;n++){
        
    trackPath[n].setMap(null);
        
    }
    
  
     //initialize the parameters of track path
    trackPlanCoordinates=[];
    i=0;
     
    console.log("track path was cleared.");
   
     
 }

// a dialog for comfirming clear track path
function clearPathDialog() {

	navigator.notification.confirm(
    	'Do you want to clear the path?',// message
        clearPathDismissed,         // callback
        'Confirm',          // title
        ['OK', 'Cancel']                  // buttons
    );
}


//define the operation of clearing track path
function clearPathDismissed(buttonIndex) {
	
    //when users choose OK
	if(buttonIndex==1) {
        //clear track path
        clearTrack();
        //create toast message
        new Toast({content: "Track path is cleared.", duration: 3000});
    }
    
    //when users choose Cancel, close the panel
   	else if(buttonIndex==2) 
        $("[data-role=panel]").panel("close");

}

//called if the position is not obtained correctly
function failTrack(error) {
    
	console.log("The position is not obtained correctly.");
	
}




//Map's styles
 var styles = {
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

