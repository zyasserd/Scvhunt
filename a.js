// Geolocation
// requires: HTTPS

if ('geolocation' in navigator) {
    /* geolocation is available */
} else {
    /* geolocation IS NOT available */
}

// navigator.geolocation.getCurrentPosition
navigator.geolocation.watchPosition((e) => {
        let pos = [e.coords.latitude, e.coords.longitude];
        doSomething(pos);
    }, () => {
        console.log("Error Happened!");
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
});

