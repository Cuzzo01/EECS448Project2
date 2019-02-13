// First Board
var newCanvas = document.createElement("canvas");
newCanvas.id = board.canvasID;
newCanvas.width = 100;
newCanvas.height = 100;
newCanvas.style = "border:1px solid #000000;";

var parentElement = document.getElementById('board');
parentElement.appendChild(newCanvas);