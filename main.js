var canvas = document.getElementById("waku");
var w = 55;
var h = 35;
canvas.width = w * 16;	//canvasの横幅（よこはば）
canvas.height = h * 16;
var ctx = canvas.getContext('2d');

function printMaze( w, h){
    var i,j;


    for(j=0;j<h;j++){
        for(i=0;i<w;i++){
            if(maze[j][i]==0){
                ctx.drawImage(Wall.PNG)
            }
        }
    }
}
