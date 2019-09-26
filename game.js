// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var textVidas;
var winningMessage;
var loseMessage;
var won = false;
var lose = false;
var currentScore = 0;
var winningScore = 30;
var veneno;
var stars;
var vidas=3;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  veneno = game.add.physicsGroup();
  stars = game.add.physicsGroup();
  createItem(375, 300, 'coin');
  createItem(530, 100, 'coin2');
  createItem(180,450, 'coin3');
  createItem(700,200, 'coin3');
 
 
  createPoison(630,450,'poison');
  createPoison(180,150,'poison');
  createPoison(400,550,'poison');
    
  createStar(750,550, 'star');
}


 


// add platforms to the game
function addPlatforms() {
    
  platforms = game.add.physicsGroup();
  platforms.create(450, 150, 'platform');
  platforms.create(100, 500, 'platform2');
  platforms.create(550, 500, 'platform3');
  platforms.create(300, 350, 'platform4');
  platforms.create(100,200, 'platform5');
  platforms.setAll('body.immovable', true);
} 


function createPoison(left,top, image){
    
   var v1 = veneno.create(left,top, image);
   v1.animations.add('spin');
   v1.animations.play('spin',5,true);
}

function createStar(left,top, image){
    
   var star = stars.create(left,top, image);
   star.animations.add('spin');
   star.animations.play('spin',5,true);

}
// create a single animated item and add to screen
function createItem(left, top, image) {
    
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  
  currentScore = currentScore + 10;
  if (currentScore === winningScore) {
      createBadge();
  }
    
   
}


function poisonHandler(player, veneno) {
  veneno.kill();
  vidas=vidas -1;
  currentScore = currentScore - 10;
    
  if (vidas == 0) {
      
      player.kill();
      lose=true;
  }
  
  
}
    
function starHandler(player, stars) {
  stars.kill();
  currentScore = currentScore + 20;
    
  if (currentScore === winningScore) {
      createBadge();
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  player.kill();
  
  won = true;
 
  
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#5db1ad';
    
    //Load images
    game.load.image('platform', 'platform_1.png');
    game.load.image('platform2', 'platform_2.png');
    game.load.image('platform3', 'platform_2.png');
    game.load.image('platform4', 'platform_2.png');
    game.load.image('platform5', 'platform_2.png');
   
    
    //Load spritesheets
    game.load.spritesheet('player', 'chalkers.png', 48, 62);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('coin2', 'coin.png', 36, 44);
    game.load.spritesheet('coin3', 'coin.png', 36, 44);
    game.load.spritesheet('coin4', 'coin.png', 36, 44);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();
    
   

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    textVidas = game.add.text(680, 16, "Vidas: " + vidas, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
      
    loseMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    loseMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    textVidas.text = "VIDAS: " + vidas;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    game.physics.arcade.overlap(player, veneno, poisonHandler);
    game.physics.arcade.overlap(player, stars, starHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
      
    if (lose) {
        
        loseMessage.text = "YOU LOSE!!!";
    }
  }

  function render() {

  }

};
