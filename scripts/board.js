// First Board
// var newCanvas = document.createElement("canvas");
// newCanvas.id = board.canvasID;
// newCanvas.width = 100;
// newCanvas.height = 100;
// newCanvas.style = "border:1px solid #000000;";
//
//
// var parentElement = document.getElementById('board');
// parentElement.appendChild(newCanvas);

function setup(){
  createCanvas(200, 200);
  rows = floor(width/w);
  cols = floor(height/w);
  gameBoard = build2DArray(rows, cols);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      gameBoard[i][j] = new Box(i, j, w);
    }
  }

}


function Box (x, y, w){
  this.x = x;
  this.y = y;
  this.w = w;

}

function build2DArray (rows, cols){
  var arr = new Array(rows);
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(cols);
  }
  return arr;
}
