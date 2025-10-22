var game = {};
let dpi = window.devicePixelRatio;
window.onload = function() {
  //Initialize display size for game objects
  game.boxSizes = 50;
  //Set D-Pad (Mobile Controls) Style values
  document.getElementById("d-Pad").style.display = "none";
  document.querySelector(".objColl").style.top = "455.5px";
  document.querySelector(".objColl").style.height = "28px";
  document.querySelector(".objColl").style.overflowY = "auto";
  //Creating Canvas and setting canvas parameters
  game.canvas = document.getElementById("gameCanvas");
  game.canvas.width = "1296";
  game.canvas.height = "1000";
  game.canvas.style.width = "648px";
  game.canvas.style.height = "500px";
  //Getting Canvas Context (2D)
  game.ctx = game.canvas.getContext("2d", { alpha: false });
  game.ctx.imageSmoothingEnabled = false;
  //Initializing Player Variable
  game.player = {};
  game.player.x = 0;
  game.player.y = 0;
  //Testing if user has already seen tutorial, if they have then don't show it again
  if(localStorage.getItem("tutorial")) {
    if(localStorage.getItem("tutorial") == "true") {
      document.getElementById("tutorialPrompt").style.display = "";
    } else {
      document.getElementById("tutorialPrompt").style.display = "none";
    };
  } else {
    localStorage.setItem("tutorial", "true");
  };
  //Setting player controller variables
  game.player.Mw = false;
  game.player.Ma = false;
  game.player.Ms = false;
  game.player.Md = false;
  game.player.Aw = true;
  game.player.Aa = true;
  game.player.As = true;
  game.player.Ad = true;
  game.player.dW = true;
  game.player.dA = true;
  game.player.dS = true;
  game.player.dD = true;
  game.player.Mshift = false;
  game.player.Mcontrol = false;
  //Setting up miscellaneous variables for game
  game.objectivesCollected = 0;
  game.objectives = [];
  game.announce = [];
  game.doors = [];
  game.enemies = [];
  //Sounds to preload when page is opened
  game.soundsToPreload = [
    {
      id: "collect",
      //Got from https://pixabay.com/sound-effects/search/ding/
      src: "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/reception-bell-14620.mp3?v=1712174155861",
      volume: 0.5,
    },
    {
      id: "ambient1",
      //Got From https://pixabay.com/music/search/maze/
      src: "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/defaultMusic1.mp3?v=1707687823176",
      volume: 0.5,
    },
    {
      id: "ambient2",
      //Got From https://pixabay.com/music/search/maze/
      src: "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/defaultMusic2.mp3?v=1707689858824",
      volume: 0.5,
    },
  ];
  //Labelling background music types and index
  game.currentBackgroundMusic = null;
  game.ambients = [
    "ambient1",
    "ambient2",
  ];
  game.currentAmbient = 0;
  //Sound effect storage for once they have been "preloaded"
  game.sounds = {};
  //Miscellaneous game variables
  game.startTime;
  game.endTime;
  game.northEast;
  game.northWest;
  game.southEast;
  game.southWest;
  //Default Map parameters
  game.defaults = {
    small: {
      dim: 250,
      iter: 100,
      obj: 10,
    },
    medium: {
      dim: 500,
      iter: 200,
      obj: 20,
    },
    large: {
      dim: 750,
      iter: 500,
      obj: 30,
    },
    absurd: {
      dim: 1250,
      iter: 1250,
      obj: 50,
    }
  };
  //All image preloading
  game.playerImg = new Image();
  //All images are made by me
  game.playerImg.src = "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/player1.png?v=1707851649049";
  game.objectiveImg = new Image();
  //All images are made by me
  game.objectiveImg.src = "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/objective.png?v=1707691795432";
  game.floor1Img = new Image();
  //All images are made by me
  game.floor1Img.src = "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/floor1v2.png?v=1707851379837";
  game.floor2Img = new Image();
  //All images are made by me
  game.floor2Img.src = "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/floor2.png?v=1707852907322";
  game.floor3Img = new Image();
  //All images are made by me
  game.floor3Img.src = "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/floor3.png?v=1707853039542";
  game.doorCImg = new Image();
  //All images are made by me
  game.doorCImg.src = "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/doorC.png?v=1707853587590";
  game.doorOImg = new Image();
  //All images are made by me
  game.doorOImg.src = "https://cdn.glitch.global/1c4aaba5-2823-4206-a064-61fd958008b1/doorO.png?v=1707853587938";
  //Setting up the array for randomization of floor tiles
  game.floorPieces = [game.floor1Img, game.floor2Img, game.floor3Img];
  //Setting up memory Canvas for optimization
	game.memCanvas = document.getElementById("memCanvas");
	game.memCtx = game.memCanvas.getContext("2d");
  game.memCtx.imageSmoothingEnabled = false;
  //Setting the interval for the whole game; Yes I know this specific way of doing it is minorly inefficient but I made this a while ago
  setInterval(function() {
    detectColl();
  }, 1);
  //Preloading Sounds
  preloadSounds();
  //Initial drawing of canvas
  updateCanvas(game.player.x, game.player.y);
};

//Recieved From Stack Exchange -----
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    //let style_height = +getComputedStyle(game.canvas).getPropertyValue("height").slice(0, -2);
    //get CSS width
    //let style_width = +getComputedStyle(game.canvas).getPropertyValue("width").slice(0, -2);
    //scale the canvas
function fix_dpi() { 
    var style_height = +getComputedStyle(game.canvas).getPropertyValue("height").slice(0, -2);
    var style_width = +getComputedStyle(game.canvas).getPropertyValue("width").slice(0, -2);
    game.canvas.setAttribute('height', style_height * dpi);
    game.canvas.setAttribute('width', style_width * dpi);
  };

//Function to preload sounds;
  //Creates new audio element and sets source aw well as volume then sets the element as a variable in the object "game.sounds";
function preloadSounds() {
  game.sounds = {};
  for(var i=0;i<game.soundsToPreload.length;i++) {
    var a = new Audio();
    a.src = game.soundsToPreload[i].src;
    if(game.soundsToPreload[i].volume) {
      a.volume = game.soundsToPreload[i].volume;
    };
    eval("game.sounds."+game.soundsToPreload[i].id+" = a;");
  };
};

//Tests if and audio element is playing or not
function isPlaying(audelem) { return !audelem.paused; }

//Plays an audio element if it isn't playing already, if it is then restart it. 
function playAudio(audio) {
  if(isPlaying(audio)) {
    audio.currentTime = 0;
  } else {
    audio.play();
  };
};

//Sets up the ambient background music;
  //If the game.currentBackgroundMusic variable is set to null (aka. the start of the game) it will set it to "game.sounds.ambient1"
  //If the music is getting near the end, go to the next ambient background music file, and if it is alreadt on the last one, go back to the beginning;
  //Play the background music...
function backgroundMusic() {
  if(game.currentBackgroundMusic == null) {
    game.currentBackgroundMusic = game.sounds.ambient1;
  };
  if(game.currentBackgroundMusic.currentTime+0.5 > game.currentBackgroundMusic.duration) {
    game.currentAmbient++;
    if(game.currentAmbient < game.ambients.length) {
      eval("game.currentBackgroundMusic = game.sounds."+game.ambients[game.currentAmbient]);
    } else {
      game.currentAmbient = 0;
      eval("game.currentBackgroundMusic = game.sounds."+game.ambients[game.currentAmbient]);
    };
    game.currentBackgroundMusic.currentTime = 0;
  }
  game.currentBackgroundMusic.play();
};

//Detects collisions with walls and closed doors;
  //Sets the control variables for allowing player movement in all cardinal directions;
  //Runs a for loop to test all spaces from the tilemap variable and if the player moved in any direction if it would run into them, if the player would, then disallow them from moving that direction;
function detectColl() {
  game.player.Aw = true;
  game.player.Aa = true;
  game.player.As = true;
  game.player.Ad = true;
  for(var i = 0;i<game.tilemaps.maze1.length;i++) {
    for(var o = 0;o<game.tilemaps.maze1[i].length;o++) {
      if(game.tilemaps.maze1[game.player.y][game.player.x + 1] == 0) {
        game.player.Ad = false;
      };
      if(game.player.x == game.tilemaps.maze1[0].length-1) {
        game.player.Ad = false;
      };
      if(game.tilemaps.maze1[game.player.y][game.player.x - 1] == 0) {
        game.player.Aa = false;
      };
      if(game.player.x == 0) {
        game.player.Aa = false;
      };
      if(game.player.y-1 >= 0) {
        if(game.tilemaps.maze1[game.player.y - 1][game.player.x] == 0) {
          game.player.Aw = false;
        };
      };
      if(game.player.y == 0) {
        game.player.Aw = false;
      };
      if(game.player.y+1 <= game.tilemaps.maze1.length-1) {
        if(game.tilemaps.maze1[game.player.y + 1][game.player.x] == 0) {
          game.player.As = false;
        };
      };
      if(game.player.y == game.tilemaps.maze1.length-1) {
        game.player.As = false;
      };
    };
  };
  for(var i=0;i<game.doors.length;i++) {
    if(game.doors[i].ac == true) {
      if(game.player.x+1 == game.doors[i].x && game.player.y == game.doors[i].y) {
        game.player.Ad = false;
      };
      if(game.player.x-1 == game.doors[i].x && game.player.y == game.doors[i].y) {
        game.player.Aa = false;
      };
      if(game.player.y+1 == game.doors[i].y && game.player.x == game.doors[i].x) {
        game.player.As = false;
      };
      if(game.player.y-1 == game.doors[i].y && game.player.x == game.doors[i].x) {
        game.player.Aw = false;
      };
    };
  };
  detectKeys();
};

//Brightness controller variable
var hueRotate = 0;

//Detects if player is moving in a specific direction using keys and if they are allowed to move in that direction.
  //Every time the player moves the canvas is updated;
  //after movement is done, it checks if there are and objectives in each quadrant of the map, the centerpoint being the center of the entire map;
  //This function also controls the brightness of the element that appears on the right side of the screen depending on how close the player is to an objective point.
  //Also detects the collection of objectives which happens when the player is in the same position as the objective point;
  //If all objectives are collected, it will end the game;
function detectKeys() {
  if(game.player.Mw == true && game.player.Aw == true) {
    game.player.y -= 1;
    game.player.Mw = false;
    game.player.Ms = false;
  updateCanvas(game.player.x, game.player.y);
  } else if(game.player.Ma == true && game.player.Aa == true) {
    game.player.x -= 1;
    game.player.Ma = false;
    game.player.Md = false;
  updateCanvas(game.player.x, game.player.y);
  } else if(game.player.Ms == true && game.player.As == true) {
    game.player.y += 1;
    game.player.Ms = false;
    game.player.Mw = false;
  updateCanvas(game.player.x, game.player.y);
  } else if(game.player.Md == true && game.player.Ad == true) {
    game.player.x += 1;
    game.player.Md = false;
    game.player.Ma = false;
  updateCanvas(game.player.x, game.player.y);
  };
  game.northEast = false;
  game.northWest = false;
  game.southEast = false;
  game.southWest = false;
  game.announce = [];
  hueRotate = 0;
  for(var hh=0;hh<game.objectives.length;hh++) {
    if(game.objectives[hh].x >= game.tilemaps.maze1.length/2) {
      if(game.objectives[hh].y >= game.tilemaps.maze1.length/2) {
        game.southEast = true;
      } else {
        game.northEast = true;
      };
    } else {
      if(game.objectives[hh].y >= game.tilemaps.maze1.length/2) {
        game.southWest = true;
      } else {
        game.northWest = true;
      };
    };
    var distance = Math.sqrt((Math.pow(game.player.x-game.objectives[hh].x,2))+(Math.pow(game.player.y-game.objectives[hh].y,2)));
    if(distance > 5) {distance -= 4} else {distance = 1};
    if(distance >= 33) {distance = 33};
    if(distance < 100 && hueRotate < (100-(distance)*3)+120) {
      hueRotate = (100-(distance)*3)+120;
    };
    if(game.player.x == game.objectives[hh].x && game.player.y == game.objectives[hh].y) {
      game.objectives.splice(hh, 1);
      game.objectivesCollected += 1;
      playAudio(game.sounds.collect);
      detectKeys();
  updateCanvas(game.player.x, game.player.y);
      if(game.objectives.length == 0) {
        endGame();
      };
    };
  };
    if(game.northEast == false) {
      game.announce.push("North-East Cleared");
    };
    if(game.northWest == false) {
      game.announce.push("North-West Cleared");
    };
    if(game.southEast == false) {
      game.announce.push("South-East Cleared");
    };
    if(game.southWest == false) {
      game.announce.push("South-West Cleared");
    };
  document.getElementById("displayImg").style.filter = "brightness("+hueRotate+"%)";
};

//Ends the game and gives the user an endgame screen with their playtime and how many objectives were on the map;
function endGame() {
  game.endTime = new Date();
  var completedTime = msTime(game.endTime-game.startTime);
  document.getElementById('tutorialPrompt').style.display = "none";
  document.getElementById('menuOptions').style.display = "none";
  var a = document.createElement("table");
  a.innerHTML = `
  <tr>
    <th>Completed!</th>
  </tr>
  <tr>
    <td>You collected all `+objectiveIterations+` objective points in `+completedTime+`!</td>
  </tr>
  <tr>
    <td style="color: crimson;">You are free... for now....</td>
  </tr>
  <tr>
    <td><button id="closeEndGame" onclick="document.getElementById('endScreen').remove();">Close</button></td>
  </tr>
  `;
  a.id = "endScreen";
  document.querySelector(".fullScreen").appendChild(a);
};


//Borrowed From; https://gist.github.com/irokhes/0cc3222078ac81a58f86c1a1c35a40be ---
function msTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + " Hours, " + minutes + " Minutes, and " + seconds + "." + milliseconds + " seconds";
}
//--------------

//Sets the "memCanvas" using the data within the array "game.tilemaps.maze1" and maps it out accordingly;
  //Since this is also the first function it starts the "stopwatch" for the player's session time;
function setCanvas() {
	game.memCanvas.width = game.tilemaps.maze1[0].length*10;
	game.memCanvas.height = game.tilemaps.maze1.length*10;
  game.memCtx.clearRect(0, 0, game.memCanvas.width, game.memCanvas.height);
  var currentPiece = 0;
  for(var i = 0;i<game.tilemaps.maze1.length;i++) {
    for(var o = 0;o<game.tilemaps.maze1[i].length;o++) {
      if(game.tilemaps.maze1[i][o] == 0) {
        game.memCtx.fillStyle = "black";
        game.memCtx.fillRect(0+o*10, 0+i*10, 10, 10);
      } else {
      if(game.tilemaps.maze1[i][o] == 1) {
        currentPiece = Math.floor(Math.random()*3);
      };
      game.memCtx.drawImage(game.floorPieces[currentPiece], 0+o*10, 0+i*10, 10, 10);
      };
    };
  };
  game.startTime = new Date();
};

//Checks if the user is using a mobile device
  //There were no names but my source for this was: "https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser?page=1&tab=scoredesc#tab-top"
function mobileCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

//Toggles the visibility and position of the D-Pad (Touch Controls)
  //The position varies depending on if the user is using fullscreen or not, as well as if they are using a mobile device;
function toggleDPad() {
  if(document.getElementById("d-Pad").style.display == "none") {
    document.getElementById("d-Pad").style.right = "";
    if(game.fullScreen == true) {
      document.getElementById("d-Pad").style.bottom = "100px";
      document.getElementById("d-Pad").style.right = "5px";
      document.getElementById("d-Pad").style.left = "";
      document.getElementById("d-Pad").style.top = "";
    } else {
      document.getElementById("d-Pad").style.left = "938px";
      document.getElementById("d-Pad").style.top = "400px";
    };
    if(mobileCheck() == true) {
      document.getElementById("d-Pad").style.top = "50%";
    }
    document.getElementById("d-Pad").style.display = "";
  } else {
    document.getElementById("d-Pad").style.display = "none";
  }
};

//This function sets all the styles for all the elements in the game so they fit well while in fullscreen mode;
  //Then it calls fullscreen, it also adds an eventListener to check if the user gets out of fullscreen, if they do then it calls "exitFullScreen()"
  //If it calls from the user exiting fullscreen without the built-in button within the page, then "exitFullScreen()" gets called with the parameter "alreadyExited" as true;
  //This function also updates the canvas;
function fullScreenCall() {
  game.fullScreen = true;
  game.canvas.width = window.screen.width/2;
  game.canvas.height = window.screen.height;
  game.canvas.style.width = window.screen.width/2+"px";
  game.canvas.style.height = window.screen.height+"px";
  document.getElementById("displayImg").style.width = window.screen.width/2+"px";
  document.getElementById("displayImg").style.height = window.screen.height+"px";
  document.getElementById("displayImg").style.left = (window.screen.width/2)+2+"px";
  document.getElementById("d-Pad").style.bottom = "100px";
  document.getElementById("d-Pad").style.right = "5px";
  document.getElementById("d-Pad").style.left = "";
  document.getElementById("d-Pad").style.top = "";
  document.getElementById("d-Pad").style.display = "";
  document.querySelector(".objColl").style.height = "";
  document.querySelector(".objColl").style.overflowY = "";
  document.querySelector(".objColl").style.top = "";
  document.querySelector(".objColl").style.bottom = "0";
  document.getElementById("fullScreenCallButton").innerHTML = "Exit Fullscreen";
  document.getElementById("fullScreenCallButton").onclick = function() {exitFullScreen();};
  if(mobileCheck() == true) {
    game.boxSizes = 20;
  document.querySelector(".objColl").style.fontSize = "0.9em";
  document.querySelector(".XandY").style.fontSize = "1.5em";
  };
  var elem = document.querySelector(".fullScreen");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  };
  updateCanvas(game.player.x, game.player.y);
};

if (document.addEventListener)
{
 document.addEventListener('fullscreenchange', exitHandler, false);
 document.addEventListener('mozfullscreenchange', exitHandler, false);
 document.addEventListener('MSFullscreenChange', exitHandler, false);
 document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

//Used as a check to see if the game is no longer in fullscreen (it won't be if the user used an alternative way to exit fullscreen)
function exitHandler()
{
 if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
 {
  exitFullScreen(true);
 }
}

//Resets all the css style values of the elements back to their "natural" state;
  //If "alreadyExited" is true, then it will stop at that, but if "alreadyExited" is false, then this function will proceed to exit fullscreen as well;
  //This function also updates the canvas;
function exitFullScreen(alreadyExited) {
  game.fullScreen = false;
  document.querySelector(".objColl").style.height = "28px";
  document.querySelector(".objColl").style.overflowY = "auto";
  game.canvas.width = 1296;
  game.canvas.height = 1000;
  game.canvas.style.width = "648px";
  game.canvas.style.height = "500px";
  document.getElementById("d-Pad").style.right = "";
  document.getElementById("d-Pad").style.left = "938px";
  document.getElementById("d-Pad").style.top = "400px";
  document.getElementById("displayImg").style.width = "500px";
  document.getElementById("displayImg").style.height = "500px";
  document.getElementById("displayImg").style.left = "650px";
  document.querySelector(".objColl").style.top = "455.5px";
  document.querySelector(".objColl").style.bottom = "";
  document.getElementById("fullScreenCallButton").innerHTML = "Fullscreen";
  document.getElementById("fullScreenCallButton").onclick = function() {fullScreenCall();};
  if(mobileCheck() == true) {
    game.boxSizes = 50;
    document.getElementById("d-Pad").style.top = "50%";
  };
  if (document.exitFullscreen && alreadyExited == false) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  };
  updateCanvas(game.player.x, game.player.y);
}

//Updates the canvas;
  //plx {num} - Player's X coordinate;
  //ply {num} - Player's Y coordinate;
  //This function starts by moving the camera to align with the player, then draws the image stored in "memCanvas" (the map drawn in "setCanvas()") as the background;
  //It will then draw all the objectives still not collected;
  //It continues by randomly opening and closing doors on the map every time this runs;
    //Depending on the state of the door it will also change the image (closed or open);
  //Draws the player image;
  //Displays the quadrant status determined in "detectKeys()" if the objectives left is less than or equal to five;
  //Checks the background music with the function backgroundMusic();
function updateCanvas(plx, ply) {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  game.ctx.save();
	game.ctx.translate(((-plx*game.boxSizes)+game.canvas.width/2)-(game.boxSizes/2), ((-ply*game.boxSizes)+game.canvas.height/2)-(game.boxSizes/2));
  game.ctx.drawImage(game.memCanvas,0,0,game.tilemaps.maze1[0].length*game.boxSizes,game.tilemaps.maze1.length*game.boxSizes);
  for(var i=0;i<game.objectives.length;i++) {
    game.ctx.drawImage(game.objectiveImg, game.objectives[i].x*game.boxSizes, game.objectives[i].y*game.boxSizes, game.boxSizes, game.boxSizes);
  };
  for(var i=0;i<game.doors.length;i++) {
    if(Math.random()*40 > 20) {
      if(game.doors[i].ac == true) {
        game.doors[i].ac = false;
      } else {
        game.doors[i].ac = true;
      };
    };
    if(game.doors[i].ac == true) {
      game.ctx.drawImage(game.doorCImg, game.doors[i].x*game.boxSizes, game.doors[i].y*game.boxSizes, game.boxSizes, game.boxSizes);
    } else {
      game.ctx.drawImage(game.doorOImg, game.doors[i].x*game.boxSizes, game.doors[i].y*game.boxSizes, game.boxSizes, game.boxSizes);
    };
  }
  game.ctx.drawImage(game.playerImg, game.player.x*game.boxSizes, ply*game.boxSizes, game.boxSizes+1, game.boxSizes+1);
  game.ctx.restore();
  document.querySelector(".XandY").innerHTML = "X: "+plx+"<br>Y: "+ply;
  document.querySelector(".objColl").innerHTML = "Objectives Collected: "+game.objectivesCollected+" of "+objectiveIterations;
  if(game.objectives.length <= 5) {
    document.querySelector(".objColl").innerHTML += "<br>"+game.announce.join("<br>");
  };
  backgroundMusic();
}

//This function creates the array that the map made in "randomMap()" will be stored in using the user inputted parameters or presets;
  //It uses the try-and-catch method to allow the function to continue even with an error, as it will run into the side of the wall and at that point it needs to stop;
  //If values are not acceptable it will then do an "alert()" to notify the user;
function getMap() {
  objectiveIterations = 0;
  var x2;
  var iterInput;
  if(document.getElementById("defaults").value != "none") {
    eval("maxObjectiveIterations = game.defaults."+document.getElementById("defaults").value+".obj");
    eval("x2 = game.defaults."+document.getElementById("defaults").value+".dim");
    eval("iterInput = game.defaults."+document.getElementById("defaults").value+".iter");
  } else {
    maxObjectiveIterations = document.getElementById("objectivesInput").value;
    x2 = document.getElementById("xMapInput").value;
    iterInput = document.getElementById("interationInput").value;
  };
  var array1 = [];
  var array2 = [];
  if(x2 > 0) {
    var arr = [];
    for(let i = 0; i < x2; i++) {
        arr[i] = [];
        for(let j = 0; j < x2; j++) {
            arr[i][j] = 0;
        }
    }
    game.tilemaps.maze1 = arr;
    ran = 0;
    objectiveIterations = 0;
    game.objectives = [];
    game.doors = [];
    game.objectivesCollected = 0;
    totalRoomIter = iterInput;
    branching = 0;
    processing = 0;
    ran = 0;
    try{
    randomMap(iterInput/4, 0, 0, 0);
    } catch {};
    processing = 1;
    branching = 0;
    ran = 0;
    try{
    randomMap(iterInput/4, 0, 0, 1);
    } catch {};
    processing = 2;
    branching = 0;
    ran = 0;
    try{
    randomMap(iterInput/4, 0, 0, 2);
    } catch {};
    processing = 3;
    branching = 0;
    ran = 0;
    try{
    randomMap(iterInput/4, 0, 0, 3);
    } catch {};
    processing = 4;
    branching = 0;
    ran = 0;
  } else {
    alert("Invalid Input!");
  };
}

//Global functions to be used in "randomMap()";
var processing = 0;
var totalRoomIter = 0;
var branching = 0;
var ran = 0;
var objectiveIterations = 0;
var maxObjectiveIterations = 0;

//The function "randomMap()" is the most important function as it makes the random map the player goes through;
  //The roomIterations{int} parameter is the input of how many "tries" for rooms it will attempt;
  //The x{int}, and y{int}, parameters determine if it is a branching line or if it is a starting line;
    //If it is a branch then the x and y parameters are where that line starts;
  //The dir{int} parameter determines the starting direction of the line;
  //The isBranching{bool} parameter determines if the current run of "randomMap()" is a branch or a main line;
  //The function takes all of that data as well as the global variables listed above to make a fully randomized map;
    //Though it can look a little messy;
  //There can be two variations of tunnels;
    //A 1 wide and a 3 wide - whether it does one or the other is completely random;
  //It also uses Math.random() to decide which direction to face (after it is far enough away from the central point);
  //This function also decides where the objectives and doors are placed;
  //Once it is done it calls the "setCanvas()" function and runs "updateCanvas()" as well;
function randomMap(roomIterations, x, y, dir, isBranching) {
  game.player.x = Math.floor(game.tilemaps.maze1[0].length/2);
  game.player.y = Math.floor(game.tilemaps.maze1.length/2);
  var currentObjs = 0;
  if(x && y) {} else {
    var x = Math.floor(game.tilemaps.maze1[0].length/2);
    var y = Math.floor(game.tilemaps.maze1.length/2);
  };
  if(x == 0 && y == 0) {
    var x = Math.floor(game.tilemaps.maze1[0].length/2);
    var y = Math.floor(game.tilemaps.maze1.length/2);
  }
  var type = 0;
  var xMod = 0;
  var yMod = 0;
  var mapC = game.tilemaps.maze1;
  for(var i = 0;i<roomIterations;i++) {
    if(isBranching) {} else {
      console.log(i+(processing*(totalRoomIter/4)) + " out of " + totalRoomIter);
    };
    let rando = Math.floor(Math.random()*4);
    let rando2;
    if((ran > (game.tilemaps.maze1[0].length)/50)) {
      rando2 = Math.floor(Math.random()*4);
    } else {
      rando2 = dir;
      i--;
    };
    if(Math.floor(Math.random()*2) == 1) {
      rando2 = dir;
    }
    ran += 1;
    let rando3 = Math.floor(Math.random()*15)+3;
    if(rando2 == 0 && xMod != -1) {
      xMod = 1;
      yMod = 0;
    } else if(rando2 == 1 && xMod != 1) {
      xMod = -1;
      yMod = 0;
    } else if(rando2 == 2 && yMod != -1) {
      xMod = 0;
      yMod = 1;
    } else if(rando2 == 3 && yMod != 1) {
      xMod = 0;
      yMod = -1;
    }
    if(rando == 0 && x+(xMod*rando3) < mapC[0].length && y+(yMod*rando3) < mapC.length) {
      if(x+(xMod*rando3) >= 0 && y+(yMod*rando3) >= 0 || xMod > 0 && yMod > 0) {
        if(Math.floor(Math.random()*20) > 5) {
          var activeDoor = false;
          if(Math.floor(Math.random()*2) > 0) {
            activeDoor = true;
          };
          if(xMod == 0) {
            if(mapC[y][x-1] == 0 && mapC[y][x+1] == 0) {
              game.doors.push({x: x, y: y, ac: activeDoor});
            };
          } else {
            if(mapC[y-1][x] == 0 && mapC[y+1][x] == 0) {
              game.doors.push({x: x, y: y, ac: activeDoor});
            };
          };
        };
        for(var o=0;o<rando3;o++) {
          if(mapC[y][x] == 0) {
            if(mapC[y][x] == 2) {} else {
              mapC[y][x] = 1;
            }
            x += xMod;
            y += yMod;
          } else {
            x -= xMod;
            y -= yMod;
          };
        };
      };
    } else if(rando == 1 && x > 0) {
      if((((x+(xMod*rando3) >= 0 || (x+yMod >=0 && x-yMod >=0)) && (y+(yMod*rando3) >= 0 || (y+xMod >= 0 && y-xMod >= 0))) || xMod > 0 && yMod > 0) && x+(xMod*rando3) < mapC[0].length && y+(yMod*rando3) < mapC.length) {
        for(var o=0;o<rando3;o++) {
          if(mapC[y][x] == 0) {
            if(mapC[y][x] == 2) {} else {
              mapC[y][x] = 1;
            }
            if(mapC[y-xMod][x+yMod] == 2) {} else {
              mapC[y-xMod][x+yMod] = 1;
            }
            if(mapC[y+xMod][x-yMod] == 2) {} else {
              mapC[y+xMod][x-yMod] = 1;
            }
            x += xMod;
            y += yMod;
          } else {
            x -= xMod;
            y -= yMod;
          };
        };
      };
    } else if(rando == 2 && branching < (roomIterations/5)/4 && i > (roomIterations/3)) {
      branching += 1;
      randomMap(roomIterations/2, x, y, Math.floor(Math.random()*4), true);
    } else if(rando == 3 && y > 0) {
      if(Math.random()*50 > 40 && objectiveIterations < maxObjectiveIterations && currentObjs < maxObjectiveIterations/4) {
        mapC[y][x] = 1;
        game.objectives.push({x: x, y: y});
        x += xMod;
        y += yMod;
        objectiveIterations++;
        currentObjs++;
      } else {
        i--;
      };
    };
  };
  setCanvas();
  updateCanvas(game.player.x, game.player.y);
};

//Keydown detectors --------------------
window.onkeydown = function(e) {
	if(e.keyCode == 87 || e.keyCode == 38) {
    if(game.player.dW == true) {
		  game.player.Mw = true;
      game.player.dW = false;
    };
	};
	if(e.keyCode == 68 || e.keyCode == 39) {
    if(game.player.dD == true) {
		  game.player.Md = true;
      game.player.dD = false;
    };
	};
	if(e.keyCode == 65 || e.keyCode == 37) {
    if(game.player.dA == true) {
		  game.player.Ma = true;
      game.player.dA = false;
    };
	};
	if(e.keyCode == 83 || e.keyCode == 40) {
    if(game.player.dS == true) {
		  game.player.Ms = true;
      game.player.dS = false;
    };
	};
	if(e.keyCode == 69 || e.keyCode == 16) {
		updateCanvas(game.player.x, game.player.y);
	};
	if(e.keyCode == 67) {
		game.player.Mcontrol = true;
	};
};

//Keyup detectors ----------------
window.onkeyup = function(e) {
	if(e.keyCode == 87 || e.keyCode == 38) {
		game.player.Mw = false;
      game.player.dW = true;
	};
	if(e.keyCode == 68 || e.keyCode == 39) {
		game.player.Md = false;
      game.player.dD = true;
	};
	if(e.keyCode == 65 || e.keyCode == 37) {
		game.player.Ma = false;
      game.player.dA = true;
	};
	if(e.keyCode == 83 || e.keyCode == 40) {
		game.player.Ms = false;
      game.player.dS = true;
	};
	if(e.keyCode == 67) {
		game.player.Mcontrol = false;
	};
};