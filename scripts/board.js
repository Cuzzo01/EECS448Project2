/** @fileOverview This class creates the game board and functions interacting with it
 * @author Kevin Dinh, Eric Seals, Eric D. Fan Ye, Evan Trout
 */

/*
 * we have to encapsulate this into a class.. this is all imperative
 */

var w = 20;
var gameBoard, rows, cols, mineCount, endGameCheck;
let runAwayMode = false;
let globalEvent;
var cnv, width, height;

function toggleRunAwayMode() {
  runAwayMode = !runAwayMode;
  let interval;
  if(runAwayMode){
    let runAwayText = document.createElement('div');
    runAwayText.id = 'runAwayText';
    runAwayText.innerHTML = 'Run Away Mode Enabled!';
    document.body.appendChild(runAwayText);
    interval = setInterval(function(){
      for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(gameBoard[i][j].boom == -1){
              gameBoard[i][j].runAway(globalEvent);
            }
          }
      }
    }, 100);
  }
  else{
    document.body.removeChild(document.getElementById('runAwayText'));
    clearInterval(interval);
  }
  for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        if(gameBoard[i][j].boom == -1)
          if(runAwayMode){
            gameBoard[i][j].generateBufferBox();
          }
          else{
            gameBoard[i][j].deleteBufferBox();
          }
    }
  }
}

function updateInputFields() {
  var inputs = Array.from(document.getElementsByClassName("setupInput"));
  var [ rowCount, colCount, mineCount ] = inputs.map( (x) => Number(x.value) );

  inputs[2].max = String( rowCount * colCount - 1 );
}

/**Creates a canvas of the game board and displays it onto the webpage
 *@param {number} rows input from user to create the board
 *@param {number} totalBoom input from user for how many bombs
 *@function createCanvas makes a visual friendly layout
 *@function setTimeout stops runtime of code
 *@function alert prompts dialogue box
 *@returns game board array
*/
function setup() {
  var inputs = Array.from(document.getElementsByClassName("setupInput")); // Input elements
  if( inputs.some( (x) => !x.reportValidity() ) ) { return; }             // Stop if invalid
  [ rows, cols, mineCount ] = inputs.map( (x) => Number(x.value) );   // Assign variables
  [ width, height ] = [ rows * w + 1,                                 // Get width/height in px
                        cols * w + 1 ];

  /*
   * From p5.js online docs
   * createCanvas() should be called on line one of setup
   * and setup is directly called by p5.js which then leads
   * to putting draw() in a loop. I think we should use
   * setup() to instantiate the canvas element itself per p5.js
   * instructions, and move the above input handling code to its own
   * method. loop() noLoop() can be used to start and stop rendering
   * and redraw() lets us draw only once when necessary
   */
  if (document.contains(document.getElementById('board'))) {
    document.getElementById('board').remove();
  }
  let board = document.createElement('div');
  board.id = 'board';
  board.addEventListener( "contextmenu", (evt) => evt.preventDefault() );
  endGameCheck = false;
  gameBoard = build2DArray(rows, cols);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      /* later we can avoid needing to pass the width parameter (w) by
       *    by rendering the boxes in whatever holds the canvas element
       */
      let tempBox = new Box(i, j, w, 0);
      tempBox.attach(board);
      gameBoard[i][j] = tempBox;
    }
  }
  document.getElementById('boardDiv').appendChild(board);
  document.body.onmousemove = function(e)
  {
    globalEvent = e;
    if(runAwayMode){
      for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(gameBoard[i][j].boom == -1){
              gameBoard[i][j].runAway(globalEvent);
              }
            }
        }
      }
  };
  //initBoom
  while( mineCount != 0 ) {
    var randX = Math.floor( Math.random() * rows );
    var randY = Math.floor( Math.random() * cols );
    if( gameBoard[randX][randY].boom == 0 ) {     // consider renaming 'boom' to something more descriptive
      gameBoard[randX][randY].boom = -1;
      mineCount--;
    }
  }
  //setup value
  for( var i = 0 ; i < rows; i++ ) {
    for( var j = 0; j < cols ; j ++ ) {
      // should we have 'boom' hold both count and is-a-mine info? it makes sense.
      gameBoard[i][j].boom = gameBoard[i][j].boom ? -1 : getCenterCount( i, j );
    }
  }
}

/** Allows user to press mouse left button to reveal a Box
* @function mouseReleased is called when the mouseButton has been unclicked
*/
function mouseDown(i, j, e) {
  // row should be y-related, col x-related. doesn't work that way rn
  // This switch statement changes controls to use left and right mouse buttons,
  // no more button pressing
  if(e.target !== e.currentTarget)
    return;
  e = e || window.event;
  let mouseButton;
  if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      mouseButton = e.which;
  switch( mouseButton ) {
    case 1:
      gameBoard[i][j].reveal();
      checkWinConditions();
      break;
    case 3:
      gameBoard[i][j].toggleFlag();
      break;
    default:
      break;
  }
}

function checkWinConditions() {
  var gameWon = !gameBoard.some( ( row ) => {               // there are no rows such that
    return row.some( (cell) => {                                  // the row has no cell such that
      return ( !cell.revealed && ( cell.boom != -1 ) );    // that cell is not revealed and not a bomb
    })
  });
  if( gameWon ) {
    endGameWin();
  }
}

/** Checks the conditions to prompt a win
*/
function endGameWin() {
  if( endGameCheck == false ) {
    endGameCheck = true;
    for( let i = 0; i < rows; i++ ) {
      for( let j = 0; j < cols; j++ ) {
        if( !gameBoard[i][j].revealed && !gameBoard[i][j].flagged ) {
          gameBoard[i][j].reveal();
        }
      }
    }
    alert("Mines successfully swept");  // I removed the timeout. The time out allows the board to finish rerendering the board.
  }
}

/** Checks the conditions to prompt a loss
*/
function endGameLose() {
  if ( endGameCheck == false ) {
    endGameCheck = true;
    console.log( endGameCheck );
    for ( let i = 0; i < rows; i++ ) {
      for ( let j = 0; j < cols; j++ ) {
        if ( !gameBoard[i][j].revealed ) {
          gameBoard[i][j].reveal();
        }
      }
    }
    alert("You have lost!");
  }
}

/** Builds a 2D Array
  * @param {number} rows recieved from user
  * @param {number} cols recieved from user
  * @param returns the built array
  */
function build2DArray (rows, cols){
  let arr = [];//changed how this array was being initialized --Cameron--
  for (let i = 0; i < rows; i++) {//changed vars to lets --Cameron--
    arr.push([]);//changed how a new column is added at the row index --Cameron--
  }
  return arr;
}


/**Creates the numbers for the logic of the game board
* @function getCenterCount checks surrounding boxes for bombs and displays how many near it
* @param {number} x row value of array
* @param {number} y column value of array
* @try adds the number to the board if it exists
* @catch does nothing if it doesn't exist
* @returns the value
*/
function getCenterCount( x , y ) {
  var position = [
    [ x - 1, y - 1 ],
    [ x - 1, y     ],
    [ x - 1, y + 1 ],
    [ x    , y - 1 ],
    [ x    , y + 1 ],
    [ x + 1, y - 1 ],
    [ x + 1, y     ],
    [ x + 1, y + 1 ],
  ]
  var count = 0
  for(var i = 0 ; i < position.length ; i++) {
    var row = position[i][0]
    var col = position[i][1]
    if( gameBoard[ row ] != undefined && gameBoard[ row ][ col ] != undefined ) {
      count += (gameBoard[ row ][ col ].boom == -1);
    }
  }
  return count
}
