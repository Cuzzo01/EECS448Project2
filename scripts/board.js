/** @fileOverview This class creates the game board and functions interacting with it
  * @author Kevin Dinh, Eric Seals, Eric D. Fan Ye, Evan Trout
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
function setup(){
    loop()
    let size = (w*Number(document.getElementById("input1").value)+1)
    rows = floor(size/w)
    cols = floor(size/w)
    totalBoom = document.getElementById("input2").value
    if(totalBoom >= rows*cols )
    {
      totalBoom = ((rows*cols)-1)
      setTimeout(function () {
          alert("The bombs must be less than size * size -1 "   ); 10})
    }
    flagPool = totalBoom
    correctFlags = 0
    flagGoal = totalBoom
    let cnv = createCanvas(size, size)
    //createCanvas(size, size)
    //stroke(0)
    //background(255, 0, 200)
    cnv.parent('board')
    background(0)
    endGameCheck = false
    rows = floor(size/w)
    cols = floor(size/w)
    gameBoard = build2DArray(rows, cols)
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          let boom = 0
        gameBoard[i][j] = new Box(i*w, j*w, w, boom)
        }
    }
    //initBoom
    while(totalBoom != 0){
      var randX = Math.floor(Math.random() * rows)
      var randY = Math.floor(Math.random() * cols)
      if(gameBoard[randX][randY].boom == 0){
        gameBoard[randX][randY].boom = -1
        totalBoom--
      }
    }
    //setup value
      for(var i = 0 ; i <rows; i++)
      {
          for(var j = 0; j <cols; j ++ )
          {
              var center = gameBoard[i][j].boom
              if(center == -1)
              {
                  continue
              }
              var centerDisplayNum = getCenterCount(i,j)
              gameBoard[i][j].boom = centerDisplayNum
          }
      }


    return(false)
}

/** Allows user to press mouse left button to reveal a Box
  * @function mouseClicked checks to see if mouse is clicked
  */
function mouseClicked() {
  for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var myX = gameBoard[i][j].x
        var myY = gameBoard[i][j].y
        if( myX < mouseX)
          if( myX + w > (mouseX) )
            if( myY < mouseY)
              if( myY + w > (mouseY ) ){
                if (!gameBoard[i][j].flagged && !gameBoard.revealed)
                {
                  reveal(i, j)
                }
              }
    }
  }
}

/** Allows user to any button to place a flag on the box
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
      if( myX < mouseX )
        if( myX + w > mouseX )
          if( myY < mouseY )
            if( myY + w > mouseY ) {
              //check if revealed
              console.log( "i: " + i + "j: " + j )
              if ( gameBoard[i][j].revealed == true ){
                //do nothing
              }
              else if ( gameBoard[i][j].flagged == true ){
                //If already flagged, take away flag
                unFlagBox(i, j)
              }
	            else if ( gameBoard[i][j].flagged == false && flagPool > 0){
                //If not flagged and flags are remaining, add a flag
                flagBox(i, j)
	            }
            }
    }
  }
}


/** Checks the conditions to prompt a win
  */
function endGameWin()
{
  if (endGameCheck == false)
  {
    endGameCheck = true
    for (let i = 0; i < rows; i++)
    {
      for (let j = 0; j < cols; j++)
      {
        if (!gameBoard[i][j].revealed && !gameBoard[i][j].flagged)
        {
          reveal(i, j)
        }
      }
    }
    setTimeout(function () { alert("Mines successfully swept"); }, 10)
  }
}

/** Checks the conditions to prompt a loss
  */
function endGameLose()
{
  if (endGameCheck == false)
  {
    endGameCheck = true
    console.log(endGameCheck)
    for (let i = 0; i < rows; i++)
    {
      for (let j = 0; j < cols; j++)
      {
        if (!gameBoard[i][j].revealed)
        {
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
function build2DArray (rows, cols){
  var array = new Array(rows);
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(cols)
  }
  return array
}

/**Presents the visuals in a user friendly away
  *@function draw creates visuals
  */
function draw() {
    background(50, 50, 70)
    for (var i = 0; i<rows; i++) {
        for (var j=0; j<cols; j++) {
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
function getCenterCount(x,y){
  var position = [
  [x -1, y -1],
  [x -1, y],
  [x -1, y +1],
  [x, y -1],
  [x, y +1],
  [x +1, y -1],
  [x +1, y],
  [x +1, y +1],
  ]
  var count = 0
  for (var i =0 ; i< position.length ; i++)
  {
      var a = position[i][0]
      var b = position[i][1]
      try{
          count += (gameBoard[a][b].boom == -1)
      }
      catch(e){}
  }
  return count
}
