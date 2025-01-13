// document.cookie = "visited=true";


    





const showIntro = () =>{
  // get <main-navigation>
  const mainNavigation = document.querySelector('main-navigation') || {};
  console.log('mainnavigation', mainNavigation);

  // showPlusButton
  mainNavigation.showPlusButton();
  // showMessageButton
  mainNavigation.showMessageButton();

  requestMicAccess = function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      console.log('You let me use your mic!')
    })
    .catch(function(err) {
      console.log('No mic for you!')
    }
    );
  }
  
    introJs().oncomplete(function() {
      mainNavigation.hidePlusButton();
      mainNavigation.hideMessageButton();
    }).onexit(function() {
      mainNavigation.hidePlusButton();
      mainNavigation.hideMessageButton();
    }).setOptions({
      scrollToElement: false,
      steps: [
      {
        // element: document.querySelector('main'),
        intro: "<p><b>Welcome!</b></p><p> Together, we will build a 'town of ideas'.</p>"
      },
      // please turn on sound
      {
        intro: "<div style='text-align:center;'><p>Please turn on your sound!<i class='fa fa-volume-up' style='font-size:30px;margin-top:10px;'></i></p></div>"
      },
      // please allow microphone
      {
        intro: "<div style='text-align:center;'><span id='requestmicbuttoncontainer'><button id='requestmicbutton' onclick='requestMicAccess()'>Allow Microphone<i class='fa fa-microphone' style='font-size:30px;margin-top:10px;'></i></button></span></div>"
      },
      {
        intro: "This is a grid of cells. On every cell, anyone can build a 'building', representing an idea."
      },
      {
        element: mainNavigation.getArrowButtons(),
        intro: "Use these arrows to move around the 'town' and explore the ideas other people have built!"
      },
      {
        element: mainNavigation.getPlusButton(),
        intro: "<p>Add your own 'building' to the 'town' with the 'plus' button.</p><img src='house.png' alt='Welcome Image' style='width:100%;height:auto;'>"
      },
      {
        element: mainNavigation.getMessageButton(),
        intro: "You can leave a comment on any 'building' by clicking the 'message' button."
        },
        {
        intro: "Let's get started!"
      }
    ]
      }).start();
    }


// after all dom content is loaded
document.addEventListener('DOMContentLoaded', () => {
  showIntro();
});
  
  document.cookie = "seenintro=true";
