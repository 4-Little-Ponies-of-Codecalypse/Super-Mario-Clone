document.onReady(runGame());

function runGame(){

  const canvas = document.getElementById('mario'),
        ctx = canvas.getContext('2d');
  var xCam = 0;
    
  var tick = 0;

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
  var groundLength = 3000;

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
    ctx.fillRect(0, canvas.height - ground, groundLength, ground);
    ctx.fillStyle = sea;
    ctx.fillRect(groundLength, canvas.height - ground + 10, 1000, ground);
  } //end of draw ground

  function drawGrass() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - ground);
    for (var i = 0; i < groundLength; i += grassWidth){
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

  //CASTLE
  //for platform width 200, platform height 40
  function drawCastle(x) {
    var heightBase = 5,
        heightTower = 3;
    for (var i = 0; i < heightBase; i++) {
      drawWall(x, canvas.height - ground - 40 - 40 * i);
      drawWall(x + 200, canvas.height - ground - 40 - 40 * i);
    }
    for (var j = 0; j < heightTower; j++) {
      drawWall(x + 100, canvas.height - ground - 40 - 40 * heightBase - 40 * j);
    }
    ctx.fillStyle = '#ff4000';
    ctx.strokeStyle='black';
    for (var k =0; k < 10; k++) {
      ctx.fillRect(x + k * 41, canvas.height - ground - 40 * heightBase - 30, 30, 30);
      ctx.strokeRect(x + k * 41, canvas.height - ground - 40 * heightBase - 30, 30, 30);
    }
    for (var l =0; l < 5; l++) {
      ctx.fillRect(x + 100 + l * 42, canvas.height - ground - 40 * heightBase - 40 * heightTower - 30, 30, 30);
      ctx.strokeRect(x + 100 + l * 42, canvas.height - ground - 40 * heightBase - 40 * heightTower - 30, 30, 30);
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

  function detectGoombaX(obs, widthObs, heightObs) {
    let xObs,
        yObs,
        xGoomba,
        yGoomba;
    
    for (let i = 0; i < obs.length; i++) {
      for (let j = 0; j < goombas.length; j++) {
        xObs = obs[i][0];
        yObs = obs[i][1];
        xGoomba = goombas[j][0];
        yGoomba = goombas[j][1];
        if (xGoomba > xObs - goombaSize - 5 && xGoomba < xObs + widthObs && yGoomba + goombaSize > yObs && yGoomba < yObs + heightObs) {
          return xObs;
        }
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
      y = canvas.height - ground - marioSize, // 300
      //xGoomba = 520,
      //yGoomba = canvas.height - ground - goombaSize,
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
      idle = true;
  var goombas = [[100, 220-goombaSize],[10, 315], [700, 315], [1000, 315], [1040, 65]],
      goombasObj = [],
      munchers = [[2240, 317, muncherSize, muncherSize], [2440, 317, muncherSize, muncherSize], [2520, 317, muncherSize, muncherSize]],
      coins = [[120, 185, coinSize, coinSize], [180, 185, coinSize, coinSize], [240, 185, coinSize, coinSize], [670, 200, coinSize, coinSize], [720, 175, coinSize, coinSize], [765, 150, coinSize, coinSize], [1345, 185, coinSize, coinSize], [1375, 185, coinSize, coinSize], [1405, 185, coinSize, coinSize], [1435, 185, coinSize, coinSize], [1465, 185, coinSize, coinSize], [1940, 185, coinSize, coinSize], [1890, 185, coinSize, coinSize], [2505, 65, coinSize, coinSize]];

  document.addEventListener('keydown', keyHandler, false);
  document.addEventListener('keyup', upHandler, false);

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

  function drawFlippedMario() {
    ctx.scale(-1, 1);
    ctx.drawImage(img, src_x, src_y, src_w, src_h, -(x + marioSize), y, marioSize, marioSize);
    ctx.scale(-1, 1);
  }

  function drawMario() {
    ctx.drawImage(img, src_x, src_y, src_w, src_h, x, y, marioSize, marioSize);
  }

  function drawGoomba(arr) {
    for (let i = 0; i < arr.length; i++) {
      var xGoomba = arr[i][0],
          yGoomba = arr[i][1];
      ctx.drawImage(goomba, goo_x, goo_y, goo_w, goo_h, xGoomba, yGoomba, goombaSize, goombaSize);
    }
  }

  function drawCoin(arr) {
    for (let i = 0; i < arr.length; i++) {
      var xCoin = arr[i][0],
          yCoin = arr[i][1];
      ctx.drawImage(coin, coin_x, coin_y, coin_w, coin_h, xCoin, yCoin, coinSize, coinSize);
    }
  }

  function animateCoin() {
    if (coin_x == 47) {
      coin_x = 2;
    } else {
      coin_x += 15;
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

  // very funny bug. if Mario is above ground, goomba stops and resumes only when Mario gets down to ground. and resumes towards Mario to attack!
  // this bug will be evident if another bug is fixed: individual collision for each goomba
  function moveGoomba() {
    for (let i = 0; i < goombas.length; i++) {
      var old = goombas[i][0];
      goombas[i][0] -= velocityX;    
      if (detectGoombaX(pipes, 60, 1000)) {// || detectGoombaX([[x, y]], marioSize - 15, marioSize)) {
        goombas[i][0] = old;
        velocityX *= -1;
      }
    }
    if (goo_x == 144) {
      goo_x = 0;
    } else {
      goo_x += 16;
    }
  }

  var GoombaObj = function(coord) {
    this.x = coord[0];
    this.y = coord[1];
    this.velocityX = 2;
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
        if (this.x > xObs - 5 && this.x < xObs + widthObs - goombaSize + 5 && this.y + goombaSize >= yObs && this.y <= yObs + heightObs) {        
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
        lives--;
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
      } else {
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
    if (y > canvas.height - marioSize - ground) { //check if Mario hits the ground
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

  function draw() {
    tick++;
    //setTimeout(function() {
    ctx.clearRect(-1000, 0, groundLength + 2000, canvas.height);
    ctx.save();
    ctx.translate(-xCam, 0);
    drawBackground();
    //drawGoomba(goombas);
    drawCoin(coins);
    drawScore(xCam + 5);
    drawMuncher(munchers);
    //moveGoomba();
    //animateCoin();
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
    
    if (y < canvas.height - marioSize - ground && !detectCollisionY(pipes)) {
      jumps = true;
    //  onGround = false;
    //  onPlatform = false;
    }
  
    if (jumps) {
      jumpMario();
    }
    
    // !!! think
  /*  if (onPlatform) {
      if (!staysOnPlatform(pipes, 60, 1000)) {
        y += 8;
        
        if (y > canvas.height - marioSize - ground) { 
          y = canvas.height - marioSize - ground;
          velocityY = 0.0;
          onGround = true;
          onPlatform = false;
          jumps = false;
          
          if (facingLeft) {
            if (detectCollisionX(pipes, 60, 1000)) {
              x += dx;
              xCam += dx;
            }
            x -= dx * 5;
            xCam -= dx * 5;
          } else {
            if (detectCollisionX(pipes, 60, 1000)) {
              x -= dx;
              xCam -= dx;
            }
            x += dx * 5;
            xCam += dx * 5;
          }
          
        }
      }
    }*/
    
    if (movingRight) {
      x += dx;
      xCam += dx;
      if (detectCollisionX(pipes) || detectCollisionX(platforms)) {
        x -= dx;
        xCam -= dx;
      }
      if (src_x == 107) {
        src_x = 2;
      } else {
        src_x += 35;
      }
    }
    
    if (movingLeft) {
      x -= dx;    
      xCam -= dx;
      if (detectCollisionX(pipes) || detectCollisionX(platforms)) {
        x += dx;
        xCam += dx;
      }
      if (src_x == 2) {
        src_x = 107;
      } else {
        src_x -= 35;
      } 
    }
    
    if (idle) {
      src_x = 2;
    }
    
    ctx.restore();
    requestAnimationFrame(draw);
    //}, 1000 / fps);
  }

  draw();
}