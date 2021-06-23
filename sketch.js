var PLAY = 1;
var END = 0;
var gameState = PLAY;

var panda, panda_running, panda_collided;
var  invisibleGround;

var groundImage;
var obstaclesGroup,obstacle1;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  panda_running =   loadAnimation("Panda.png");
  panda_collided = loadAnimation("panda crying.png");
  
  groundImage = loadImage("background.png");
  
 // cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("stone.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("reset.png");
}

function setup() {
  createCanvas(600, 200);
  
  panda = createSprite(50,180,20,50);
  
  panda.addAnimation("running", panda_running);
  panda.addAnimation("collided", panda_collided);
  panda.scale = 0.1;
  
  ground = createSprite(200,80,200,600);
  ground.addImage("background",groundImage);
  ground.x = ground.width /2;
  ground.scale = 2.7;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,160);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("red");
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/80);
    ground.velocityX = -(6 + 3*score/100);
   
    if(keyDown("space") && panda.y >= 80) {
      panda.velocityY = -10;
    }
  
    panda.velocityY = panda.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    panda.collide(invisibleGround);
    //spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(panda)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    panda.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    //cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    panda.changeAnimation("collided",panda_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    //cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  
}

function spawnObstacles() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var ob = createSprite(600,120,40,10);
    ob.y = Math.round(random(160,180));
    ob.addImage(obstacle1);
    ob.scale = 0.1;
    ob.velocityX = -3;
    
     //assign lifetime to the variable
    ob.lifetime = 200;
    
    //adjust the depth
    ob.depth = panda.depth;
    panda.depth = panda.depth + 1;
    
    //add each cloud to the group
    obstaclesGroup.add(ob);
  }
  
}


function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  //cloudsGroup.destroyEach();
  
  panda.changeAnimation("running",panda_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}