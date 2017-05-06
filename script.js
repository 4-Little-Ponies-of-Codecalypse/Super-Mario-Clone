document.addEventListener('DOMContentLoaded', function () {
    runGame();
});

function runGame(){

  const canvas = document.getElementById('mario'),
        ctx = canvas.getContext('2d');
  var xCam = 0;
    
  var tick = 0;

  var hit = false;

  //y coordanate coefficient
  //needed for possibility to change canvas height without touching arrays
  var hCoeff = canvas.height - 400;

  //arrays with x and y coordinates
  var platforms = [[100, 220 + hCoeff, 200, 40], [1000, 100 + hCoeff, 120, 40], [1300, 100, 40, 160], [1340, 100, 160, 40], [1300, 220 + hCoeff, 200, 40], [1830, 110 + hCoeff, 200, 40], [1880, 220, 100, 40], [2180, 160, 40, 40], [2380, 220, 40, 40], [2500, 100, 40, 40]],
      pipes = [[600, 250 + hCoeff, 60, 1000], [800, 200 + hCoeff, 60, 1000], [900, 280 + hCoeff, 60, 1000], [1630, 170, 60, 1000], [2700, 250 + hCoeff, 60, 1000]],
      clouds = [[100, 40], [300, 70], [330, 70], [700, 40], [850,85], [1200, 40], [1400, 70], [1430, 70], [1900, 50]];
  //array with x coord, size and berries color (false if no berries)
  var shrubs = [[40, 1/2, false], [100, 1/2.5, false], [485, 1/2.5, '#ff0055'], [690, 1/2.5, 'yellow'], [1100, 1/1.8, false], [1710, 1/2.5, '#ff0055']];
  //array with x coord and size
  var hills = [[55, 2.8], [950, 2], [1000, 2.3], [1300, 2.8]];

  //BACKGROUND

  //ground height
  var ground = 50;
  //how far the ground goes to the right
  var groundLength = 4000;

  var grassHeight = 5,
      grassWidth = 7;

  //gradient for sea
  var sea = ctx.createLinearGradient(0, canvas.height - ground, 0, canvas.height);
  sea.addColorStop(0, "#0099ff");
  sea.addColorStop(1, "#000099");  

  //gradient for ground
  var grd = ctx.createLinearGradient(0, canvas.height - ground, 0, canvas.height);
  grd.addColorStop(0, "#86592d");
  grd.addColorStop(1, "#290a0a");  

  //generic shape to use as clouds and shrubs
  function drawShape(startX, startY, size, color) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(startX - 40 * size, startY + 10 * size, startX - 20 * size, startY + 100 * size, startX + 60 * size, startY + 70 * size);
    ctx.bezierCurveTo(startX + 60 * size, startY + 100 * size, startX + 150 * size, startY + 100 * size, startX + 150 * size, startY + 70 * size);
    ctx.bezierCurveTo(startX + 200 * size, startY + 100 * size, startX + 250 * size, startY + 40 * size, startX + 210 * size, startY + 20 * size);
    ctx.bezierCurveTo(startX + 240 * size, startY - 20 * size, startX + 210 * size, startY - 50 * size, startX + 170 * size, startY - 30 * size);
    ctx.bezierCurveTo(startX + 160 * size, startY - 80 * size, startX + 80 * size, startY - 80 * size, startX + 70 * size, startY - 30 * size);
    ctx.bezierCurveTo(startX + 70 * size, startY - 50 * size, startX - 10 * size, startY - 60 * size, startX, startY);
    ctx.fillStyle = color;
    ctx.fill();
  } //end of draw shape

  //arr - array with x coords, sizes, berries
  function drawShrubs(arr) {
    var start, size, berries, berriesColor;
    //d - berries distrubution
    var d = [15, -15, 35, 3, -15, 25, -5, -35, 40, 10, -10, 30, 0];
    for (var i = 0; i < arr.length; i++) {
      start = arr[i][0];
      size = arr[i][1];
      berries = arr[i][2];

      drawShape(start, canvas.height - 78, size, 'darkgreen');
      if (berries != false) {
        for (var j = 1; j < 14; j++) {
          ctx.beginPath();
          ctx.arc(start + 15 * j * size, canvas.height-80 + d[j - 1] * size, 2, 0, 2 * Math.PI);
          ctx.fillStyle = berries;
          ctx.fill();
        }
      } 
    }
  } //end of draw shrubs

  //arr - array with clouds coordinates(x and y)
  function drawClouds(arr) { 
    for (var i = 0; i < arr.length; i++) {
      drawShape(arr[i][0], arr[i][1], 1/3, 'white');
    }     
  } //end of draw clouds

  //arr - array with x coords and sizes
  function drawHills(arr) {
    var start, size;
    for (var i = 0; i < arr.length; i++) {
      start = arr[i][0];
      size = arr[i][1]
      var h = canvas.height - ground;
      ctx.beginPath();
      ctx.moveTo(start, h);
      ctx.bezierCurveTo(start + 50 * size, h - 80 * size, start + 50 * size, h - 80 * size, start + 100 * size, h);  
      ctx.fillStyle = '#194d19';
      ctx.fill();
      ctx.strokeStyle = "#003300";
      ctx.lineWidth = 2;
      ctx.stroke(); 
    }
  } // end of draw hills

  function drawGround() {
    ctx.fillStyle = sea;
    ctx.fillRect(-1000, canvas.height - ground + 10, 1000, ground);
    ctx.fillStyle = grd;
    ctx.fillRect(0, canvas.height - ground, 2810, ground);
    ctx.fillStyle = sea;
    ctx.fillRect(2810, canvas.height - ground + 10, 3610, ground);
    ctx.fillStyle = grd;
    ctx.fillRect(3610, canvas.height - ground, groundLength, ground);
  } //end of draw ground

  function drawGrass() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ground);
    for (var i = 0; i < 2803; i += grassWidth){
      ctx.lineTo(grassWidth / 2 + i, canvas.height - ground - grassHeight);
      ctx.lineTo(grassWidth + i, canvas.height - ground + 1);    
    }
    ctx.moveTo(3610, canvas.height - ground);
    for (var i = 3610; i < groundLength; i += grassWidth){
      ctx.lineTo(grassWidth / 2 + i, canvas.height - ground - grassHeight);
      ctx.lineTo(grassWidth + i, canvas.height - ground + 1);    
    }
    ctx.fill(); 
  } //end of draw grass

  function drawBackground(){
    //ctx.clearRect(0, 0, canvas.width, canvas.height);  
    drawHills(hills);
    drawShrubs(shrubs);
    drawPipes(pipes);
    drawGround();  
    drawGrass();  
    drawClouds(clouds);
    drawPlatforms(platforms);  
  } //end of draw background

  //PLATFORMS AND PIPES

  //arr - array with platforms coordinates
  function drawPlatforms(arr) {
    for (var a = 0; a < arr.length; a++) {
      drawWall(arr[a][0], arr[a][1], arr[a][2], arr[a][3]); 
    } 
  }

  //xP, yP - start coordinates
  function drawWall(xP, yP, pWidth, pHeight) {
    //var pWidth = 200,
      //  pHeight = 40,
    var brickWidth = 40,
        brickHeight = 10,
        halfBrick = brickWidth / 2;
    ctx.fillStyle = '#ff8000';
    ctx.strokeStyle = 'black';  
    ctx.fillRect(xP, yP, pWidth, pHeight);
    for (var i = 0; i <= pHeight; i += brickHeight) {
      ctx.beginPath();
      ctx.moveTo(xP,yP + i);
      ctx.lineTo(xP + pWidth, yP + i);
      ctx.stroke();
      if(i < pHeight) {
        for(var j = 0; j <= pWidth; j += brickWidth) {
          if((i / brickHeight) % 2 == 0) {
            ctx.beginPath();
            ctx.moveTo(xP + j, yP + i);
            ctx.lineTo(xP+ j, yP + i + brickHeight);
            ctx.stroke();
          } else if (j != pWidth) {
            ctx.beginPath();
            ctx.moveTo(xP + j + halfBrick, yP + i);
            ctx.lineTo(xP+ j + halfBrick, yP + i + brickHeight);
            ctx.stroke();
          }        
        }
      }      
    }
  } //end of draw walls

  //arr - array with x and y coords
  function drawPipes(arr){
    var pipeColor = '#00e600',
        pipeShadow = '#009900',
        grdT = ctx.createLinearGradient(0,canvas.height-ground,0,canvas.height);
    grdT.addColorStop(0,"#006600");
    grdT.addColorStop(1,"#000099");
    for (var i = 0; i < arr.length; i++) {
      var xPipe = arr[i][0],
          yPipe = arr[i][1];
      ctx.strokeStyle = 'black';  
      ctx.fillStyle = pipeColor;
      ctx.fillRect(xPipe, yPipe + 32, 60, canvas.height - ground);
      ctx.strokeRect(xPipe, yPipe + 32, 60, canvas.height - ground);
      ctx.fillStyle = pipeShadow;
      ctx.fillRect(xPipe + 30, yPipe + 32 + 1, 25, canvas.height - ground);
      ctx.fillRect(xPipe + 5, yPipe + 32 + 1, 2, canvas.height - ground);
      ctx.fillRect(xPipe + 10, yPipe + 32 + 1, 3, canvas.height - ground);
      ctx.fillStyle = pipeColor;
      ctx.fillRect(xPipe - 5, yPipe, 70, 30);
      ctx.strokeRect(xPipe - 5, yPipe, 70, 30);
      ctx.fillStyle = pipeShadow;
      ctx.fillRect(xPipe + 30, yPipe + 1, 30, 28);
      ctx.fillRect(xPipe, yPipe + 1, 2, 28);
      ctx.fillRect(xPipe + 5, yPipe + 1, 3, 28);
    }
  }

  var dragonHides = true;
  var dragonDefeated = false;
  var opacity = 1;
  var oShift = -0.1;
  //CASTLE
  function drawCastle(x) {
    var baseWidth = 40 * 5;
    var baseHeight = 10 * 15;
    var towerWidth = 40 * 3;
    var towerHeight = 10 * 5;

    drawWall(x, canvas.height - ground - baseHeight, baseWidth, baseHeight);
    drawWall(x + 40, canvas.height - ground - baseHeight - towerHeight, towerWidth, towerHeight);

    var start = x + 40;
    var h = canvas.height - ground;
    ctx.beginPath();
    ctx.moveTo(start, h);
    ctx.bezierCurveTo(start, h - baseHeight, start + 40 * 3, h - baseHeight, start + 40 * 3, h);  
    ctx.fillStyle = 'black';
    ctx.fill();

    var eyes = 'rgb(255, 0, 0, '+ opacity + ')'
    if(dragonHides){      
      ctx.beginPath();
      ctx.arc(x+baseWidth/2 - 15, h - baseHeight/2 + 15, 3, 0, 2 * Math.PI);
      ctx.fillStyle = eyes;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x+baseWidth/2 + 15, h - baseHeight/2 + 15, 3, 0, 2 * Math.PI);
      ctx.fillStyle = eyes;
      ctx.fill();
    }

    if(tick % 5 == 0){
      opacity += oShift;
    }
    if(opacity >= 1){
      oShift = -0.1;
    }else if(opacity <= 0){
      oShift = 0.1;
    }

  }

  //COLLISION DETECTION
  function detectCollisionX(arr) {
    var xObs,
        yObs,
        widthObs,
        heightObs;
    
    for(var i = 0; i < arr.length; i++) {
      xObs = arr[i][0];
      yObs = arr[i][1];
      widthObs = arr[i][2];
      heightObs = arr[i][3];
      if(x > xObs - marioSize + 15 && x < xObs + widthObs - 15 && y + marioSize > yObs && y + 18 < yObs + heightObs){
      // console.log('x:', x, 'xObs', xObs);
        return xObs;
      }
    }
    return false;
  }

  function detectCollisionY(arr) {
    var xObs,
        yObs,
        widthObs,
        heightObs;
    
    for(var i = 0; i < arr.length; i++) {
      xObs = arr[i][0];
      yObs = arr[i][1];
      widthObs = arr[i][2];
      heightObs = arr[i][3];
      if(x > xObs - marioSize + 15 && x < xObs + widthObs - 15 && y + marioSize > yObs && y + 18 < yObs + heightObs){
        return yObs;
      }
    }
    return false;
  }

  //MOVING MARIO 
  const img = document.getElementById('img'),
        goomba = document.getElementById('goomba'),
        coin = document.getElementById('coin'),
        muncher = document.getElementById('muncher'),
        heart = document.getElementById('heart');
  var marioSize = 70,
      goombaSize = 35,
      coinSize = 25,
      muncherSize = 35,
      x = canvas.width / 2 - marioSize / 2,
      y = canvas.height - ground - marioSize,
      dx = 4,
      dy = -4,
      src_x = 2,
      src_y = 29,
      src_w = 32,
      src_h = 46,
      goo_x = 0,
      goo_y = 0,//15,
      goo_w = 16,
      goo_h = 16,//17,
      coin_x = 2,
      coin_y = 97,
      coin_w = 11,
      coin_h = 15,
      mun_x = 192,
      mun_y = 72,
      mun_w = 16,
      mun_h = 24,
      velocityY = 0,
      velocityX = 2,
      gravity = 0.5,
      gold = 0,
      lives = 3,
      movingLeft = false,
      movingRight = false,
      facingLeft = false,
      onGround = false,
      jumps = false,
      onPlatform = false,
	  dead = false,
      immune = false,
      idle = true;
  var goombas = [[100, 220 - goombaSize], [10, 315], [700, 315], [1000, 315], [1040, 65], [1700, 315]],
      goombasObj = [],
      munchers = [[2240, 317, muncherSize, muncherSize], [2440, 317, muncherSize, muncherSize], [2520, 317, muncherSize, muncherSize]],
      coins = [[120, 185, coinSize, coinSize], [180, 185, coinSize, coinSize], [240, 185, coinSize, coinSize], [670, 200, coinSize, coinSize], [720, 175, coinSize, coinSize], [765, 150, coinSize, coinSize], [1345, 185, coinSize, coinSize], [1375, 185, coinSize, coinSize], [1405, 185, coinSize, coinSize], [1435, 185, coinSize, coinSize], [1465, 185, coinSize, coinSize], [1940, 185, coinSize, coinSize], [1890, 185, coinSize, coinSize], [2505, 65, coinSize, coinSize]],
	  water = [[2810, canvas.height - ground + 10, 3610, canvas.height - ground + 10]];

  document.addEventListener('keydown', keyHandler, false);
  document.addEventListener('keyup', upHandler, false);
  document.addEventListener('keypress', pressHandler, false);

  function upHandler(k) { 
    switch(k.keyCode) {
      case 38:
      case 87:
        if (velocityY < -6.0) {
          velocityY = -6.0;
        }
        idle = true;
        break;
      case 37:
      case 65:
        movingLeft = false;
        idle = true;
        break;
      case 39:
      case 68:
        movingRight = false;
        idle = true;
        break;
                    }
  }

  function keyHandler(k) {
    switch (k.keyCode) {
      case 38:
      case 87:
        if (onGround) {
          velocityY = -12.0;
          onGround = false;
        }
        jumps = true;
        idle = false;
        break;
      case 37:
      case 65:
        movingLeft = true;
        facingLeft = true;
        idle = false;
        break;
      case 39:
      case 68:
        movingRight = true;
        facingLeft = false;
        idle = false;
        break;
      }
  }

  function pressHandler(k){
    if(k.keyCode == 40 || k.keyCode == 83){
      crawl();
    }
  }

  function crawl(){
    if(x > pipes[0][0] - marioSize / 2 && x < pipes[0][0] + 60 - marioSize / 2){
      x += pipes[pipes.length - 1][0] - pipes[0][0];
      xCam += pipes[pipes.length - 1][0] - pipes[0][0];
      y = pipes[pipes.length - 1][1] - marioSize;
    }else if(x > pipes[pipes.length - 1][0] - marioSize / 2 && x < pipes[pipes.length - 1][0] + 60 - marioSize / 2){
      x -= pipes[pipes.length - 1][0] - pipes[0][0];
      xCam -= pipes[pipes.length - 1][0] - pipes[0][0];
      y = pipes[0][1] - marioSize;
    }
  }
  
  function damage() {
    if (lives == 1 && !immune) {
      lives = 0;
      dead = true;
      ctx.font = '48px Audiowide';
      ctx.fillStyle = '#fff';
      ctx.fillText('GAME OVER', 252 + xCam, 200);
    } else if (!immune) {
      lives--;
      hit = true;
      immune = true;
      window.setTimeout(() => {immune = false;}, 2000);
    }
  }

  function drawFlippedMario() {
    ctx.scale(-1, 1);
    ctx.drawImage(img, src_x, src_y, src_w, src_h, -(x + marioSize), y, marioSize, marioSize);
    ctx.scale(-1, 1);
  }

  function drawMario() {
    ctx.save();
    if(hit){
      ctx.shadowBlur = 60;
      ctx.shadowColor = "#E32000";
    }
    
    ctx.drawImage(img, src_x, src_y, src_w, src_h, x, y, marioSize, marioSize);
    ctx.restore();
  }

  function drawCoin(arr) {
    for (let i = 0; i < arr.length; i++) {
      var xCoin = arr[i][0],
          yCoin = arr[i][1];
      ctx.drawImage(coin, coin_x, coin_y, coin_w, coin_h, xCoin, yCoin, coinSize, coinSize);
    }
  }

  function animateCoin() {
    if (coin_x == 50 && tick % 20 == 0) {
      coin_x = 2;
    } else if (tick % 20 == 0) {
      coin_x += 16;
    }
  }

  function drawScore(coeff) {
    ctx.font = '24px Audiowide';
    ctx.fillStyle = '#d39a32';//'#ffce29';
    ctx.drawImage(coin, coin_x, coin_y, coin_w, coin_h, 20 + coeff, 20, coinSize, coinSize);
    ctx.fillText(' x ' + gold, 45 + coeff, 41);
    ctx.drawImage(heart, 19, 43, 21, 25, 20 + coeff, 60, 24, 24);
    ctx.fillStyle = '#E32000';
    ctx.fillText(' x ' + lives, 45 + coeff, 81); // ' x ' + lives
  }

  function drawMuncher(arr) {
    for (let i = 0; i < arr.length; i++) {
      var xMun = arr[i][0],
          yMun = arr[i][1];
      ctx.drawImage(muncher, mun_x, mun_y, mun_w, mun_h, xMun, yMun, muncherSize, muncherSize);
    }
    if (tick % 20 == 0) {
      mun_x += 16;
    } 
    if (mun_x == 192 + 16 * 2){
      mun_x = 192;
    }
  }

  var GoombaObj = function(coord) {
    this.x = coord[0];
    this.y = coord[1];
    this.velocityX = 1.5;
    this.detectCollisionX = function(obs) {
      let xObs,
          yObs,
          widthObs,
          heightObs;
      for (let i = 0; i < obs.length; i++) {
        xObs = obs[i][0],
        yObs = obs[i][1],
        widthObs = obs[i][2],
        heightObs = obs[i][3];
        if (this.x > xObs - goombaSize - 5 && this.x < xObs + widthObs && this.y + goombaSize > yObs && this.y < yObs + heightObs) {        
          return xObs;
        }
      }
      return false;
    };
    this.detectCollisionY = function(obs) {
      let xObs,
          yObs,
          widthObs,
          heightObs;
      for (let i = 0; i < obs.length; i++) {
        xObs = obs[i][0],
        yObs = obs[i][1],
        widthObs = obs[i][2],
        heightObs = obs[i][3];
        if (this.x > xObs - 15 && this.x < xObs + widthObs - goombaSize + 15 && this.y + goombaSize >= yObs && this.y <= yObs + heightObs) {        
          return xObs;
        }
      }
      return false;
    };
    this.drawGoombaObj = function() {
      ctx.drawImage(goomba, goo_x, goo_y, goo_w, goo_h, this.x, this.y, goombaSize, goombaSize);
    };
    this.moveGoombaObj = function() {
      this.x -= this.velocityX;
      if (this.detectCollisionX(pipes) || this.x <= 0) {
        this.velocityX *= -1;
      }    
      if (this.y < canvas.height - ground - goombaSize && !this.detectCollisionY(platforms)) { 
        this.velocityX *= -1;
      }
      
      if(this.detectCollisionY([[x,y, marioSize, marioSize]]) && y + marioSize < this.y + 15){
        goombasObj.splice(goombasObj.indexOf(this), 1);
      }else if(this.detectCollisionX([[x,y, marioSize, marioSize]])){
        this.velocityX *= -1;
        damage();
        if(x < this.x){
          x -= 5;
          xCam -= 5;
          //ugly way to fix the bug when goomba is able to push Mario inside the pipe
          if (detectCollisionX(pipes) || detectCollisionX(platforms)){
            x += 5;
            xCam += 5;
          }
        }else{
          x += 5;
          xCam += 5;
          if (detectCollisionX(pipes) || detectCollisionX(platforms)){
            x -= 5;
            xCam -= 5;
          }
        }
      }
      
      if (goo_x == 144) {
        goo_x = 0;
      } else if(tick % 10 == 0) {
        goo_x += 16;
      }
    };
  };

  for (let i = 0; i < goombas.length; i++) {
    goombasObj.push(new GoombaObj(goombas[i]));
  }

  function jumpMario() {
    velocityY += gravity;
    y += velocityY;
    if (!onGround) {
      if (movingRight) {
        src_x = 37;
      } else {
        src_x = 107;
        velocityX *= -1;
      }
    }
	if (detectCollisionY(water)) { // hits water
      velocityY = 0.0;
      onGround = true;
      jumps = false;
      damage();
	} else if (y > canvas.height - marioSize - ground) { //check if Mario hits the ground
      y = canvas.height - marioSize - ground;
      velocityY = 0.0;
      onGround = true;
      onPlatform = false;
      jumps = false;
    } else if (detectCollisionY(pipes)) { // hits pipes
      velocityY = 0.0;
      onGround = true;
      onPlatform = true;
      jumps = false;
      y = detectCollisionY(pipes) - marioSize;
    } else if (detectCollisionY(platforms)) { // hits platforms
      if (y > detectCollisionY(platforms) + 10) { 
        velocityY *= -1;
      } else {
        velocityY = 0.0;
        y = detectCollisionY(platforms) - marioSize;
        onGround = true;
        onPlatform = true;
        jumps = false;
      }    
    }
  }

// MAIN DRAW FUNC
  function draw() {
    if (dead) {
      return;
    }
	tick++;
    if(hit && tick % 50 == 0){
      hit = false;
    }
    ctx.clearRect(-1000, 0, groundLength + 2000, canvas.height);
    ctx.save();
    ctx.translate(-xCam, 0);
    drawBackground();
    drawCastle(3850);
    drawCoin(coins);
    drawScore(xCam + 5);
    drawMuncher(munchers);
    animateCoin();
    if (facingLeft) {
      drawFlippedMario();
    } else {
      drawMario();
    }
    
    for (let i = 0; i < goombasObj.length; i++) {
      goombasObj[i].drawGoombaObj();
      goombasObj[i].moveGoombaObj();
    }
    
    if (detectCollisionX(coins)) {
      for (let i = 0; i < coins.length;) {
        if (coins[i][0] == detectCollisionX(coins)) {
          gold++;
          coins.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    if(detectCollisionX(munchers)){
      damage();
    }
	
	for (let i = 0; i < water.length; i++) {
      let xObs = water[i][0],
          xWidth = water[i][2];
    // for now, need to add platforms and change the condition:
      if (x > xObs && x < xWidth && !jumps) {
        y = canvas.height - ground - marioSize + 10;
        damage();
      }
  }
    
    if (y < canvas.height - marioSize - ground && !detectCollisionY(pipes)) {
      jumps = true;
    //  onGround = false;
    //  onPlatform = false;
    }
  
    if (jumps) {
      jumpMario();
    }
    
    if (movingRight) {
      x += dx;
      xCam += dx;      
      if (detectCollisionX(pipes) || detectCollisionX(platforms) || x > groundLength - marioSize + 20) {
        x -= dx;
        xCam -= dx;
      }
      if (src_x == 107) {
        src_x = 2;
      } else if(tick % 3 == 0){
        src_x += 35;
      }      
    }
    
    if (movingLeft) {
      x -= dx;    
      xCam -= dx;
      if (detectCollisionX(pipes) || detectCollisionX(platforms) || x < -15) {
        x += dx;
        xCam += dx;
      }
      if (src_x == 107) {
        src_x = 2;
      } else if(tick % 3 == 0){
        src_x += 35;
      }
    }
    
    if (idle) {
      src_x = 2;
    }
    
    ctx.restore();
    requestAnimationFrame(draw);
  }

  draw();
}