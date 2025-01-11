// document.cookie = "visited=true";


    





const showIntro = () =>{
    introJs().setOptions({
        scrollToElement: false,
        steps: [
        {
            element: document.querySelector('main'),
            intro: "<p><b>Welcome!</b></p><p> Together, we will build a 'town of ideas'.</p>"
        },
        {
            intro: "This is a grid of cells. On every cell, anyone can build a 'building', representing an idea."
        },
        {
          element: document.querySelector('#navigationbuttons'),
          intro: "Use these arrows to move around the 'town' and explore the ideas other people have built!"
        },
        {
          element: document.querySelector('#gameprimaryactionbutton'),
          intro: "<p>Add your own 'building' to the 'town' with the 'plus' button.</p><img src='house.png' alt='Welcome Image' style='width:100%;height:auto;'>"
        },
        {
            element: document.querySelector('#gameleavenotebutton'),
            intro: "You can leave a voice note anywhere on the map, or respond to someone else's note."
            },
            {
            intro: "Let's get started!"
        }
    ]
      }).start();
    }



// if(document.cookie.indexOf('seenintro=true') === -1) {
  showIntro();
  document.cookie = "seenintro=true";
// }
