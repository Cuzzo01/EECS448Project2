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
            count += (game[a][b] == -1)
        }
        catch(e){}
    }
    return count 
}

function Display(){
    for(var i = 0 ; i <size; i++)
    {
        for(var j = 0; j <size; j ++ )
        {
            var center = game[i][j]
            if(center === -1)
            {
                continue
            }
            var centerDisplayNum = getCenterCount(i,j)
            game[i][j] = centerDisplayNum
        }
    }
}

initBoom()
Display()
console.log(game)