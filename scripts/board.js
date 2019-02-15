var w = 20
var gameBoard;
var rows;
var cols;
var cnv;
var totalBoom = 10
function setup(){
    let width = w*Number(document.getElementById("rows").value)
    let height = w*Number(document.getElementById("cols").value)
    cnv = createCanvas(width, height)
    cnv.parent('board')
    background(255, 0, 200);
    rows = floor(width/w)
    cols = floor(height/w)
    gameBoard = build2DArray(rows, cols)
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
        gameBoard[i][j] = new Box(i*w, j*w, w)
        }
    }

    while(totalBoom != 0){
      var randX = Math.floor(Math.random() * rows)
      var randY = Math.floor(Math.random() * rows)
      if(gameBoard[randX][randY].boom == 0){
        gameBoard[randX][randY].boom = -1
      }
      totalBoom--
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
                gameBoard[i][j].clicked = true
              }
    }
  }
}

class Box {
    constructor(x, y, w){
        this.x = x
        this.y = y
        this.w = w
        this.clicked = false
        this.boom = 0
    }

    draw () {
      stroke(255)
      if(this.clicked && this.boom == -1){
        fill(100)
        text("B", this.x+this.w*.5, this.y+this.w*.25)
      }
      else if(this.clicked && !this.boom){
        fill(255)
      }
      else {
        fill(100)
        rect(this.x,this.y,this.w,this.w)
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
    background(500)
    for (var i = 0; i<rows; i++) {
        for (var j=0; j<cols; j++) {
            gameBoard[i][j].draw()
        }
    }
}
