var w = 20
var gameBoard;
var rows;
var cols;
function setup(){
    let width = w*Number(document.getElementById("rows").value) 
    let height = w*Number(document.getElementById("cols").value)
    console.log((width,height))
    createCanvas(width, height)
    background(255);
    rows = floor(width/w)
    cols = floor(height/w)
    gameBoard = build2DArray(rows, cols)
    console.log(gameBoard)
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
        gameBoard[i][j] = new Box(i*w, j*w, w)
        }
    }
}

class Box {
    constructor(x, y, w){
        this.x = x
        this.y = y
        this.w = w
    }

    draw () {
        stroke(0)
        fill(255)
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
    background(255)

    for (var i = 0; i<rows; i++) {
        for (var j=0; j<cols; j++) {
            gameBoard[i][j].draw()
        }
    }
}
