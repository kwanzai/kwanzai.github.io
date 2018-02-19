//Setup Pixi and load the texture atlas files - call the `setup`
//function when they've loaded
let state, explorer, treasure, chimes, player, dungeon, door, healthBar, message, gameScene, gameOverScene, enemies, id, gameTimer;
let gameTimerText, spawnPoints, graphics, respawnTime, spawnTimer;
let blobs;
let blobTexture;    

function setup() {
  //Create the `gameScene` group
  gameScene = new Container();
  gameScene.interactive = true;
  app.stage.addChild(gameScene);

  var graphics = new PIXI.Graphics();

  //Create the sprites  //Create an alias for the texture atlas frame ids
  id = resources["/StillStanding/images/treasureHunter.json"].textures;

  //Dungeon
  dungeon = new Sprite(id["dungeon.png"]);
  // dungeon.alpha = 0;
  gameScene.addChild(dungeon);

  //Door
  door = new Sprite(id["door.png"]);
  door.position.set(32, 0);
  gameScene.addChild(door);

  //Explorer
  explorer = new Player(gameScene, 0, 0);
  explorer.setPosition(gameScene.width / 2 - explorer._body.width / 2, gameScene.height - explorer._body.height - (gameScene.height / 10));
  //explorer._body.x = gameScene.width / 2 - explorer.width / 2;
  ////explorer._body.y = gameScene.height / 2 - explorer.height / 2;
  //explorer._body.y = gameScene.height - explorer.height - (gameScene.height / 10);
  explorer.vx = 0;
  explorer.vy = 0;
  //gameScene.addChild(explorer);
  
  gameScene.on("mousedown", function(e){  
    explorer.shoot(explorer._body.rotation, {
      x: explorer._body.position.x+Math.cos(explorer._body.rotation)*20,
      y: explorer._body.position.y+Math.sin(explorer._body.rotation)*20
    });
  })
  
  //Treasure
  treasure = new Sprite(id["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  //List of locations where an enemy can spawn ("around the world" positions for now)
  spawnPoints = [];

  for (let i = 0; i < 5; i++) {
    let currentPoint = new Point(0, 0);

    if (i === 0) {
      currentPoint.x = explorer._body.x - (gameScene.width / 2) + (gameScene.width / 10);
      currentPoint.y = explorer._body.y;
    } else if (i == 1){
      currentPoint.x = explorer._body.x + (gameScene.width / 2) - (gameScene.width / 10);
      currentPoint.y = explorer._body.y;
    } else if (i == 2){
      currentPoint.x = explorer._body.x - (gameScene.width / 4);
      currentPoint.y = gameScene.height / 8;
    } else if (i == 3){
      currentPoint.x = explorer._body.x + (gameScene.width / 4);
      currentPoint.y = gameScene.height / 8;          
    } else if (i == 4){
      currentPoint.x = explorer._body.x;
      currentPoint.y = gameScene.height / 10;          
    }

    //debug
    graphics.lineStyle(1);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(currentPoint.x, currentPoint.y, 10);
    graphics.endFill();

    spawnPoints.push(currentPoint);
  }          

  //debug for spawn point
  //gameScene.addChild(graphics); 

  //An array to store all the blob monsters
  blobs = [];

  //Initialize game timer
  gameTimer = 0.0;
  gameTimerText = new Text(gameTimer.toString());
  gameTimerText.x = app.stage.width / 2 - gameTimerText.width / 2;
  gameTimerText.y = app.stage.height / 15 - gameTimerText.height / 2;
  gameScene.addChild(gameTimerText);

  respawnTime = 2 * 60;
  spawnTimer = respawnTime;

  //Create the health bar
  healthBar = new PIXI.DisplayObjectContainer();
  healthBar.position.set(app.stage.width - 170, 4)
  gameScene.addChild(healthBar);

  //Create the black background rectangle
  let innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  let outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;

  //Create a `gameOverScene` group
  gameOverScene = new Container();
  gameOverScene.visible = false;

  //Add some text for the game over message
  let style = new TextStyle({
      fontFamily: "Futura",
      fontSize: 64,
      fill: "white"
    });
  message = new Text("The End!", style);
  message.x = 120;
  message.y = app.stage.height / 2 - 32;
  gameOverScene.addChild(message);

  app.stage.addChild(gameOverScene);

  //Assign the player's keyboard controllers
  //       //Capture the keyboard arrow keys
  //       let left = keyboard(37),
  //           up = keyboard(38),
  //           right = keyboard(39),
  //           down = keyboard(40);
  //       //Left arrow key `press` method
  //       left.press = function() {
  //         //Change the explorer's velocity when the key is pressed
  //         explorer.vx = -5;
  //         explorer.vy = 0;
  //       };
  //       //Left arrow key `release` method
  //       left.release = function() {
  //         //If the left arrow has been released, and the right arrow isn't down,
  //         //and the explorer isn't moving vertically:
  //         //Stop the explorer
  //         if (!right.isDown && explorer.vy === 0) {
  //           explorer.vx = 0;
  //         }
  //       };
  //       //Up
  //       up.press = function() {
  //         explorer.vy = -5;
  //         explorer.vx = 0;
  //       };
  //       up.release = function() {
  //         if (!down.isDown && explorer.vx === 0) {
  //           explorer.vy = 0;
  //         }
  //       };
  //       //Right
  //       right.press = function() {
  //         explorer.vx = 5;
  //         explorer.vy = 0;
  //       };
  //       right.release = function() {
  //         if (!left.isDown && explorer.vy === 0) {
  //           explorer.vx = 0;
  //         }
  //       };
  //       //Down
  //       down.press = function() {
  //         explorer.vy = 5;
  //         explorer.vx = 0;
  //       };
  //       down.release = function() {
  //         if (!up.isDown && explorer.vx === 0) {
  //           explorer.vy = 0;
  //         }
  //       };

  //set the game state to `play`
  state = play;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function spawnEnemy() {
  //Make a blob
  //var enemy = new Sprite.fromImage('images/chobin.gif');



  //choose a spawn point at random
  let spawnPointID = randomInt(0, spawnPoints.length - 1);

  let enemy = new Enemy(gameScene, spawnPoints[spawnPointID].x, spawnPoints[spawnPointID].y);
  enemy.setTarget(explorer._body);
  
  
    blobs.push(enemy);
}

function gameLoop(delta) {
  //Runs the current game `state` in a loop and renders the sprites
  //Update the current game state:
  state(delta);
}

function play(delta) {
  //All the game logic goes here
  gameTimer += delta;

  var gameTimerSeconds = parseInt(gameTimer / 60);

  gameTimerText.text = gameTimerSeconds.toString();

  spawnTimer -= delta;
  if(spawnTimer <= 0 ) { 
    spawnEnemy();

    spawnTimer = respawnTime;
  }

  explorer._body.x += explorer.vx;
  explorer._body.y += explorer.vy;

  contain(explorer, {x: 28, y: 10, width: 488, height: 480});

  let explorerHit = false;

  blobs.forEach(
    function(blob) {

//     //Move the blob
//     blob.y += blob.vy;

//     //Check the blob's screen boundaries
//     let blobHitsWall = contain(blob, {x: 28, y: 10, width: 488, height: 480});

//     //If the blob hits the top or bottom of the stage, reverse
//     //its direction
//     if (blobHitsWall === "top" || blobHitsWall === "bottom") {
//       blob.vy *= -1;
//     }

//     //Test for a collision. If any of the enemies are touching
//     //the explorer, set `explorerHit` to `true`
    explorer._bullets.forEach(
      function(bullet) {
        if(hitTestRectangle(bullet, blob._body)) {
          blob.takeDamage(explorer._attackPower);
          gameScene.removeChild(bullet);
        }
     });
  
    if(hitTestRectangle(explorer._body, blob._body)) {
      explorerHit = true;
      //blob.die();
    }
  });
  
  
 
  if(explorerHit) {

    //Make the explorer semi-transparent
    explorer._body.alpha = 0.5;

    //Reduce the width of the health bar's inner rectangle by 1 pixel
    healthBar.outer.width -= 1;

  } else {

    //Make the explorer fully opaque (non-transparent) if it hasn't been hit
    explorer._body.alpha = 1;
  }

  if (healthBar.outer.width < 0) {
    state = end;
    message.text = "You lost!";
  }

  function contain(sprite, container) {

    let collision;

    //Left
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }

    //Return the `collision` value
    return collision;
  }

}



function end() {
  //All the code that should run at the end of the game
  gameScene.visible = false;
  gameOverScene.visible = true;
}  