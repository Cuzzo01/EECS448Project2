/** @fileOverview This script file contains input handling and managing the
 * overall game board which is stored as a global variable.
 * @author Cameron Kientz, Grady Wright, Ian Hierl, Nick Marcuzzo
 */

var w = 20;
/** @type {Box[][]} */
var gameBoard;
/** @type {number} */
var rows, cols, mineCount, endGameCheck;
/** @type {bool} */
let runAwayMode = false;
let interval;
let globalEvent;
/** @type {number} */
var cnv, width, height;

/**Toggles global boolean runAwayMode, and depending on its new value start a
  * looped interval that fires a runAway() event from each Box object every 100 ms
  * A reference to this interval is saved as global variable "interval".
  * if runAwayMode is now true. if false, it clears the global interval.
  * @returns Nothing
  */
function toggleRunAwayMode() {
  runAwayMode = !runAwayMode;
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

/**Updates the maximum attribute of the mineCount input based on the rowCount
* and colCount values. Fires on blur event from number inputs.
*/
function updateInputFields() {
  var inputs = Array.from(document.getElementsByClassName("setupInput"));
  var [ rowCount, colCount, mineCount ] = inputs.map( (x) => Number(x.value) );

  inputs[2].max = String( rowCount * colCount - 1 );
}

/**Takes input from HTML to construct a 2D array of Box objects along with their
* related div HTML tag.
* @returns Nothing
*/
function setup() {
  if(runAwayMode)
    toggleRunAwayMode();
  var inputs = Array.from(document.getElementsByClassName("setupInput")); // Input elements
  if( inputs.some( (x) => !x.reportValidity() ) ) { return; }             // Stop if invalid
  [ rows, cols, mineCount ] = inputs.map( (x) => Number(x.value) );   // Assign variables
  [ width, height ] = [ rows * w + 1,                                 // Get width/height in px
                        cols * w + 1 ];

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

/** Function callback for handling mouse clicks
  * @param {number} row of the clicked box
  * @param {number} col of the clicked box
  * @param {Event} Event the event object passed to this callback
  * @returns Nothing
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

/**
  * Determines if the gameboard is in a valid win state
  * @returns Nothing
  */
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

/** Reveal all tiles and send win message
  * @returns Nothing
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

/** Toggles cheat mode. When active, all tiles are shown without altering their
  * current state in the game, allowing player to resume play
  * @returns Nothing
  */
function toggleCheatBoard() {
  for ( let i = 0; i < rows; i++ ) {
    for ( let j = 0; j < cols; j++ ) {
      gameBoard[i][j].toggleCheat();
    }
  }
}

/** Reveal all covered Boxes and send loss message
  * @returns Nothing
  */
function endGameLose() {
  if ( endGameCheck == false ) {
    endGameCheck = true;
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
  * @returns {array} an empty rows * cols array
  */
function build2DArray (rows, cols){
  let arr = [];//changed how this array was being initialized --Cameron--
  for (let i = 0; i < rows; i++) {//changed vars to lets --Cameron--
    arr.push([]);//changed how a new column is added at the row index --Cameron--
  }
  return arr;
}


/**
  * Returns the number of mines surrounding Box at (x, y)
  * @function getCenterCount returns the number of mines surrounding a Box
  * @param {number} x row index of Box
  * @param {number} y column index of Box
  * @returns the number of mines
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
  ];
  var count = 0;
  for(var i = 0 ; i < position.length ; i++) {
    var row = position[i][0];
    var col = position[i][1];
    if( gameBoard[ row ] != undefined && gameBoard[ row ][ col ] != undefined ) {
      count += (gameBoard[ row ][ col ].boom == -1);
    }
  }
  return count;
}
