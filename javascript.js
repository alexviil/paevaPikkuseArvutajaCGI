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
// Returns either daylength as integer or both UTC and local sunrise, sunset and daylength as strings in an array.
function calculate(date, latitude, longitude, returnOnlylength) {
    // SunCalc
    let SC = SunCalc.getTimes(date, latitude, longitude);
    let SCsunriseUTC = SC.sunrise;
    let SCsunsetUTC = SC.sunset;

    // tz-lookup (for local time)
    let SCsunriseLCL = new Date(SCsunriseUTC.toLocaleString("en-US", {timeZone: tzlookup(latitude, longitude)}));
    let SCsunsetLCL = new Date(SCsunsetUTC.toLocaleString("en-US", {timeZone: tzlookup(latitude, longitude)}));

    // Day length string (or integer) checking and preparation
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

    return [srUTC, srLCL, ssUTC, ssLCL, dayLength];
}

// Function to show calculation results (map)
function calculateFromMap() {

    // Getting user input
    let date = new Date($("#date").val());
    let latitude = $("#latitude").val();
    let longitude = $("#longitude").val();

    // Checking for error or clearing error field (just in case the last calculation failed)
    let error = $("#mapNotification");
    if (date.toString() === "Invalid Date") {
        error.addClass("bg-danger");
        error.html("Kuupäev ei tohi tühi olla.");
        return
    } else {
        error.removeClass("bg-danger");
        error.html("");
    }

    // Calculating result
    let calculationResult = calculate(date, latitude, longitude, false);

    // Changing what the user sees to match.
    $("#UTCsr").html("<strong>" + calculationResult[0] + "</strong>");
    $("#UTCss").html("<strong>" + calculationResult[2] + "</strong>");
    $("#LCLsr").html("<strong>" + calculationResult[1] + "</strong>");
    $("#LCLss").html("<strong>" + calculationResult[3] + "</strong>");
    $("#dayLength").html("<strong>" + calculationResult[4] + "</strong>");
}

// Chart initialization
let chart;

// Function to show calculation results (graph)
function calculateFromRange() {
    // Selectors
    let fromDate = new Date($("#fromDate").val());
    let toDate = new Date($("#toDate").val());
    let latitude = $("#latitude").val();
    let longitude = $("#longitude").val();

    // Error handling (clears last error, if there was one)
    let error = $("#rangeNotification");
    error.removeClass("bg-danger");
    error.html("");

    if (toDate <= fromDate) {
        error.addClass("bg-danger");
        error.html("Esimene kuupäev peab teisest väiksem olema.");
        return;
    } if (fromDate.toString() === 'Invalid Date' && toDate.toString() === "Invalid Date") {
        error.addClass("bg-danger");
        error.html("Esimene ja teine kuupäev ei tohi tühjad olla.");
        return;
    } if (fromDate.toString() === 'Invalid Date') {
        error.addClass("bg-danger");
        error.html("Esimene kuupäev ei tohi tühi olla.");
        return;
    } if (toDate.toString() === "Invalid Date") {
        error.addClass("bg-danger");
        error.html("Teine kuupäev ei tohi tühi olla.");
        return;
    }

    // Data generation
    let labels = []
    let data = []
    for (; fromDate <= toDate; fromDate.setDate(fromDate.getDate() + 1)) {
        let month = fromDate.getMonth() + 1;
        month = month < 10 ? "0" + month.toString() : month.toString();
        labels.push(fromDate.getDate() + "." + month);
        data.push(calculate(fromDate, latitude, longitude, true));
    }

    // Removes old chart, if it's been initialized.
    if (chart) {
        chart.destroy();
    }

    // Chart creation using data from above.
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
        },
        options: {
            scales: {
                yAxes: [{
                    // Decided not to alter the scales, so the user can better compare results at their selected values
                    //display: true, ticks: {min: 0.0, max: 24.0}
                    scaleLabel: {
                        display: true,
                        labelString: 'Päeva pikkus tundides, h'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Kuupäev, dd.MM'
                    }
                }]
            }
        }
    });

    // Scrolls to the bottom, so the user can see the graph they generated.
    window.scrollBy(0, document.body.scrollHeight);
}

// Get the hours and minutes.
// Returns time in the from HH:MM as a string.
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

// On document load, sets the date selection to today, sets graph date selections to today and 7 days from now.
// Also
$(function() {
    // Lambda function to convert the date into something the input fields accept.
    const dateToString = (function (date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return year + "-" + (month < 10 ? "0" : "") + month + "-" + day;
    });

    // Dates and selectors
    let d = new Date();
    let todayDate = dateToString(d);
    $('#date').val(todayDate);
    $('#fromDate').val(todayDate);

    d.setDate(d.getDate() + 7);
    $('#toDate').val(dateToString(d));

    let latitudeField = $("#latitude");
    let longitudeField = $("#longitude");

    // Initialization (includes access token I got from Mapbox by making an account)
    var mymap = L.map('mapid').setView([58.38, 26.72], 6);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWxleHZpaWwiLCJhIjoiY2s5NXg2anpmMGFmMDNrbDRpemlmbnpyNCJ9.mlus4jEkWhmwMLV0zDVMxw', {
        maxZoom: 14,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    // Click function
    let marker = L.marker([latitudeField.val(), longitudeField.val()]);
    marker.addTo(mymap);

    mymap.on('click', function(e) {
        // Set the marker down
        marker.setLatLng(e.latlng);

        // Wrap the longitude (so that the user can go "out of bounds" without error)
        let latlng = e.latlng.wrap();

        // Rounding to keep numbers simple (thousandths should be enough for this application) and
        // update the input fields
        latitudeField.val(Math.round(latlng.lat * 1000.0) / 1000.0);
        longitudeField.val(Math.round(latlng.lng * 1000.0) / 1000.0);
    });

    // Listeners for input fields
    const updateMap = (function () {
        let latitude = latitudeField.val();
        let longitude = longitudeField.val();

        // Wrap the longitude
        let latlng = L.latLng(latitude, longitude).wrap();

        // Update the fields using the wrapped
        latitudeField.val(latlng.lat);
        longitudeField.val(Math.round(latlng.lng * 1000.0) / 1000.0);

        // Set the marker and move the map to it
        marker.setLatLng(latlng);
        mymap.panTo(latlng);
    });

    // Setting the listeners
    latitudeField.on("change", () => updateMap());
    longitudeField.on("change", () => updateMap());
});