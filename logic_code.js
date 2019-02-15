var game =[]
var size = 10
var boomNum = 10

for(var i = 0; i <size; i++)
{
    game.push(
        Array(size).fill(0)
    )   
}
function initBoom(){
    var nowBoomNum = 0
    var randX
    var randY
    while(nowBoomNum < boomNum){
        randX = parseInt(Math.random()*size)
        randY = parseInt(Math.random()*size)
        if(game[randX][randY] === 0){
            game[randX][randY] = -1
            nowBoomNum ++
        }
    }
   
}