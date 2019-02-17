var w = 20
var gameBoard
var rows
var cols
var totalBoom
var endGameCheck
var flagPool
var correctFlags
var flagGoal
function setup(){
    loop()
    let size = (w*Number(document.getElementById("input1").value)+1)
    rows = floor(size/w)
    cols = floor(size/w)
    totalBoom = document.getElementById("input2").value
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

function keyPressed() {
  console.log("testing keypress") 
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

function flagBox(i, j)
{
  gameBoard[i][j].flagged = true
  flagPool--
  if (gameBoard[i][j].boom == -1)
  {
    correctFlags++
    if (correctFlags == flagGoal)
    {
      endGameWin()
    }
  }
}


function unFlagBox(i, j)
{
  if (gameBoard[i][j].boom == -1)
  {
    correctFlags--
  }
  gameBoard[i][j].flagged = false
  flagPool++
}

function reveal(i, j)
{
  if (gameBoard[i][j].boom == 0 && !gameBoard[i][j].revealed)
  {
    gameBoard[i][j].revealed = true
    recurseReveal(i, j)
  }
  else if (gameBoard[i][j].boom == -1)
  {
    gameBoard[i][j].revealed = true
    endGameLose()
  }
  else
  {
    gameBoard[i][j].revealed = true
  }
}

function recurseReveal(curI, curJ)
{
  if (gameBoard[curI][curJ].boom == 0)
  {
    for (let i = -1; i <= 1; i++)
    {
      for (let j = -1; j <= 1; j++)
      {
        let newI = curI + i
        let newJ = curJ + j
        if (newI >= 0 && newI < rows)
        {
          if (newJ >= 0 && newJ < cols)
          {
            reveal(newI, newJ)
          }
        }
      }
    }
  }
}

function endGameWin()
{
  if (endGameCheck == false)
  {
    endGameCheck = true
    console.log(endGameCheck)
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

class Box {
    constructor(x, y, w, boom ){
        this.x = x
        this.y = y
        this.w = w
        this.boom = 0
        this.revealed = false
	      this.flagged = false
    }

    draw () {
      stroke(50, 50, 70)
      if(this.revealed && this.boom == -1){
        fill(255, 255, 255)
        stroke(255, 255, 255)
        circle(this.x+10,this.y+10, 3);
        //text(this.boom, this.x+this.w*.25, this.y+this.w*.75)
      }
      else if(this.revealed && this.boom != -1){
        fill(216, 186, 255)
        stroke(216, 186, 255)
        if (this.boom > 0) {
          text(this.boom,this.x+this.w*.25, this.y+this.w*.75)
        }
      }
      else if (this.flagged){
         fill(107, 220, 254)
	      triangle(this.x+5, this.y+15, this.x+10, this.y, this.x+15, this.y+15)
      }
      else {
        fill(107, 220, 254)
        //text(this.boom,this.x+this.w*.25, this.y+this.w*.75)
        rect(this.x,this.y,19,this.w,6)
      }
    }
}



function build2DArray (rows, cols){
  var array = new Array(rows);
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(cols)
  }
  return array
}

function draw() {
    background(50, 50, 70)
    for (var i = 0; i<rows; i++) {
        for (var j=0; j<cols; j++) {
            gameBoard[i][j].draw()
        }
    }
}

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
