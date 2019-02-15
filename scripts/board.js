var w = 20
var gameBoard;
var rows;
var cols;
var cnv;
var boomNum = 10

function setup(){
    let width = w*Number(document.getElementById("rows").value)
    let height = w*Number(document.getElementById("cols").value)
    console.log((width,height))
    cnv = createCanvas(width, height)
    cnv.parent('board')
    background(255, 0, 200);
    rows = floor(width/w)
    cols = floor(height/w)
    gameBoard = build2DArray(rows, cols)
    console.log(gameBoard)
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          let boom = 0
        gameBoard[i][j] = new Box(i*w, j*w, w, boom)
        }
    }
    initBoom()
  
    return(false)
}
function initBoom(){
  var nowBoomNum = 0
  var randX
  var randY
  while(nowBoomNum < boomNum){
      randX = parseInt(Math.random()*size)
      randY = parseInt(Math.random()*size)
      if(gameBoard[randX][randY].boom == 0){
          gameBoard[randX][randY].boom = -1
          nowBoomNum ++
      }
  }
 
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
                console.log("Is this working")
                console.log("This is x coordinate: " + myX)
                console.log("This is y coordinate: " + myY)
                gameBoard[i][j].clicked = true
              }
    }
  }
}

class Box {
    constructor(x, y, w, boom){
        this.x = x
        this.y = y
        this.w = w
        this.clicked = false
        this.boom =boom
    }

    draw () {
      stroke(0)
      if(this.clicked){
        fill(100)
        
      }
      else {
        fill(255)
      }
      rect(this.x,this.y,this.w,this.w)
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
    background(500)
    for (var i = 0; i<rows; i++) {
        for (var j=0; j<cols; j++) {
            gameBoard[i][j].draw()
        }
    }
}
