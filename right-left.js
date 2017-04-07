const canvas = document.getElementById('mario'),
      ctx = canvas.getContext('2d'),
      img = document.getElementById('img');

var marioSize = 70,
    x = 70,
    y = canvas.height / 2 - marioSize,
    dx = 4,
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
      x -= dx;
      movingLeft = true;
      facingLeft = true;
      idle = false;
      break;
    case 39:
    case 68:
      x += dx;
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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

// 'https://tcrf.net/images/0/06/SMBCMario3UnusedFlying.png'
// "http://piq.codeus.net/static/media/userpics/piq_36982_400x400.png"