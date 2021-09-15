'use strict';

// TODO:  Cookies to mark the pointer

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("Your device won't support camera!"); //!
}

if (!('geolocation' in navigator)) {
    console.log("Your device won't support location!"); //!
}


const videoElem = document.querySelector('#video');
const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });

function startQR(onSuccess) {
    const constraints = { 
        video: {
            facingMode: { // rear camera
                exact: "environment"
            }
        },
        audio: false,
    }
    
    navigator.mediaDevices.getUserMedia(constraints).then(stream => videoElem.srcObject = stream);

    function _detectQR() {
        barcodeDetector.detect(videoElem).then(codes => {
        
            if (codes.length === 0) return;

            onSuccess(codes[0].rawValue);
            stopQR();
        
        });
    }

    globalThis.qrReaderID = setInterval(_detectQR, 100);
}

function stopQR() {
    videoElem.srcObject = null;
    clearInterval(globalThis.qrReaderID);
}

function getLocation(onSuccess, onError) {
    navigator.geolocation.watchPosition((e) => {
        onSuccess([e.coords.latitude, e.coords.longitude]);
    }, onError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}


function getDistance([lat1, lon1], [lat2, lon2]) {
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

    return earthRadiusKm * c * 1000; // distance in meters
}


// -----------------------------


class Brainz {

    constructor() {
        this.data = JSON.parse(globalThis.data[data]);
        this.pointer = -1; //! retrieve from the cookie
        this.next();
    }

    giveLocation(coordinates) { // some kind of message to show to programming error occured
        if (this.data[this.pointer].actions.location == null) return;

        [lat, lon, r] = this.data[this.pointer].actions.location;
        if (getDistance(coordinates, [lat, lon]) <= r)
            this.next();
    }

    giveQR(s) {
        if (this.data[this.pointer].actions.qr == null) return;

        if (s == this.data[this.pointer].actions.qr)
            this.next();
    }

    giveText(s) {
        if (this.data[this.pointer].actions.text == null) return;

        if (s == this.data[this.pointer].actions.text)
            this.next();
    }

    next() {
        this.pointer++;

        // Change hint

        // Change map

        // Change cookie
    }

}

// -----------------------------




// deadlock?

document.getElementById("location").addEventListener('click', () => {
    getLocation((data) => {
        document.getElementById("log").innerHTML = data;
    })
});

document.getElementById("qr").addEventListener('click', () => {
    startQR((data) => {
        document.getElementById("log").innerHTML = data;
    });
});

document.getElementById("text").addEventListener('click', () => {

});