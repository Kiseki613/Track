//when the jQuery Mobile page has loaded
$(document).on('pageshow', '#pageone', onLoad);

var map;
var locHome, locCathedral, locUni, locBoston;
var markHome, markCathedral, markUni, markBoston;

function onLoad() {
    onDeviceReady()
    initMap();
}

// Initialise device / HTML hooks
function onDeviceReady() {
    // Set map size dynamically
    $('#content').height(getRealContentHeight());

    // Button listeners
    $('#btnhome').on("click", function () {
        $("[data-role=panel]").panel("close");
        setloc(locHome, 16);
    });
    $('#btncathedral').on("click", function () {
        $("[data-role=panel]").panel("close");
        setloc(locCathedral, 17);
    });
    $('#btnuni').on("click", function () {
        $("[data-role=panel]").panel("close");
        setloc(locUni, 16);
    });
    $('#btnboston').on("click", function () {
        $("[data-role=panel]").panel("close");
        setloc(locBoston, 12);
    });

    $('#btnhere').on("click", function () {
        $("[data-role=panel]").panel("close");
        getPosition();
    });

    // LIVE MOITORING - toggle switch to turn Geolocation.watchPosition() on/off
    $("#flip-loc").on("change", function () {
        $("[data-role=panel]").panel("close");
        handleToggle();
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

    // MAP - Create location LatLng's
    locHome = new google.maps.LatLng(52.237314, -2.357403);
    locCathedral = new google.maps.LatLng(52.188479, -2.221094);
    locUni = new google.maps.LatLng(52.198094, -2.242767);
    locBoston = new google.maps.LatLng(42.360082, -71.058880);

    // MAP - Create markers
    markHome = new google.maps.Marker({
        position: locHome,
        title: 'Home'
    });
    markCathedral = new google.maps.Marker({
        position: locCathedral,
        title: 'Cathedral'
    });
    markUni = new google.maps.Marker({
        position: locUni,
        title: 'St Johns Campus'
    });
    markBoston = new google.maps.Marker({
        position: locBoston,
        title: 'Boston'
    });

    // Create map
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: initZoomLevel,
        center: locHome,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // MAP - Place markers
    markHome.setMap(map);
    markCathedral.setMap(map);
    markUni.setMap(map);
    markBoston.setMap(map);

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

////////////// LIVE MONITORING ///////////

// watchPosition ID returned by the current geoWatch - use to .clearWatch()
var watchID;

//Respond to changes in location moitoring toggle switch
function handleToggle() {
    // if toggle true, start geoWatch, otherwise turn off
    locWatchOn = $("#flip-loc").prop("checked");
    if (locWatchOn) {
        startWatch();
    } else {
        stopWatch();
    }
}

function startWatch() {
    // Set options
    var locationOptions = {
        maximumAge: 10000,
        timeout: 6000,
        enableHighAccuracy: true
    };
    // Set geoWatch listener and save ID
    watchID = navigator.geolocation.watchPosition(success, fail); //, locationOptions);
    $('#monitorText').text("ON");
}


function stopWatch() {
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
    $('#monitorText').text("OFF");
}

function success(pos) {
    // get data
    var clong = pos.coords.longitude;
    var clat = pos.coords.latitude;
    var current = new google.maps.LatLng(clat, clong);
    // update map
    map.setCenter(current);
    // OR use setliveloc(current); and expand to perform more functions (add marker / record route etc)
}

function fail(err) {
    alert('ERROR(' + err.code + '): ' + err.message);
    console.warn('ERROR(' + err.code + '): ' + err.message);
}

function setliveloc(loc) {
    map.setCenter(loc);
}
