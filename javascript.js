/*
Help used:
https://en.wikipedia.org/wiki/Sunrise_equation
https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
But I decided against the time expensive method of writing a huge equation in a domain I'm not familiar with

SunCalc's license allows for commercial and private use. It seems to be quite accurate and trustworthy.
https://github.com/mourner/suncalc

Same goes for tz-lookup. tz-lookup isn't necessary but I think it's better to have results in the local timezone and UTC.
https://github.com/darkskyapp/tz-lookup/

*/

// Function to calculate the sunset and sunrise times.
function calculate() {

    // Getting user input
    let date = new Date($("#date").val());
    let latitude = $("#latitude").val();
    let longitude = $("#longitude").val();

    // SunCalc
    let SC = SunCalc.getTimes(date, latitude, longitude);
    let SCsunriseUTC = SC.sunrise;
    let SCsunsetUTC = SC.sunset;

    // tz-lookup (for local time)
    let SCsunriseLCL = new Date(SCsunriseUTC.toLocaleString("en-US", {timeZone: tzlookup(latitude, longitude)}));
    let SCsunsetLCL = new Date(SCsunsetUTC.toLocaleString("en-US", {timeZone: tzlookup(latitude, longitude)}));

    // UTC and Local sunrise, sunset
    let srUTC = getTime(SCsunriseUTC, true);
    let srLCL = getTime(SCsunriseLCL, false);

    let ssUTC = getTime(SCsunsetUTC, true);
    let ssLCL = getTime(SCsunsetLCL, false);

    let dayLength = Math.round((SC.sunset - SC.sunrise) / 36000) / 100;
    if (isNaN(dayLength)) {
        // North-south, Winter-summer (from Northern hemisphere's view)
        let NS = latitude > 0;
        let WS = date.getMonth() <= 2 || date.getMonth() > 8;
        dayLength = " päike ei " + (NS === WS ? "tõuse" : "looju");
    } else if (dayLength === 1.0) {
        dayLength = dayLength + " tund"
    } else {
        dayLength = dayLength + " tundi"
    }

    $("#result").html("Päikesetõus (UTC): " + srUTC + ", Päikeseloojang (UTC): " + ssUTC +
        " Päikesetõus (kohalik): " + srLCL + ", Päikeseloojang (kohalik): " + ssLCL +
        ", Päeva pikkus: " + dayLength);

}

// Get the hours and minutes.
function getTime(date, UTC) {
    let hours, minutes;

    if (UTC) {
        minutes = date.getUTCMinutes();
        hours = date.getUTCHours();
    } else {
        minutes = date.getMinutes();
        hours = date.getHours();
    }

    if (isNaN(minutes) || isNaN(hours)) {
        return "XX:XX";
    }

    return (hours < 10 ? "0" : "") + hours.toString() + ":" + (minutes < 10 ? "0" : "") + minutes.toString();
}

// On document load, sets the date selection to today.
$(function() {
    let d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    $('#date').val(year + "-" + (month < 10 ? "0" : "") + month + "-" + day);

    // https://leafletjs.com/examples/quick-start/

    // Initialization (includes access token I got from Mapbox)
    var mymap = L.map('mapid').setView([58.38, 26.72], 6);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWxleHZpaWwiLCJhIjoiY2s5NXg2anpmMGFmMDNrbDRpemlmbnpyNCJ9.mlus4jEkWhmwMLV0zDVMxw', {
        maxZoom: 14,
        minZoom: 2,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    mymap.setMaxBounds([[-90, -180], [90, 180]]);

    let latitudeField = $("#latitude");
    let longitudeField = $("#longitude");

    // Click function
    let marker = L.marker([latitudeField.val(), longitudeField.val()]);
    marker.addTo(mymap);

    mymap.on('click', function(e) {
        marker.setLatLng(e.latlng);
        let latitude = Math.round(e.latlng.lat * 1000.0) / 1000.0;
        let longitude = Math.round(e.latlng.lng * 1000.0) / 1000.0;

        latitudeField.val(latitude);
        longitudeField.val(longitude);
    });

    // Listeners for input fields
    const updateMap = (function () {
        let latitude = latitudeField.val();
        let longitude = longitudeField.val();

        if (latitude < 90 && latitude > -90 && longitude < 180 && longitude > -180) {
            marker.setLatLng([latitude, longitude]);
            mymap.panTo([latitude, longitude]);
        }
    });

    latitudeField.on("change", () => updateMap());
    longitudeField.on("change", () => updateMap());
});