'use strict';

const isDebug = false;

/************************************
 *    Error Handling
 ************************************/

if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    window.location = "./error.html?text=Your device won't support camera!";
}

if (!('geolocation' in navigator)) {
    window.location = "./error.html?text=Your device won't support location!";
}

if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
    window.location = "./error.html?text=Sorry, only mobile devices are supported!";
}




/************************************
 *    QR and Location Related
 ************************************/

const videoElem = document.querySelector('#video');
const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });


globalThis.isQRon = false;

function startQR(onSuccess) {
    globalThis.isQRon = true;
    document.getElementById('qr').style.backgroundColor = "white";
    document.getElementById('qr').style.color = getComputedStyle(document.body).getPropertyValue('--clr');

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-

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
    globalThis.isQRon = false;
    document.getElementById('qr').style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--clr');
    document.getElementById('qr').style.color = "white";

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-

    globalThis.isQRon = false;
    videoElem.srcObject = null;
    clearInterval(globalThis.qrReaderID);
}


function getLocation(onSuccess, onError) {
    navigator.geolocation.getCurrentPosition((e) => {
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




/************************************
 *    Main Logic Manipulation
 ************************************/

class Brainz {

    constructor(data) {
        this.data = data["data"];

        let l = decodeURIComponent(document.cookie).split('; ').filter(val => val.startsWith("pointer"));
        if (l.length > 0) {
            // retrieve from the cookie
            this.pointer = parseInt(l[0].substring("pointer".length + 1)) - 1;
        } else {
            this.pointer = -1;
        }
        this.next();
    }

    wrongInput() {
        alert("Incorrect Input!");
    }

    debugLog(e) {
        if (isDebug) {
            document.getElementById("log").innerHTML = e;
        }
    }

    giveLocation(e) {
        this.debugLog(e);
        
        if (this.data[this.pointer].actions.location == null) {
            this.wrongInput();
            return
        }

        let [lat, lon, r] = this.data[this.pointer].actions.location;
        if (getDistance(e, [lat, lon]) <= r)
            this.next();
        else
            this.wrongInput();
    }

    giveQR(e) {
        this.debugLog(e);
        
        if (this.data[this.pointer].actions.qr == null) {
            this.wrongInput();
            return
        }

        if (e == this.data[this.pointer].actions.qr)
            this.next();
        else
            this.wrongInput();
    }

    giveText(e) {
        this.debugLog(e);

        if (this.data[this.pointer].actions.text == null) {
            this.wrongInput();
            return
        }

        // Note: ".toLowerCase().trim()"
        if (e.toLowerCase().trim() === this.data[this.pointer].actions.text.toLowerCase().trim())
            this.next();
        else
            this.wrongInput();
    }

    next() {
        this.pointer++;

        // Change map
        document.getElementById('progress').style.strokeDashoffset = 2*Math.PI*45*(1 - (this.pointer / (this.data.length - 1)));
        document.getElementById('pointer').innerHTML = this.pointer;

        // Change hint
        document.getElementById('hint').innerHTML = this.data[this.pointer].hint;

        // Change cookie
        if (this.pointer === (this.data.length - 1)) {
            document.cookie = "pointer=; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        } else {
            document.cookie = `pointer=${this.pointer};`;
        }
    }

}




/************************************
 *    Data Input
 ************************************/

// The format: 
let _sample_JSON_format = 
{
    "data": [
        {
            "hint": "hint1",
            "actions": { // include as many as you want {even zero options work, useful for the last option}
                "location": [1 /* latitude */, 2 /* longitude */, 5 /* radius in meters */],
                "qr": "link.com",
                "text": "the code" // is compared trimmed and in lowercase
            }
        }
    ]
};


let URLParams = new URLSearchParams(window.location.search);

// url?color=112233
//          ^hex code
// defaults to black
if ((v = URLParams.get(color)) != null)
    document.querySelector(':root').style.setProperty(
        '--clr',
        "#" + v
    );



// url?gist={github gist key}
// url?link={link}
// both the link or the (github gist key) should point to a JSON file with the data

let myBrainz;
let link;

if ((v == URLParams.get('gist')) != null) {
    link = `https://api.github.com/gists/${v}`;
} else if ((v == URLParams.get('gist')) != null) {
    link = v;
} else {
    alert("You haven't provided a link!");
    throw "You haven't provided a link!";
}

fetch(link)
    .then(resp => resp.json())
    .then(json => json["files"]["gistfile1.txt"]["content"])
    .then(out => {
        myBrainz = new Brainz(JSON.parse(out));
    });



/************************************
 *    UI Events
 ************************************/

document.getElementById("location").addEventListener('click', () => {
    getLocation((e) => {
        myBrainz.giveLocation(e);
    }, () => {
        alert("Failed to get location, try again!");
    });
});

document.getElementById("qr").addEventListener('click', () => {
    if (globalThis.isQRon) {
        stopQR();
    } else {
        startQR(e => {
            myBrainz.giveQR(e);
        });
    }
});

document.getElementById("text").addEventListener('click', () => {
    myBrainz.giveText(prompt("Write the code"));
});

