/*
Help used:
https://en.wikipedia.org/wiki/Sunrise_equation
https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
But I decided against the time expensive method of writing a huge equation in a domain I'm not familiar with

SunCalc's license allows for commercial and private use. It seems to be quite accurate and trustworthy.
https://github.com/mourner/suncalc

Same goes for tz-lookup. tz-lookup isn't necessary but I think it's better to have results in the local timezone and UTC.
https://github.com/darkskyapp/tz-lookup/

Using leaflet as suggested under "lisalugemist"
https://leafletjs.com/examples/quick-start/

Using Chart.js for charts
https://www.chartjs.org/docs/latest/axes/cartesian/linear.html

https://stackoverflow.com/questions/3674539/incrementing-a-date-in-javascript
https://stackoverflow.com/questions/5113374/javascript-check-if-variable-exists-is-defined-initialized
https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page
*/

// Function to calculate the sunset and sunrise times.
function calculate(date, latitude, longitude, returnOnlylength) {
    // SunCalc
    let SC = SunCalc.getTimes(date, latitude, longitude);
    let SCsunriseUTC = SC.sunrise;
    let SCsunsetUTC = SC.sunset;

    // tz-lookup (for local time)
    let SCsunriseLCL = new Date(SCsunriseUTC.toLocaleString("en-US", {timeZone: tzlookup(latitude, longitude)}));
    let SCsunsetLCL = new Date(SCsunsetUTC.toLocaleString("en-US", {timeZone: tzlookup(latitude, longitude)}));

    let dayLength = Math.round((SC.sunset - SC.sunrise) / 36000) / 100;
    if (isNaN(dayLength)) {
        // North-south, Winter-summer (from Northern hemisphere's view)
        let NS = latitude > 0;
        let WS = date.getMonth() <= 2 || date.getMonth() > 8;
        if (returnOnlylength) {
            return NS === WS ? 0.0 : 24.0;
        }
        dayLength = " päike ei " + (NS === WS ? "tõuse" : "looju");
    } else {
        if (returnOnlylength) {
            return dayLength;
        }
        dayLength = dayLength + " tund" + (dayLength === 1.0 ? "" : "i")
    }


    // UTC and Local sunrise, sunset
    let srUTC = getTime(SCsunriseUTC, true);
    let srLCL = getTime(SCsunriseLCL, false);

    let ssUTC = getTime(SCsunsetUTC, true);
    let ssLCL = getTime(SCsunsetLCL, false);

    return [srUTC, srLCL, ssUTC, ssLCL, dayLength]
}

// Function to show calculation results (map)
function calculateFromMap() {

    // Getting user input
    let date = new Date($("#date").val());
    let latitude = $("#latitude").val();
    let longitude = $("#longitude").val();

    // Calculating result
    let calculationResult = calculate(date, latitude, longitude, false);
    let srUTC = calculationResult[0];
    let srLCL = calculationResult[1];
    let ssUTC = calculationResult[2];
    let ssLCL = calculationResult[3];
    let dayLength = calculationResult[4];

    // Changing what the user sees to match.
    $("#result").html("Päikesetõus (UTC): <strong>" + srUTC + "</strong>, Päikeseloojang (UTC): <strong>"
        + ssUTC + "</strong> Päikesetõus (kohalik): <strong>" + srLCL + "</strong>, Päikeseloojang (kohalik): <strong>"
        + ssLCL + "</strong>, Päeva pikkus: <strong>" + dayLength + "</strong>");

}

// Chart initialization
let chart;

// Function to show calculation results (graph)
function calculateFromRange() {
    let fromDate = new Date($("#fromDate").val());
    let toDate = new Date($("#toDate").val());
    let latitude = $("#latitude").val();
    let longitude = $("#longitude").val();

    console.log(fromDate);
    console.log(toDate);

    let error = $("#rangeNotification");
    error.html("");

    if (toDate <= fromDate) {
        error.html("Esimene kuupäev peab teisest väiksem olema.");
        return;
    } if (fromDate.toString() === 'Invalid Date' && toDate.toString() === "Invalid Date") {
        error.html("Esimene ja teine kuupäev ei tohi tühjad olla.");
        return;
    } if (fromDate.toString() === 'Invalid Date') {
        error.html("Esimene kuupäev ei tohi tühi olla.");
        return;
    } if (toDate.toString() === "Invalid Date") {
        error.html("Teine kuupäev ei tohi tühi olla.");
        return;
    }

    let labels = []
    let data = []
    for (; fromDate <= toDate; fromDate.setDate(fromDate.getDate() + 1)) {
        labels.push(fromDate.getDate() + "." + (fromDate.getMonth() + 1));
        data.push(calculate(fromDate, latitude, longitude, true));
    }

    if (chart) {
        chart.destroy();
    }

    chart = new Chart($("#chart"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                label: "Päeva pikkus tundides",
                borderColor: "#0d38dc",
                fill: false
            }
            ]
        }
        // Decided not to alter the scales, so the user can better compare results at their selected values
        //options: {scales: {yAxes: [{display: true, ticks: {min: 0.0, max: 24.0}}]}}
    });

    window.scrollBy(0, document.body.scrollHeight);
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

// On document load, sets the date selection to today. Also sets graph date selection to today and 7 days from now.
$(function() {
    const dateToString = (function (date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return year + "-" + (month < 10 ? "0" : "") + month + "-" + day;
    });

    let d = new Date();
    let todayDate = dateToString(d);
    $('#date').val(todayDate);
    $('#fromDate').val(todayDate);

    d.setDate(d.getDate() + 7);
    $('#toDate').val(dateToString(d));

    // Initialization (includes access token I got from Mapbox by making an account)
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