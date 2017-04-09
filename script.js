var canvas = document.getElementById("mario");
var ctx = canvas.getContext("2d");
var x = 0;

//BACKGROUND

//ground height
var ground = 50;
//how far the ground goes to the right
var groundLength = 1000;

var grassHeight = 5;
var grassWidth = 7;

//gradient for sea
var sea = ctx.createLinearGradient(0,canvas.height-ground,0,canvas.height);
sea.addColorStop(0,"#0099ff");
sea.addColorStop(1,"#000099");  

//gradient for ground
var grd = ctx.createLinearGradient(0,canvas.height-ground,0,canvas.height);
grd.addColorStop(0,"#86592d");
grd.addColorStop(1,"#290a0a");  

//generic shape to use as clouds and shrubs
function drawShape(startX, startY, size, color){
    
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(startX - 40 *size, startY + 10*size, startX - 20*size, startY + 100*size, startX + 60*size, startY + 70*size);
  ctx.bezierCurveTo(startX + 60*size, startY + 100*size, startX + 150*size, startY + 100*size, startX + 150*size, startY + 70*size);
  ctx.bezierCurveTo(startX + 200*size, startY + 100*size, startX + 250*size, startY + 40*size, startX + 210*size, startY + 20*size);
  ctx.bezierCurveTo(startX + 240*size, startY - 20*size, startX + 210*size, startY - 50*size, startX + 170*size, startY - 30*size);
  ctx.bezierCurveTo(startX + 160*size, startY - 80*size, startX + 80*size, startY - 80*size, startX + 70*size, startY - 30*size);
  ctx.bezierCurveTo(startX + 70*size, startY - 50*size, startX - 10*size, startY - 60*size, startX, startY);
  ctx.fillStyle = color;
  ctx.fill();
}//end of draw shape

function drawShrub(w, size, berries, berriesColor){
  drawShape(w, canvas.height-78, size, 'darkgreen');
  
  var d = [15, -15, 35, 3, -15, 25, -5, -35, 40, 10, -10, 30, 0];
  if(berries){
    for(var i=1; i < 14; i++){
    ctx.beginPath();
    ctx.arc(w + 15 * i * size, canvas.height-80 + d[i-1] * size, 2, 0, 2*Math.PI);
    ctx.fillStyle = berriesColor;
    ctx.fill();
  }
  }  
}//end of draw shrub

//arr - array with clouds coordinates(x and y)
function drawClouds(arr){ 
  
  for(var i = 0; i< arr.length; i++){
    drawShape(arr[i][0], arr[i][1], 1/3, 'white');
  }  
    
}//end of draw cloud

function drawHill(start, size){
  var h = canvas.height - ground;
  ctx.beginPath();
  ctx.moveTo(start, h);
  ctx.bezierCurveTo(start +50 * size, h -80 * size, start+50 * size, h-80 * size, start +100 * size, h);  
  ctx.fillStyle = '#194d19';
  ctx.fill();
  ctx.strokeStyle = "#003300";
  ctx.lineWidth = 2;
  ctx.stroke(); 
}// end of draw hill

function drawGround(){
  
  if(x > 300){
    ctx.fillStyle = sea;
    ctx.fillRect(0, canvas.height-ground +10, 0+x-300, ground);
    ctx.fillStyle = grd;
    ctx.fillRect(0+x-300,canvas.height-ground,canvas.width,ground);
  }else if(x < - groundLength){
    ctx.fillStyle = sea;
    ctx.fillRect(canvas.width + groundLength + x, canvas.height-ground +10, canvas.width, ground);
    ctx.fillStyle = grd;
    ctx.fillRect(0,canvas.height-ground,canvas.width + groundLength + x,ground);
  }else{
    ctx.fillStyle = grd;
    ctx.fillRect(0,canvas.height-ground,canvas.width,ground);
  }
}//end of draw ground

function drawGrass(){
  ctx.fillStyle = 'green';
  
  if(x > 300){
    
    ctx.beginPath();
    ctx.moveTo(x-300, canvas.height - ground + 1);
    for(var i =x-300; i < canvas.width; i += grassWidth){
      ctx.lineTo(grassWidth/2 + i, canvas.height - ground - grassHeight);
      ctx.lineTo(grassWidth + i, canvas.height - ground + 1);    
    }
    ctx.fill();
  }else if(x < - groundLength){
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ground + 1);
    for(var i =0; i < canvas.width + groundLength + x - grassWidth; i += grassWidth){
      ctx.lineTo(grassWidth/2 + i, canvas.height - ground - grassHeight);
      ctx.lineTo(grassWidth + i, canvas.height - ground + 1);    
    }
    ctx.fill();
  }else{
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ground + 1);
    for(var i =0; i < canvas.width; i += grassWidth){
      ctx.lineTo(grassWidth/2 + i, canvas.height - ground - grassHeight);
      ctx.lineTo(grassWidth + i, canvas.height - ground + 1);    
    }
    ctx.fill();
  }
  /*
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - ground + 1);  
  for(var i =0; i < canvas.width; i += grassWidth){
    ctx.lineTo(grassWidth/2 + i, canvas.height - ground - grassHeight);
    ctx.lineTo(grassWidth + i, canvas.height - ground + 1);    
  }  
  ctx.fill();
  */
}//end of draw grass

function drawBackground(){
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHill(55+x, 2.8);
  drawHill(700+x, 2);
  drawHill(750+x, 2.3);
  drawHill(1300+x, 2.8);
  drawShrub(40+x, 1/2, false);
  drawShrub(100+x, 1/2.5, false);
  drawShrub(500+x, 1/2.5, true, '#ff0055');
  drawShrub(700+x, 1/2.5, true, 'yellow');
  drawShrub(1100+x, 1/1.8, false);
  drawShrub(1700+x, 1/2.5, true, '#ff0055');
  drawTubes([[100+x, 100]]);
  drawGround();  
  drawGrass(x);  
  drawClouds([[100+x, 40], [300+x, 70], [330+x, 70], [700+x, 40], [850+x,85], [1200+x, 40], [1400+x, 70], [1430+x, 70], [1900+x, 50]]);
  //requestAnimationFrame(draw);
  drawPlatforms([[500+x,300]]);
  //drawCastle(100+x);
  
}//end of draw background

window.addEventListener('keydown',this.check,false);

function check(e) {
    switch (e.keyCode) {
        case 37: scrollRight(); break; //left key
        case 39: scrollLeft(); break; //right key
    }
}

//when RIGHT key is pressed
function scrollLeft(){  
  if( x > - (groundLength + canvas.width / 2)){
    x -= 3;
  }
}

//when LEFT key is pressed
function scrollRight(){  
  if(x < 300 + canvas.width / 2){
     x += 3;
  }
}

//PLATFORMS AND TUBES

//arr - array with platforms coordinates
function drawPlatforms(arr){
  for(var a = 0; a < arr.length; a++){
    drawWall(arr[a][0], arr[a][1]); 
  } 
}

//xP, yP - start coordinates
function drawWall(xP, yP){

  var pWidth = 200;
  var pHeight = 40;
  var brickWidth = 40;
  var brickHeight = 10;
  var halfBrick = brickWidth / 2;

  ctx.fillStyle = '#ff8000';
  ctx.strokeStyle='black';  
   
  ctx.fillRect(xP, yP, pWidth, pHeight);
  
    for(var i = 0; i <= pHeight; i +=brickHeight){
      
      ctx.beginPath();
      ctx.moveTo(xP,yP + i);
      ctx.lineTo(xP + pWidth, yP + i);
      ctx.stroke();

      if(i < pHeight){
        for(var j = 0; j <= pWidth; j += brickWidth){
          if((i / brickHeight) % 2 == 0){
            ctx.beginPath();
            ctx.moveTo(xP + j, yP + i);
            ctx.lineTo(xP+ j, yP + i + brickHeight);
            ctx.stroke();
          }else if(j != pWidth){
            ctx.beginPath();
            ctx.moveTo(xP + j + halfBrick, yP + i);
            ctx.lineTo(xP+ j + halfBrick, yP + i + brickHeight);
            ctx.stroke();
          }        
       }
      }      
    }

}//end of draw walls

//arr - array with x coords and tubes heights
function drawTubes(arr){

  var tubeColor = '#00e600';
  var tubeShadow = '#009900';

  var grdT = ctx.createLinearGradient(0,canvas.height-ground,0,canvas.height);
  grdT.addColorStop(0,"#006600");
  grdT.addColorStop(1,"#000099");

  for(var i = 0; i < arr.length; i++){

    var xT = arr[i][0];
    var heightTube = arr[i][1];

    ctx.strokeStyle = 'black';  

    ctx.fillStyle = tubeColor;
    ctx.fillRect(xT, canvas.height - ground - heightTube + 2, 60, heightTube);
    ctx.strokeRect(xT, canvas.height - ground - heightTube + 2, 60, heightTube);
    ctx.fillStyle = tubeShadow;
    ctx.fillRect(xT + 30, canvas.height - ground - heightTube + 3, 25, heightTube - 1);
    ctx.fillRect(xT + 5, canvas.height - ground - heightTube + 3, 2, heightTube - 1);
    ctx.fillRect(xT + 10, canvas.height - ground - heightTube + 3, 4, heightTube - 1);

    ctx.fillStyle = tubeColor;
    ctx.fillRect(xT - 5, canvas.height - ground - heightTube - 30, 70, 30);
    ctx.strokeRect(xT - 5, canvas.height - ground - heightTube - 30, 70, 30);
    ctx.fillStyle = tubeShadow;
    ctx.fillRect(xT + 30, canvas.height - ground - heightTube - 30 + 1, 30, 28);
    ctx.fillRect(xT, canvas.height - ground - heightTube - 30 + 1, 2, 28);
    ctx.fillRect(xT + 5, canvas.height - ground - heightTube - 30 + 1, 3, 28);
  }

}

//CASTLE
//for platform width 200, platform height 40
function drawCastle(x){

  var heightBase = 5;
  var heightTower = 3;

  for(var i = 0; i < heightBase; i++){
    drawWall(x, canvas.height - ground - 40 - 40 * i);
    drawWall(x + 200, canvas.height - ground - 40 - 40 * i);
  }

  for(var j = 0; j < heightTower; j++){
    drawWall(x + 100, canvas.height - ground - 40 - 40 * heightBase - 40 * j);
  }

  ctx.fillStyle = '#ff4000';
  ctx.strokeStyle='black';

  for(var k =0; k < 10; k++){
    ctx.fillRect(x + k * 41, canvas.height - ground - 40 * heightBase - 30, 30, 30);
    ctx.strokeRect(x + k * 41, canvas.height - ground - 40 * heightBase - 30, 30, 30);
  }

  for(var l =0; l < 5; l++){
    ctx.fillRect(x + 100 + l * 42, canvas.height - ground - 40 * heightBase - 40 * heightTower - 30, 30, 30);
    ctx.strokeRect(x + 100 + l * 42, canvas.height - ground - 40 * heightBase - 40 * heightTower - 30, 30, 30);
  }

  
}


//MOVING MARIO

var img = document.getElementById('img');
var marioSize = 70,
    x1 = canvas.width / 2 - marioSize / 2,
    y = canvas.height - ground - marioSize + 1,
    dx = 0,
    dy = -4,
    src_x = 2,
    src_y = 29,
    src_w = 32,
    src_h = 47,
    movingLeft = false,
    movingRight = false,
    idle = true,
    facingLeft = false;

document.addEventListener('keydown', keyHandler, true);
document.addEventListener('keyup', upHandler, true);

function upHandler() {
  idle = true;
}

function keyHandler(k) {
  switch (k.keyCode) {
    case 38:
    case 87:
      y += dy;
      break;
    case 40:
    case 83:
      y -= dy;
      break;
    case 37:
    case 65:
      x1 -= dx;
      movingLeft = true;
      facingLeft = true;
      idle = false;
      break;
    case 39:
    case 68:
      x1 += dx;
      movingRight = true;
      facingLeft = false;
      idle = false;
      break;
                     }
}

function drawFlippedMario() {
  ctx.scale(-1, 1);
  ctx.drawImage(img, src_x, src_y, src_w, src_h, -(x1 + marioSize), y, marioSize, marioSize);
  ctx.scale(-1, 1);
}

function drawMario() {
  ctx.drawImage(img, src_x, src_y, src_w, src_h, x1, y, marioSize, marioSize);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground()
  if (facingLeft) {
    drawFlippedMario();
  } else {
    drawMario();
  }
  
  if (movingRight) {
    src_x += 35;
    if (src_x == 107) {
      src_x = 2;
    }
  }
  
  if (movingLeft) {
    if (src_x == 2) {
      src_x = 107;
    } else {
      src_x -= 35;
    } 
  }
  
  if (idle) {
    src_x = 2;
  }
  
  movingRight = false;
  movingLeft = false;
  requestAnimationFrame(draw);
}

draw();