//canvasの設定
var canvas = document.getElementById( 'canvas' );
var w = 55;
var h = 35;
canvas.width = w*16;	//canvasの横幅（よこはば）
canvas.height = h*16;	//canvasの縦幅（たてはば）

//コンテキストの取得
var ctx = canvas.getContext('2d');

//地面のImageオブジェクト
// var mazeroad = new Image();
// mazeroad.src = 'img/mazeroad.jpg';

//壁のImageオブジェクト
var mazewall = new Image();
mazewall.src = 'Wall.PNG';

//ゴールのImageオブジェクト
var goal = new Object();
goal.img = new Image();
goal.img.src = 'Goal.PNG';
goal.x=52*16;
goal.y=32*16;

//プレイヤーのオブジェクト作成
var player = new Object();
player.img = new Image();
player.img.src = 'Player.PNG'
player.x=52*16;
player.y=12*16;
player.move=0;

//キーボードのオブジェクト作成
var key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';

var maze = new Array(w * h);
    for (var y = 1; y < h - 1; y ++) {
        for (var x = 1; x < w - 1; x ++) {
            maze[x + w * y] = 1;
        }
    }
    
// 開始位置と方向とパターン
var startX = w - 5;        // 固定位置
var startY = 4;            // 固定位置
var dir = [[-1, 0], [0, -1], [1, 0], [0, 1]];
var pattern = 
    [[0, 1, 2, 3]
    ,[0, 1, 3, 2]
    ,[0, 2, 1, 3]
    ,[0, 2, 3, 1]
    ,[0, 3, 1, 2]
    ,[0, 3, 2, 1]
    ,[1, 0, 2, 3]
    ,[1, 0, 3, 2]
    ,[1, 2, 0, 3]
    ,[1, 2, 3, 0]
    ,[1, 3, 0, 2]
    ,[1, 3, 2, 0]
    ,[2, 0, 1, 3]
    ,[2, 0, 3, 1]
    ,[2, 1, 0, 3]
    ,[2, 1, 3, 0]
    ,[2, 3, 0, 1]
    ,[2, 3, 1, 0]
    ,[3, 0, 1, 2]
    ,[3, 0, 2, 1]
    ,[3, 1, 0, 2]
    ,[3, 1, 2, 0]
    ,[3, 2, 0, 1]
    ,[3, 2, 1, 3]];

// 穴掘り法
function dig(x, y) {
    // ランダムを使わずに生成
    var type = (x + 3) * (y + 5) * 11% pattern.length;
    for (var i = 0; i < dir.length; i++) {
        var next = dir[pattern[type][i]];
        if (maze[(x + next[0] * 2) + w * (y + next[1] * 2)] == 1) {
            maze[(x + next[0] * 2) + w * (y + next[1] * 2)] = 0;
            maze[(x + next[0]    ) + w * (y + next[1]    )] = 0;
            dig(x + next[0] * 2, y + next[1] * 2);
        }
    }
}
dig(startX, startY);

function main(){
    ctx.fillStyle = "rgb(0,0,0)";

    ctx.fillRect(0,0,880,560);

    for(var y=0; y<h; y++){
        for(var x=0; x<w; x++){
            if(maze[x+w*y]===0)ctx.drawImage(mazeroad,0,0,16,16,16*x,16*y,16,16);
            if(maze[x+w*y]===1)ctx.drawImage(mazewall,0,0,16,16,16*x,16*y,16,16);
        }
    }

    //プレイヤー表示
    ctx.drawImage( player.img,player.x,player.y);
    //ゴール表示
    ctx.drawImage( goal.img,goal.x,goal.y);

    addEventListener("keydown",keydownfunc,false);
    addEventListener("keyup",keyupfunc,false);

    if(player.move === 0){            
        if ( key.left === true ) {
            var x = player.x/16;
            var y = player.y/16;
            x--;
            if( maze[x+w*y] === 0 ){
                player.move = 16;
                key.push = 'left';
            }
		}
		if ( key.up === true ) {
			var x = player.x/16;
            var y = player.y/16;
            if( y !== 0 ){
                y--;
            if( maze[x+w*y] === 0 ){
                player.move = 16;
                key.push = 'up';
            }
            }
		}
		if ( key.right === true ) {
			var x = player.x/16;
            var y = player.y/16;
            x++;
            if( maze[x+w*y] === 0 ){ 
                player.move = 16;
                key.push = 'right';
            }
		}
		if ( key.down === true ) {
			var x = player.x/16;
            var y = player.y/16;
            if( y !== 34){
                y++;
            if( maze[x+w*y] === 0 ){
                player.move = 16;
                key.push = 'down';
            }
            }
        }
	}
    //押しっぱにした時の処理
    if(player.move > 0){
        player.move -= 4;
        if(key.push === 'left')player.x -= 4;
        if(key.push === 'up')player.y -= 4;
        if(key.push === 'right')player.x += 4;
        if(key.push === 'down')player.y += 4;
    }
    //ゴール処理
    if(player.x===goal.x&&player.y===goal.y){
        alert("ゴール！！",window.location.reload());
    }

    requestAnimationFrame( main );
}

addEventListener('load',main(),false);

//キーボードが押されたときに呼ばれる関数
function keydownfunc( event ){
    var key_num = event.keyCode;
    if( key_num == 37 )key.left = true;
    if( key_num == 38 )key.up = true;
    if( key_num == 39 )key.right = true;
    if( key_num == 40 )key.down = true;
    event.preventDefault();
}

//押されたキーボードが戻るときに呼ばれる関数
function keyupfunc( event ){
    var key_num = event.keyCode;
    if( key_num == 37 )key.left = false;
    if( key_num == 38 )key.up = false;
    if( key_num == 39 )key.right = false;
    if( key_num == 40 )key.down = false;
}

