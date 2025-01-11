const { createCanvas, Image } = require('canvas');
const imageSize = require('image-size');
// image-size dependency

// This function takes an image and a mask and returns a new image that is the result of applying the mask to the image.
// The mask is a png with white and transparent pixels.
// example of getting an 'image' object that works:
// const image = 
// await loadImage('https://www.w3schools.com/w3css/img_lights.jpg');
// input formats:
// image & mask: 
function maskImage(imageArray, maskArray, maskingChannel = 'alpha', maskedColor = [255, 255, 255, 0]) {
    // make sure inputs are valid
    if (!image || !mask) {
        throw new Error('Image and mask must be provided');
    }

    // pick the channel to use for masking
    var channel = maskingChannel === 'red' ? 0 : maskingChannel === 'green' ? 1 : maskingChannel === 'blue' ? 2 : 3;

    // scale mask to image size
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(mask, 0, 0, image.width, image.height);

    const maskData = ctx.getImageData(0, 0, image.width, image.height).data;

    
    // create a new image
    const outputCanvas = createCanvas(image.width, image.height);
    const outputCtx = outputCanvas.getContext('2d');
    outputCtx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = outputCtx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    // iterate over each pixel of the image
    for (let i = 0; i < data.length; i += 4) {
        const maskValue = maskData[i + channel]; // get the mask value for the current pixel
        if (maskValue === 0) { // if the masks masking channel is 0, set the pixel to transparent
            // set the pixel to white
            data[i] = maskedColor[0];
            data[i + 1] = maskedColor[1];
            data[i + 2] = maskedColor[2];
            data[i + 3] = maskedColor[3];
        }
    }

    outputCtx.putImageData(imageData, 0, 0);
    return outputCanvas;
}


function base64StringImageToCanvas(base64String) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        };
        img.onerror = function(err) {
            reject(err);
        };
        img.src = base64String;
    });
}

canvasImageToBase64String = async (canvas) => {
    return canvas.toDataURL();
}

imageDimensionsFromImageURL = function(imageBase64String){
// a server side function to get the dimensions of an image from a base64 string
    var img = Buffer.from(imageBase64String.split(';base64,').pop(), 'base64');
    console.log(img);
    var dimensions = imageSize(img);
    return dimensions;
}



async function maskImageBase64 (image) {
    const mask = imageMask
    

    const receivedImage = await base64StringImageToCanvas(image);
    const maskedImage = maskImage(mask, receivedImage);
    // convert to base64
    const maskedImageString = maskedImage.toDataURL().split(',')[1];
    return maskedImageString;
}

function base64stringImageToArray(base64String) {
    // should return
    // [
    // [[r, g, b, a], [r, g, b, a], ...],
    // [[r, g, b, a], [r, g, b, a], ...],
    // ]
    const img = new Image();
    img.src = base64String;
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    const imageArray = [];
    for (let i = 0; i < data.length; i += 4) {
        imageArray.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
    }
    return imageArray;

}


function imageArrayToBase64String(imageArray, width=100, height=100) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let i = 0; i < imageArray.length; i++) {
        data[i * 4] = imageArray[i][0];
        data[i * 4 + 1] = imageArray[i][1];
        data[i * 4 + 2] = imageArray[i][2];
        data[i * 4 + 3] = imageArray[i][3];
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}


// export
module.exports = {
    maskImage,
    base64StringImageToCanvas,
    canvasImageToBase64String,
    imageDimensionsFromImageURL,
    maskImageBase64,
    base64stringImageToArray,
    imageArrayToBase64String    
};



