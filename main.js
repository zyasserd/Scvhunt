
// Get the video element
const video = document.querySelector('#video')
// Check if device has camera
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Use video without audio
    const constraints = { 
        video: {
            facingMode: {
                exact: "environment"
            }
        },
        audio: false,
    }
  
  // Start video stream
  navigator.mediaDevices.getUserMedia(constraints).then(stream => video.srcObject = stream);
}



// Create new barcode detector
const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });

// Detect code function 
const detectCode = () => {
  // Start detecting codes on to the video element
  barcodeDetector.detect(video).then(codes => {
    if (codes.length === 0) return;
    
    document.getElementById("log").innerHTML += codes[0].rawValue;
  });
}

setInterval(detectCode, 100);

