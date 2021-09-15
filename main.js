const videoElem = document.querySelector('#video');
const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });

function startQR() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = { 
            video: {
                facingMode: { // rear camera
                    exact: "environment"
                }
            },
            audio: false,
        }
      
        navigator.mediaDevices.getUserMedia(constraints).then(stream => videoElem.srcObject = stream);
    }

    function _detectQR() {
        barcodeDetector.detect(videoElem).then(codes => {
        
            if (codes.length === 0) return;
            document.getElementById("log").innerHTML = codes[0].rawValue;
            stopQR();
        
        });
    }

    globalThis.qrReaderID = setInterval(_detectQR, 100);
}


function stopQR() {
    videoElem.srcObject = null;
    clearInterval(globalThis.qrReaderID);
}



// -----------------------------


startQR();