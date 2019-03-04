/** @fileOverview This class creates the game board and functions interacting with it
 * @author Kevin Dinh, Eric Seals, Eric D. Fan Ye, Evan Trout
 */

/*
 * we have to encapsulate this into a class.. this is all imperative
 */

var w = 20;
var gameBoard, rows, cols, mineCount, endGameCheck;
var cnv, width, height;

/**Creates a canvas of the game board and displays it onto the webpage
 *@param {number} rows input from user to create the board
 *@param {number} totalBoom input from user for how many bombs
 *@function createCanvas makes a visual friendly layout
 *@function setTimeout stops runtime of code
 *@function alert prompts dialogue box
 *@returns game board array
*/
function setup() {
  /*
   * this bit looks confused. i'd say do something like:
   * var [rows, cols, count] = document.querySelectors("input[type='number']").map( (x) => Number(x) );
   * might want to replace the querySelector with a getElementByClass;
   *      elements can have multiple classes so it's a convenient way to group them
   *      and then javascript has destructuring assignment and array mapping.
   * 'size' to go to width, height for independent row/col count
   * later try encapsulating the canvas element a bit more for organization.
   */
  var [ rows, cols, mineCount ] = document.getElementsByClassName("setupInput")
                                          .map( (x) => Number(x) );
  var [ width, height ] = [ rows * w + 1,
                            cols * w + 1 ];
  if( mineCount >= rows * cols ) {
    mineCount = ( (rows * cols) - 1 );
    setTimeout( () => alert("The bombs must be less than size * size -1 " ), 10 );
        // the format of the timeout is wrong and there's no actual reason to have a timeout here
        // I assume because it forces your mine count (totalBoom) to the allowed maximum it doesn't
        // abort the setup, so this allows the rest of the board to be setup w/o the message box,
        // which is blocking preventing the rest of the setup function executing
        // however the timeout is wrong and does fire because the end of the line should be:
        //      ..); }, 10);
        // this should be rendered unnecessary by using the max attribute
  }
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
      totalBoom--;
    }
  }
  //setup value
  for( var i = 0 ; i < rows; i++ ) {
    for( var j = 0; j < cols ; j ++ ) {
      // should we have 'boom' hold both count and is-a-mine info? it makes sense.
      gameBoard[i][j].boom = gameBoard[i][j].boom ? -1 : getCenterCount( i, j );
    }
  }

  return false;         // return is a keyword not a function so the parentheses are unnecessary
}                       // it returns false to prevent the form from sumbitting I think


/** Allows user to press mouse left button to reveal a Box
* @function mouseClicked checks to see if mouse is clicked
*/
function mouseClicked() {
  var [ row, col ] = [ mouseX, mouseY ].map( Math.floor );
  reveal( row, col );
}

// ok not exactly digging the keyboard thing?
// we don't have to sort through all the spaces, just divide and floor x and y by 20 should do it

/* Allows user to any button to place a flag on the box
* @function keyPressed checks to see if key is pressed
* @function unFlagBox removes flag
* @function flagBox add flag
*/
function keyPressed() {
  var [ row, col ] = [ mouseX, mouseY ].map( Math.floor );
  if( gameBoard[row][col].revealed ) { return; }
  
  // change unFlagBox and flagBox to just a toggle
  // because we no longer have a finite supply of flags
  // we can limit the logic checks necessary for that
  gameBoard[i][j].flagged ? unFlagBox( row, col ) : flagBox( row, col );
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
