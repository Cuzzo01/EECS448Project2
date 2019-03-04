/** @fileOverview This class creates the game board and functions interacting with it
* @author Kevin Dinh, Eric Seals, Eric D. Fan Ye, Evan Trout
*/

/*
* we have to encapsulate this into a class.. this is all imperative
*/

var w = 20
var gameBoard
var rows
var cols
var totalBoom
var endGameCheck
var flagPool
var correctFlags
var flagGoal

/**Creates a canvas of the game board and displays it onto the webpage
*@param {number} rows input from user to create the board
*@param {number} totalBoom input from user for how many bombs
*@function createCanvas makes a visual friendly layout
*@function setTimeout stops runtime of code
*@function alert prompts dialogue box
*@returns game board array
*/
function setup() {
  // why run through the loop before setup???
  loop()
  /*
   * this bit looks confused. i'd say do something like:
   * var [rows, cols, count] = document.querySelectors("input[type='number']").map( (x) => Number(x) );
   * might want to replace the querySelector with a getElementByClass;
   *      elements can have multiple classes so it's a convenient way to group them
   *      and then javascript has destructuring assignment and array mapping.
   * 'size' to go to width, height for independent row/col count
   * later try encapsulating the canvas element a bit more for organization.
   */
  let size = (w*Number(document.getElementById("input1").value)+1)
  rows = floor(size/w)
  cols = floor(size/w)
  totalBoom = document.getElementById("input2").value
  if( totalBoom >= rows*cols ) {
    totalBoom = ( (rows * cols) - 1 )
    setTimeout( function () {
    alert("The bombs must be less than size * size -1 "   ); 10})
        // the format of the timeout is wrong and there's no actual reason to have a timeout here
        // I assume because it forces your mine count (totalBoom) to the allowed maximum it doesn't
        // abort the setup, so this allows the rest of the board to be setup w/o the message box,
        // which is blocking preventing the rest of the setup function executing
        // however the timeout is wrong and does fire because the end of the line should be:
        //      ..); }, 10);
  }
  flagPool = totalBoom
  correctFlags = 0
  flagGoal = totalBoom
  let cnv = createCanvas(size, size)      // p5.js
  //createCanvas(size, size)              <-- ???
  //stroke(0)                             
  //background(255, 0, 200)
  cnv.parent('board')                     // p5.js
  background(0)
  endGameCheck = false
  rows = floor(size/w)                    // redeclared because fuck it
  cols = floor(size/w)                    // still very confused
  gameBoard = build2DArray(rows, cols)
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      // why not just pass a 0 literal to the Box constructor???
      let boom = 0
      gameBoard[i][j] = new Box(i*w, j*w, w, boom)
    }
  }
  //initBoom
  while( totalBoom != 0 ) {
    var randX = Math.floor( Math.random() * rows )
    var randY = Math.floor( Math.random() * cols )
    if( gameBoard[randX][randY].boom == 0 ) {
      gameBoard[randX][randY].boom = -1
      totalBoom--
    }
  }
  //setup value
  for( var i = 0 ; i < rows; i++ ) {
    for( var j = 0; j <cols ; j ++ ) {
      var center = gameBoard[i][j].boom
      if( center == -1 ) {
        continue
      }
      var centerDisplayNum = getCenterCount( i, j )
      gameBoard[i][j].boom = centerDisplayNum
    }
  }

  return(false)         // return is a keyword not a function so the parentheses are unnecessary
}                       // it returns false to prevent the form from sumbitting I think


/** Allows user to press mouse left button to reveal a Box
* @function mouseClicked checks to see if mouse is clicked
*/
function mouseClicked() {
  for( var i = 0; i < rows; i++ ) {
    for( var j = 0; j < cols; j++ ) {
      var myX = gameBoard[i][j].x
      var myY = gameBoard[i][j].y
      if( myX < mouseX)                     // interesting use of single-line if statements...
        if( myX + w > (mouseX) )
          if( myY < mouseY)
            if( myY + w > (mouseY ) ) {
              if (!gameBoard[i][j].flagged && !gameBoard.revealed) {
                reveal(i, j)
              }
            }
    }
  }
}

// ok not exactly digging the keyboard thing?
// we don't have to sort through all the spaces, just divide and floor x and y by 20 should do it

/* Allows user to any button to place a flag on the box
* @function keyPressed checks to see if key is pressed
* @function unFlagBox removes flag
* @function flagBox add flag
*/
function keyPressed() {
  //Determine if mouse is currently on grid
  for ( var i = 0 ; i < rows ; i++) {
    for ( var j = 0 ; j < cols ; j++) {
      var myX = gameBoard[i][j].x
      var myY = gameBoard[i][j].y
      if( myX < mouseX )                                  // more nested single line conditionals
        if( myX + w > mouseX )
          if( myY < mouseY )
            if( myY + w > mouseY ) {
              //check if revealed
              console.log( "i: " + i + "j: " + j )
              if ( gameBoard[i][j].revealed == true ) {
                //do nothing                                        <-- if that does nothing??? 
              } else if ( gameBoard[i][j].flagged == true ) {
                //If already flagged, take away flag
                unFlagBox(i, j)
              } else if ( gameBoard[i][j].flagged == false && flagPool > 0 ) {
                //If not flagged and flags are remaining, add a flag
                flagBox(i, j)
              }
            }
    }
  }
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
