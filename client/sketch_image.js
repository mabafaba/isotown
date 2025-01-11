let img;

// Load the image.
function preload() {
  img = loadImage('http://localhost:3000/example.png');
}

function setup() {
  createCanvas(200, 200);
  imageMode(CENTER);

  // background(50);

  // Draw the image.
  image(img, width / 2, height / 2, 200,400);

  describe('An image of the underside of a white umbrella with a gridded ceiling above.');
}

draw = () => {
  background(50);

  // Draw the image.
  image(img, width / 2, height / 2, 100,150);
}