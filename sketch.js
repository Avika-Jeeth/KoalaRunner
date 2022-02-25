
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var koala, koala_running, koala_dead;
var ground, invisibleGround;

var obstaclesGroup, obstacleImg;

var score;
var gameOverImg, restartImg;
var jumpSound, munchSound, gameOverSound;
var leaf, leavesGroup
var feed = 1

function preload() {
  koala_running = loadAnimation("koala1.png", "koala2.png", "koala3.png");
  koala_dead = loadImage("koala4.png");
  leaf = loadImage("download-removebg-preview.png")

  obstacleImg = loadImage("rockImg.png");

  restartImg = loadImage("resetImg.png");
  gameOverImg = loadImage("you lose.jpg");

  jumpSound = loadSound('jumpSound.wav');
  gameOverSound = loadSound('game over sound.wav');
  munchSound = loadSound('Eating-SoundBible.wav');
}

function setup() {
  createCanvas(600, 400);

  ground = createSprite(200, 390, 900, 20);
  ground.shapeColor = "lawnGreen"
  ground.x = ground.width / 2;

  koala = createSprite(50, 360, 20, 50);
  koala.addAnimation("running", koala_running);
  koala.addAnimation("collided", koala_dead);

  

  gameOver = createSprite(300, 110);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 340);
  restart.addImage(restartImg);


  gameOver.scale = 0.3;
  restart.scale = 0.3;

  invisibleGround = createSprite(200, 180, 400, 10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  leavesGroup = new Group();

  koala.setCollider("circle", 0, 0, koala.width / 2);
  koala.debug = false

  score = 0;

}

function draw() {

  console.log(koala.y);

  background("lightCyan");

  text("Score: " + score, 500, 50);
  text("lives:" + feed, 500, 75)

  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100)
    
    score = score + Math.round(getFrameRate() / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

  
    if (keyDown("space")&& koala.y == 352.5) {
      koala.velocityY = -20;
      jumpSound.play();
    }
  
    koala.velocityY =koala.velocityY + 0.8

    spawnObstacles();
    spawnLeaves();

    if (obstaclesGroup.isTouching(koala)) {
      feed = feed - 1
      obstaclesGroup.destroyEach();
      if(feed == 0){
        koala.velocityY = -12;
      gameState = END;
      gameOverSound.play()


      }
    }

    if(leavesGroup.isTouching(koala)){
      munchSound.play();
      leavesGroup.destroyEach();
      feed = feed + 1
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    koala.changeAnimation("collided", koala_dead);
    

    ground.velocityX = 0;
    koala.velocityY = 0

    obstaclesGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    leavesGroup.setVelocityXEach(0);
  }

  koala.collide(ground);

  if (mousePressedOver(restart)) {
    reset();
  }


  drawSprites();
}

function reset() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();

  koala.changeAnimation("running")
  feed = 1
  score = 0
}


function spawnObstacles() {
  if (frameCount % 150 === 0) {
    var obstacle = createSprite(600, 365, 10, 40);
    obstacle.velocityX = -(6 + score / 100);
    obstacle.addImage("rock", obstacleImg);
    obstacle.scale = 0.4;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function spawnLeaves() {
  if (frameCount % 100 === 0) {
    var leaves = createSprite(600, Math.round(random(10, 200)), 10, 40);
    leaves.velocityX = -(6 + score / 100);
    leaves.addImage("leaf", leaf);
    leaves.scale = 0.4;
    leaves.lifetime = 300;
    leavesGroup.add(leaves)
  }
}
