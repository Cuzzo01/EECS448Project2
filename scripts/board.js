/** @fileOverview This class creates the game board and functions interacting with it
 * @author Kevin Dinh, Eric Seals, Eric D. Fan Ye, Evan Trout
 */

/*
 * we have to encapsulate this into a class.. this is all imperative
 */

var w = 20;
var gameBoard, rows, cols, mineCount, endGameCheck;
var cnv, width, height;


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
  var cnv = createCanvas(width, height);  // look at p5.js reference material
  cnv.parent('board');
  background(0);
  endGameCheck = false;
  gameBoard = build2DArray(rows, cols);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      /* later we can avoid needing to pass the width parameter (w) by
       *    by rendering the boxes in whatever holds the canvas element
       */
      gameBoard[i][j] = new Box(i * w, j * w, w, 0);
    }
  }
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
  draw();
  noLoop();
}

/** Allows user to press mouse left button to reveal a Box
* @function mouseClicked checks to see if mouse is clicked
*/
function mouseClicked() {
  // row should be y-related, col x-related. doesn't work that way rn
  var [ row, col ] = [ mouseX, mouseY ].map( (x) => Math.floor( x / w ) );
  if( row < 0 || row >= rows || col < 0 || col >= cols ) {
    return; 
  }
  reveal( row, col );

  // Call the p5.js renderer to redraw the canvas
  redraw();
}

// ok not exactly digging the keyboard thing?
// we don't have to sort through all the spaces, just divide and floor x and y by 20 should do it

/* Allows user to any button to place a flag on the box
* @function keyPressed checks to see if key is pressed
* @function unFlagBox removes flag
* @function flagBox add flag
*/
function keyPressed() {
  var [ row, col ] = [ mouseX, mouseY ].map( (x) => Math.floor( x / w ) );
  if( row < 0 || row >= rows || col < 0 || col >= cols ) {
    return;
  }
  // change unFlagBox and flagBox to just a toggle
  // because we no longer have a finite supply of flags
  // we can limit the logic checks necessary for that
  gameBoard[row][col].flagged ? unFlagBox( row, col ) : flagBox( row, col );
 
  // Call the p5.js renderer to redraw the canvas
  redraw();
}


/** Checks the conditions to prompt a win
*/
function endGameWin() {
  if( endGameCheck == false ) {
    endGameCheck = true
    for( let i = 0; i < rows; i++ ) {
      for( let j = 0; j < cols; j++ ) {
        if( !gameBoard[i][j].revealed && !gameBoard[i][j].flagged ) {
          reveal( i, j )
        }
      }
    }
    setTimeout( function () { alert("Mines successfully swept"); }, 10 ) // again not sure why this is a timeout?
  }
}

/** Checks the conditions to prompt a loss
*/
function endGameLose() {
  if ( endGameCheck == false ) {                      // could replace with a if( endGameCheck) { return; }
    endGameCheck = true                               // not sure why we change that exactly?
    console.log( endGameCheck )
    for ( let i = 0; i < rows; i++ ) {
      for ( let j = 0; j < cols; j++ ) {
        if ( !gameBoard[i][j].revealed ) {
          reveal(i, j)
        }
      }
    }
    setTimeout(function () { alert("u r bad"); }, 10)
  }
}

/** Builds a 2D Array
* @param {number} rows recieved from user
* @param {number} cols recieved from user
* @param returns the built array
*/
function build2DArray (rows, cols)  {
  var array = new Array(rows);                // the wiley end-of-line semi-colon can be found here
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(cols)
  }
  return array
}

/**Presents the visuals in a user friendly away
*@function draw creates visuals
*/
function draw() {
  // optimize by only redrawing as needed? maybe? currently this redraws the entire board
  background( 50, 50, 70 )
  for( var i = 0; i < rows; i++ ) {
    for( var j = 0; j < cols; j++ ) {
      gameBoard[i][j].draw()
    }
  }
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
    var a = position[i][0]
    var b = position[i][1]
    try {                                        // interesting use of a try-catch block?
      count += (gameBoard[a][b].boom == -1)      // out of range indices in JS return with type `nothing`
    }                                            // replace that weird statement w/ just an increment
    catch(e) {}                                  // general rule, if your catch block does nothing,
  }                                              // you don't need it?
  return count
}
