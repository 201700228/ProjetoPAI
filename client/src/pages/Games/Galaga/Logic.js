export function Player(ctx, mouse, player) {
  this.draw = function () {
    ctx.beginPath();
    ctx.drawImage(
      player.playerImg,
      mouse.x - player.width / 2,
      mouse.y - player.height / 2
    );
  };

  this.update = function () {
    this.draw();
  };
}

export function Bullet(ctx, x, y, width, height, speed) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;

  this.draw = function () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  };

  this.update = function () {
    this.y -= this.speed;
    this.draw();
  };
}

export function Enemy(ctx, x, y, width, height, speed, enemies) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;

  this.draw = function () {
    ctx.beginPath();
    ctx.drawImage(enemies.enemyImg, this.x, this.y);
  };

  this.update = function () {
    this.y += this.speed;
    this.draw();
  };
}

export function Healthkit(ctx, x, y, width, height, speed, healthkits) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;

  this.draw = function () {
    ctx.beginPath();
    ctx.drawImage(healthkits.healthkitImg, this.x, this.y);
  };

  this.update = function () {
    this.y += this.speed;
    this.draw();
  };
}

export function createVars(canvas, heroImgSrc, enemyImgSrc) {
  const mouse = {
    x: canvas.width / 2,
    y: canvas.height - 33,
  };

  var playerImg = new Image();
  playerImg.src = heroImgSrc;

  const player = {
    width: 32,
    height: 32,
    playerImg: playerImg,
  };

  const bullets = {
    list: [],
    width: 6,
    height: 8,
    speed: 10,
  };

  var enemyImg = new Image();
  enemyImg.src = enemyImgSrc;

  const enemies = {
    list: [],
    enemyImg: enemyImg,
    width: 32,
    height: 32,
  };

  var healthkitImg = new Image();
  healthkitImg.src = "https://image.ibb.co/gFvSEU/first_aid_kit.png";

  const healthkits = {
    list: [],
    healthkitImg: healthkitImg,
    width: 32,
    height: 32,
  };

  var score = 0;
  var health = 100;

  return { mouse, player, bullets, enemies, healthkits, score, health };
}

export function drawEnemies(canvas, ctx, enemies) {
  if (enemies) {
    for (var _ = 0; _ < 4; _++) {
      var x = Math.random() * (canvas.width - enemies.width);
      var y = -enemies.height;
      var width = enemies.width;
      var height = enemies.height;
      var speed = Math.random() * 2;
      var enemy = new Enemy(ctx, x, y, width, height, speed, enemies);
      enemies.list.push(enemy);
    }
  }
}

export function drawHealthkits(canvas, ctx, enemies, healthkits) {
  if (enemies && healthkits) {
    for (var _ = 0; _ < 1; _++) {
      var x = Math.random() * (canvas.width - enemies.width);
      var y = -enemies.height;
      var width = healthkits.width;
      var height = healthkits.height;
      var speed = Math.random() * 2.6;
      var healthkit = new Healthkit(
        ctx,
        x,
        y,
        width,
        height,
        speed,
        healthkits
      );
      healthkits.list.push(healthkit);
    }
  }
}

export function fire(ctx, mouse, player, bullets) {
  if (bullets) {
    for (var _ = 0; _ < 1; _++) {
      var x = mouse.x - bullets.width / 2;
      var y = mouse.y - player.height;
      var bullet = new Bullet(
        ctx,
        x,
        y,
        bullets.width,
        bullets.height,
        bullets.speed
      );
      bullets.list.push(bullet);
    }
  }
}

export function collision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function updateBullets(bullets) {
  for (var i = 0; i < bullets.list.length; i++) {
    bullets.list[i].update();
    if (bullets.list[i].y < 0) {
      bullets.list.splice(i, 1);
    }
  }
}

export function updateEnemies(
  canvas,
  enemies,
  health
) {
  let healthUpdated = health;

  for (let k = enemies.list.length - 1; k >= 0; k--) {
    enemies.list[k].update();
    if (enemies.list[k].y > canvas.height) {
      enemies.list.splice(k, 1);
      healthUpdated -= 10;
    }
  }

  return healthUpdated;
}

export function updateScoreHitEnemy(enemies, bullets, score) {
  let scoreUpdated = score;
  for (var j = enemies.list.length - 1; j >= 0; j--) {
    for (var l = bullets.list.length - 1; l >= 0; l--) {
      if (collision(enemies.list[j], bullets.list[l])) {
        enemies.list.splice(j, 1);
        bullets.list.splice(l, 1);
        scoreUpdated++;
      }
    }
  }

  return scoreUpdated
}

export function updateHealthHitKit(healthkits, bullets, health){
  let healthUpdated = health;
  for (var hh = healthkits.list.length - 1; hh >= 0; hh--) {
    for (var hhh = bullets.list.length - 1; hhh >= 0; hhh--) {
      if (collision(healthkits.list[hh], bullets.list[hhh])) {
        healthkits.list.splice(hh, 1);
        bullets.list.splice(hhh, 1);
        healthUpdated += 10;
      }
    }
  }
  
  return healthUpdated;
}

export function updateHealthKits(healthkits) {
  for (var h = 0; h < healthkits.list.length; h++) {
    healthkits.list[h].update();
  }
}
