/*
Help used:
https://en.wikipedia.org/wiki/Sunrise_equation
https://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript

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


    let srUTC = getTime(SCsunriseUTC, true);
    let srLCL = getTime(SCsunriseLCL, false);

    let ssUTC = getTime(SCsunsetUTC, true);
    let ssLCL = getTime(SCsunsetLCL, false);

    let difference = Math.round((SC.sunset - SC.sunrise) / 36000) / 100;

    $("#result").html("Päikesetõus (UTC): " + srUTC + ", Päikeseloojang (UTC): " + ssUTC +
        " Päikesetõus (kohalik): " + srLCL + ", Päikeseloojang (kohalik): " + ssLCL +
        ", Päeva pikkus: " + difference + " tundi");

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

    return (hours < 10 ? "0" : "") + hours.toString() + ":" + (minutes < 10 ? "0" : "") + minutes.toString();
}

// On document load, sets the date selection to today.
$(function() {
    let d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    $('#date').val(year + "-" + (month < 10 ? "0" : "") + month + "-" + day);
});