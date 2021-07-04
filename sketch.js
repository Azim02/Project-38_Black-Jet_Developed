//declaring variables
var path, pathImg;
var player, playerImg, playerImg2;

var bgImage;

var lavaBall, lavaBall_Img, lavaBall_Img2;
var energy, energyImg;

var bullet, bulletImg;
var cash, cashImg1, cashImg2;

var coin, coinImg;
var obstacle, obstacleImg1, obstacleImg2;

var lavaBallGroup, energyGroup, bulletGroup, cashGroup;
var coinGroup, obstacleGroup;

var energyLeft = 6;
var lavaBallsDestroyed = 0;
var cashCollected = 0;
var extraCoins = 0;

var sound1, sound2, sound3, sound4, sound5;

var retry, retryIcon;

//declaring gameStates-
var PLAY = 0;
var END = 1;
var gameState = 0;

//function to load Images, Animations, Sounds, etc...
function preload(){
  //loading images
  pathImg  = loadImage("bg.png");
  playerImg2 = loadImage("plane.png");
  playerImg = loadImage("plane1.png");
  lavaBall_Img = loadImage("lava.png");
  lavaBall_Img2 = loadImage("lava2.png");
  energyImg = loadImage("energy.png");
  bulletImg = loadImage("bullet.png");
  cashImg1 = loadImage("cash1.png");
  cashImg2 = loadImage("cash2.png");
  coinImg = loadImage("coin.jpg");
  obstacleImg2 = loadImage("obstacle2.png");
  retryIcon = loadImage("retry.png");

  //loading animation -
  obstacleImg1 = loadAnimation("obstacle1.png", "obstacle1-1.png");

  //loading sound
  sound1 = loadSound("shoot.mp3");
  sound2 = loadSound("gameSound.mp3");
  sound3 = loadSound("lose.mp3");
  sound4 = loadSound("gameSound2.mp3");
  sound5 = loadSound("bgMusic.mp3");
}

//setup function -
function setup(){
  //creating the canvas
  createCanvas(500, 500);
  
    //playing background music
    sound5.play();

  //creating the path
  path = createSprite(250, 50);
  //adding path image
  path.addImage(pathImg);
  //scaling path
  path.scale = 1.3;
  //giving y velocity to it
  path.velocityY = 4;

  //creating the player
  player = createSprite(200, 475, 50, 50);
  //adding player image
  player.addImage(playerImg2);
  //scaling player
  player.scale = 1.5;

  //creating the bullet
  bullet = createSprite();
  //adding bullet image
  bullet.addImage(bulletImg);
  //scaling it
  bullet.scale = 0.31;
  //making it invisible
  bullet.visible = false;

  //creating the retry button
  retry = createSprite(400, 250, 50, 50);
  //adding image to retry button
  retry.addImage(retryIcon);
  //scaling it
  retry.scale = 0.4;
  //making it invisible
  retry.visible = false;

  //creating the groups -
  lavaBallGroup = new Group();
  energyGroup = new Group();
  bulletGroup = new Group();
  speedUpGroup = new Group();
  cashGroup = new Group();
  coinGroup = new Group();
  obstacleGroup = new Group();
}

//draw function -
function draw(){
  //background color
  background("yellowgreen");

  //gameState -
   if(gameState === PLAY){

     //making infinite path
    if(path.y > 300){
      path.y = height/2;
     }
   
     //giving movement to the player
     player.x = World.mouseX;
     bullet.x = player.x;
     
     //calling the functions -
  appearLavaBalls();
  appearEnergy();
  appearBullets();
  appearCash();
  appearCoin();
  appearObstacles();

  //game adaptivity - 
  if(World.frameCount % 1000 === 0){
    path.velocityY = path.velocityY + 2;
  }
  if(World.frameCount % 2000 === 0){
    path.velocityY = path.velocityY + 2;
  }
  if(World.frameCount % 2500 === 0){
    path.velocityY = path.velocityY + 2;
  }

  //changing image 
  if(cashCollected >= 200 && keyWentDown("C")){
    player.addImage(random([playerImg, playerImg2]));

    cashCollected = cashCollected - 200;
  }

  //Touching functions -
  if (energyGroup.isTouching(player)) {
    //destroying energy 
    energyGroup.destroyEach();

    ///incrementing fuels left
    energyLeft += 1;

    //playing sound
    sound2.play();
  }
  else if (coinGroup.isTouching(player)) {
    //destroying coin 
    coinGroup.destroyEach();

    ///incrementing coins left
    extraCoins += 5;
    
    if(extraCoins == 20){
      ///incrementing fuels left
      energyLeft += 1;
    }

    //playing sound
    sound2.play();
  }
  else if(bulletGroup.isTouching(lavaBallGroup)){
    //destroying lava balls
    lavaBallGroup.destroyEach();
    //bullet y position
    bullet.y = -5;
    ///incrementing lava balls destroyed
    lavaBallsDestroyed += 1;
  }
  else if(keyWentDown("enter")){
    //decreasing fuels left
    energyLeft -= 1;
  }
  else if(cashGroup.isTouching(player)) {
    //incrementing cash collected+
    cashCollected += random([50, 100]);
    //destroying cash
    cashGroup.destroyEach();
    //playing sound
    sound4.play();
  }
  else if(obstacleGroup.isTouching(player)) {
    //changing gameState -
    gameState = END;

    //destroying and setting veocity as 0 -
    energyGroup.destroyEach();
    energyGroup.setVelocityYEach(0);
    lavaBallGroup.destroyEach();
    lavaBallGroup.setVelocityYEach(0);
    cashGroup.destroyEach();
    cashGroup.setVelocityYEach(0);
    coinGroup.destroyEach();
    coinGroup.setVelocityYEach(0);
    obstacleGroup.destroyEach();
    obstacleGroup.setVelocityYEach(0);

    path.velocityY = 0;
    //making path invisible
    path.visible = false;
  }
  else if(lavaBallGroup.isTouching(player)) {
  //changing gameState -
    gameState = END;

    //destroying and setting veocity as 0 -
    energyGroup.destroyEach();
    energyGroup.setVelocityYEach(0);
    lavaBallGroup.destroyEach();
    lavaBallGroup.setVelocityYEach(0);
    cashGroup.destroyEach();
    cashGroup.setVelocityYEach(0);
    coinGroup.destroyEach();
    coinGroup.setVelocityYEach(0);
    obstacleGroup.destroyEach();
    obstacleGroup.setVelocityYEach(0);

    path.velocityY = 0;
    //making path invisible
    path.visible = false;
  } 
   }
   //gameState -
   else if(gameState === END){
     //showing texts
     textFont("papyrus");
     textSize(20);
     fill("brown");
    text("You lost !! Don't worry, Try better next time.", 120, 200);
    text("To fly again with your jet click here - ", 30, 250);

   //playing sound
   sound3.play();

   //making visible
   retry.visible = true;

   //mousePressed command
   if(mousePressedOver(retry)){
     //calling reset function 
     reset();
   }
  }
   
   //creating edges and colliding the player with it.
   edges = createEdgeSprites();
   player.collide(edges);

   //drawing everything
  drawSprites();

  //text styles-
  textSize(15);
  fill("white");
  textFont("seoge script");
  text("Energy Left is "+ energyLeft, 5, 20);
  text("Lava Balls Destroyed :- "+ lavaBallsDestroyed, 5, 40);
  text("Cash Collected = "+ cashCollected, 5, 60);
  text("Extra Coins Earned = "+ extraCoins, 5, 80);
  fill("lightgreen");
  textSize(13);
  text("||  Press 'enter' key to shoot the bullets ||", 250, 20);
  text("||  Press 'C' after collecting 200 or more cash to buy a new plane  ||", 75, 490);
}
//function to spawn lava balls -
function appearLavaBalls(){
  if(World.frameCount % 150 === 0){
  lavaBall = createSprite(Math.round(random(50, 420),40, 10, 10));
  
    //generatinh random lava balls
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: lavaBall.addImage(lavaBall_Img2);
              break;
      case 2: lavaBall.addImage(lavaBall_Img);
              break;        
      default: break;
    }

  lavaBall.velocityY = 4;
  lavaBall.lifetime = 150;

  lavaBall.scale = 0.4;

  lavaBallGroup.add(lavaBall);
  }
}

//function to spawn energy -
function appearEnergy(){
  if(World.frameCount % 200 === 0){
  energy = createSprite(Math.round(random(20, 450),40, 10, 10));
  energy.velocityY = 4;
  energy.lifetime = 150;
  energy.addImage(energyImg);
  energy.scale = 0.31;
  
  energyGroup.add(energy);
  }
}

//function to spawn bullets -
function appearBullets(){
  if(keyDown("enter")){
  bullet.velocityY = -4;
  bullet.visible = true;
  //playing sound
  sound1.play();
 }

 if(bullet.y < 0){
   bullet.y = player.y + 25;
   bullet.x = player.x + 50;
   bullet.velocityY = 0;
   bullet.visible = false;
 }

 bulletGroup.add(bullet);
}

//function to spawn cash -
function appearCash(){
  if(World.frameCount % 310 === 0){
    cash = createSprite(Math.round(random(30, 450),40, 10, 10));

    //generating random cash
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: cash.addImage(cashImg1);
              break;
      case 2: cash.addImage(cashImg2);
              break;        
      default: break;
    }

//giving velocity
    cash.velocityY = 4;
    //giving lifetime
    cash.lifetime = 150;
    //scaling it    
    cash.scale = 0.42;

    //adding it in group
    cashGroup.add(cash);
    }
}

//function to spawn coin -
function appearCoin(){
  if(World.frameCount % 400 === 0){
  coin = createSprite(Math.round(random(20, 375),40, 10, 10));
  coin.velocityY = 4;
  coin.lifetime = 150;
  coin.addImage(coinImg);
  coin.scale = 0.31;
  
  
    //adding it in group
  coinGroup.add(coin);
  }
}

//function to spawn obstacles -
function appearObstacles(){
  if(World.frameCount % 175 === 0){
    obstacle = createSprite(Math.round(random(100, 400),40, 10, 10));

    //generating random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addAnimation("obstacle", obstacleImg1);
              break;
      case 2: obstacle.addImage(obstacleImg2);
              break;        
      default: break;
    }

    //giving velocity
    obstacle.velocityY = 5;
    //giving lifetime
    obstacle.lifetime = 150;
    //scaling it
    obstacle.scale = 0.42;

    //adding it in group
    obstacleGroup.add(obstacle);
    }
}


//function to reset the game -
function reset(){
  //changing gameState
  gameState = PLAY;

  //making visible and invisible -
  retry.visible = false;
  path.visible = true;

  //giving velocity
  path.velocityY = 4;
  
  //destroying each
  lavaBallGroup.destroyEach();
  energyGroup.destroyEach();
  cashGroup.destroyEach();
  coinGroup.destroyEach();
  
  //recounting values
  energyLeft = 6;
  lavaBallsDestroyed = 0;
  cashCollected = 0;
  extraCoins = 0;

  //changing image
  player.addImage(playerImg2);
}