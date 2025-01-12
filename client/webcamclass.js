
// // camera to take pictures with user camera
// // code:
// class Cam {
//     constructor() {
//         this.showStream = false;
//         this.showLastImage = false;
//         this.video = createCapture(VIDEO);
//         // video size as window size
//         this.video.size(300, 300);
//         this.video.hide();
//         this.photos = [];
//         }

//     display() {
//         if(this.showStream){
//         image(this.video, 0, 0, 300, 300);
//         }
//         if(this.showLastImage) {
//             if(this.photos.length === 0) {return}
//             image(this.photos[this.photos.length-1], 0, 0,300, 300);
//         }




//         }

//     // begin taking

//     showStream() {
//         this.showStream = true;
//         this.showLastImage = false;
//         }

//     hideStream() {
//         this.showStream = false;
//         }

//     toggleStream() {
//         this.showStream = !this.showStream;
//         }

//     showFotos() {
//         this.showLastImage = true;
//         }
    
//     hideFotos() {
//         this.showLastImage = false;
//         }
    
//     toggleFotos() {
//         this.showLastImage = !this.showLastImage;
//         }

//     hideCam() {
//         this.hideStream();
//         this.hideFotos();
//         }
    
//     showCam() {
//         this.showStream();
//         this.hideFotos();
//         }

//     toggleCam() {
//         this.toggleStream();
//         this.toggleFotos();
//         }

//     // click

//     takePhoto() {
//         this.photos.push(this.video.get());
//         this.hideStream();
//         this.showFotos();
//         }

// }
