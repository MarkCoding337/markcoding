const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');

var dragging = false;

const ctx = canvas.getContext('2d');

let canvasOffsetX = canvas.offsetLeft;
let canvasOffsetY = canvas.offsetTop;

function setDrawSize(newWidth, newHeight) {
  canvas.width = newWidth;
  canvas.height = newHeight;
  canvas.style.top = (window.innerHeight-toolbar.offsetHeight)/2-canvas.height/2+"px";
  

  canvasOffsetX = canvas.offsetLeft;
  canvasOffsetY = canvas.offsetTop;
};

setDrawSize(window.innerWidth-10, window.innerHeight-toolbar.offsetHeight);

/*canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;*/

let isPainting = false;
let lineWidth = 5;
let tempLineWidth = 5;
let startX;
let startY;
let color = "black";
var tool = "Pencil";
let pathsry = [];
let points = [];
let backgroundColor = "#FFFFFF";

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
      if(confirm("Are you sure you wish to clear the drawing?")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pathsry = [];
      };
    }
  if(e.target.className === "brushTool") {
    tool = e.target.value;
  }
  if(e.target.className === "functionTool") {
    eval(e.target.value+"();");
  }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'color') {
        ctx.strokeStyle = e.target.value;
        ctx.fillStyle = e.target.value;
      color = e.target.value;
    }
  
    if(e.target.id === 'bgcolor') {
      let kkk = ctx.fillStyle;
      ctx.fillStyle = e.target.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      backgroundColor = e.target.value;
      ctx.fillStyle = kkk;
      drawPaths();
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
        
    }
});

/*canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener("pointerdown", e => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
  console.log("start");
});


canvas.addEventListener('pointerup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
  console.log("end")
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }
  console.log("move")
  if(tool === "Eraser") {
    ctx.strokeStyle = 0xFFFFFF;
  };
  if(tool === "Pencil") {

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
    ctx.stroke();
  }
}

//canvas.addEventListener('mousemove', draw);
canvas.addEventListener('pointermove', draw);*/

function getMousePosition(e) {
  if(e.offsetX) {
    var mouseX = e.offsetX * canvas.width / canvas.clientWidth | 0;
    var mouseY = e.offsetY * canvas.height / canvas.clientHeight | 0;
  } else {
    var mouseX = e.touches[0].clientX-canvasOffsetX;
    var mouseY = e.touches[0].clientY-canvasOffsetY;
  };
    return {x: Math.floor(mouseX*10)/10, y: Math.floor(mouseY*10)/10};
}

ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;


var putPoint = function (e) {
  e.preventDefault();
    if (dragging) {
        points.points.push({x: getMousePosition(e).x, y: getMousePosition(e).y});
        ctx.lineTo(getMousePosition(e).x, getMousePosition(e).y);
        ctx.lineWidth = lineWidth * 2;
        if(tool === "Eraser") {
          ctx.lineWidth = lineWidth*4
        }
        ctx.stroke();
        ctx.beginPath();
        if(tool === "Eraser") {
          ctx.arc(getMousePosition(e).x, getMousePosition(e).y, lineWidth*2, 0, Math.PI * 2);
        } else {
          ctx.arc(getMousePosition(e).x, getMousePosition(e).y, lineWidth, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(getMousePosition(e).x, getMousePosition(e).y);
    }
};

var engage = function (e) {
    dragging = true;
  if(tool === "Eraser") {
        ctx.strokeStyle = backgroundColor;
        ctx.fillStyle = backgroundColor;
        points = {color: backgroundColor, points: [], lineWidth: lineWidth*2};
  } else {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        points = {color: color, points: [], lineWidth: lineWidth};
  }
    putPoint(e);
};
var disengage = function () {
  
    dragging = false;
    if(points.points.length > 0) {
      pathsry.push(points);
      points = {color: color, points: [], lineWidth: lineWidth};
    }
    ctx.beginPath();
};

function drawPaths(){
  // delete everything
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // draw all the paths in the paths array
  pathsry.forEach(path=>{
    if(path.color === "nope") {
      ctx.strokeStyle = backgroundColor;
      ctx.fillStyle = backgroundColor;
    } else {
      ctx.strokeStyle = path.color;
      ctx.fillStyle = path.color;
    };
    tempLineWidth = path.lineWidth;
    ctx.beginPath();
    ctx.moveTo(path.points[0].x,path.points[0].y); 
    ctx.beginPath();
    ctx.arc(path.points[0].x, path.points[0].y, tempLineWidth, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath(); 
    ctx.moveTo(path.points[0].x, path.points[0].y);
  for(let i = 1; i < path.points.length; i++){
    ctx.lineTo(path.points[i].x,path.points[i].y); 
    ctx.lineWidth = tempLineWidth * 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(path.points[i].x, path.points[i].y, tempLineWidth, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(path.points[i].x,path.points[i].y);
  }
    ctx.beginPath();
  })
}

function Undo(){
  // remove the last path from the paths array
  pathsry.splice(-1,1);
  // draw all the paths in the paths array
  drawPaths();
}

function closeToolbar() {
  toolbar.style.display = "none";
  canvas.style.top = (window.innerHeight)/2-canvas.height/2+"px";

  canvasOffsetX = canvas.offsetLeft;
  canvasOffsetY = canvas.offsetTop;
  document.getElementById("closeOpenToolbar").setAttribute("onclick", "openToolbar()");
  document.getElementById("closeOpenToolbar").innerHTML = "Open";
}

function openToolbar() {
  toolbar.style.display = "";
  canvas.style.top = (window.innerHeight-toolbar.offsetHeight)/2-canvas.height/2+"px";

  canvasOffsetX = canvas.offsetLeft;
  canvasOffsetY = canvas.offsetTop;
  document.getElementById("closeOpenToolbar").setAttribute("onclick", "closeToolbar()");
  document.getElementById("closeOpenToolbar").innerHTML = "Close";
}

canvas.addEventListener('mousedown', engage);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', disengage);
document.addEventListener('mouseup', disengage);
canvas.addEventListener('ctxmenu', disengage);

canvas.addEventListener('touchstart', engage, false);
canvas.addEventListener('touchmove', putPoint, false);
canvas.addEventListener('touchend', disengage, false);