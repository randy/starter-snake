// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "randy",       // TODO: Your Battlesnake Username
    color: "#424242", // TODO: Choose color
    head: "default",  // TODO: Choose head
    tail: "default",  // TODO: Choose tail
    name: "something clever"
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
  console.dir(gameState);
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
  console.dir(gameState);
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  let isMoveSafe = getNewSafeMoves(true);

  
  dontEatYourNeck();
  dontEatYourself();
  preventLeaveBoard();
  
  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter(key => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }

  feedTheHunger();
  
  const nextMove = chooseMove();  
  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove };
  

  function chooseMove() {
    let localSafeMoves = getNewSafeMoves(true);
    let nextMove = 'left';
    
    
    // if () {
      
    // } else {
      // Choose a random move from the safe moves
      nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    // }

    return nextMove;
  }

  /**
   * TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
   */
  function feedTheHunger() {
    const food = gameState.board.food;
  }

  function dontEatYourNeck() {
    const localSafeMoves = getNewSafeMoves(true);

    if (snakeNeck().x < snakeHead().x) {        // Neck is left of head, don't move left
      localSafeMoves.left = false;
  
    } else if (snakeNeck().x > snakeHead().x) { // Neck is right of head, don't move right
      localSafeMoves.right = false;
  
    } else if (snakeNeck().y < snakeHead().y) { // Neck is below head, don't move down
      localSafeMoves.down = false;
  
    } else if (snakeNeck().y > snakeHead().y) { // Neck is above head, don't move up
      localSafeMoves.up = false;
    }

    marrySafeMoves(localSafeMoves);
  }

  /**
   * Step 2 - Prevent your Battlesnake from colliding with itself
   */
  function dontEatYourself() {
    console.log('dontEatYourSelf...');
    console.dir(snakeHead(), snakeBody());
    const head = snakeHead();
    const localSafeMoves = getNewSafeMoves(false);

    // if some part of the snake doesn't exist on the same y, at the x+1 position, we can move there
    if (!snakeBody().some(nib => nib.x === head.x + 1 && nib.y == head.y)) {
      console.log('local right is true');
      localSafeMoves.right = true;
    }
    if (!snakeBody().some(nib => nib.x === head.x - 1 && nib.y == head.y)) {
      localSafeMoves.left = true;
    }
    if (!snakeBody().some(nib => nib.x === head.x && nib.y == head.y - 1)) {
      console.log('local down is true');
      localSafeMoves.down = true;
    }
    if (!snakeBody().some(nib => nib.x === head.x && nib.y == head.y + 1)) {
      console.log('local up is true');
      localSafeMoves.up = true;
    }
    
    console.log('local safe moves before merge ---');
    console.dir(localSafeMoves);
    console.log('global safe moves before merge ---');
    console.dir(isMoveSafe);
    marrySafeMoves(localSafeMoves);
    console.log('global safe moves after merge ---');
    console.dir(isMoveSafe);
  }

  /**
   * Step 1 - Prevent the Battlesnake from leaving the board.
   */
  function preventLeaveBoard() {
    if (snakeHead().x + 1 === getBoardMaxWidth()) {
      console.log('right not safe')
      isMoveSafe.right = false;
    } 
    if (snakeHead().x - 1 < 0) {
      console.log('left not safe')
      isMoveSafe.left = false;
    } 
    if (snakeHead().y + 1 === getBoardMaxHeight()) {
      console.log('up not safe')
      isMoveSafe.up = false;
    } 
    if (snakeHead().y - 1 < 0) {
      console.log('down not safe')
      isMoveSafe.down = false;
    }
  }

  

  function snakeHead() {
    return gameState.you.body[0];
  }

  function snakeNeck() {
    return gameState.you.body[1];
  }

  function snakeBody() {
    return gameState.you.body.slice(1);
  }

  function snakeBodyX() {
    return gameState.you.body.map(o => o.x);
  }
  
  function snakeBodyY() {
    return gameState.you.body.map(o => o.y);
  }

  function getBoardMaxHeight() {
    return gameState.board.height - 1;
  }
  
  function getBoardMaxWidth() {
    return gameState.board.width - 1;
  }

  /**
   * Use isMoveSafe as a base and && the results of the pass object.
   * @param {*} tempSafe - must the up/down/left/right true/false object
   */
  function marrySafeMoves(tempSafe) {
    isMoveSafe.up = isMoveSafe.up && tempSafe.up;
    isMoveSafe.down = isMoveSafe.down && tempSafe.down;
    isMoveSafe.left = isMoveSafe.left && tempSafe.left;
    isMoveSafe.right = isMoveSafe.right && tempSafe.right;
  }

  function getNewSafeMoves(bool) {
    return {
      up: bool,
      down: bool,
      left: bool,
      right: bool
    };
  }

}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});


