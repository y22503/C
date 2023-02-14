start = () =>{
let textbox1 = (document.querySelector("width"))
width = Number(textbox1.value);
let textbox2 = (document.querySelector("height"));
height = Number(textbox2.value);
console.log(width);
console.log(height);
const size = 25;
}
// const size = 25;
// let width = 20;
// let height = 20;

let gameover = 0;

const map = [];
//番兵を使って要素の終端を必ず失敗にする
for (let y = 0; y < height + 2; y++) {
  map[y] = [];
  for (let x = 0; x < width + 2; x++) {
    //要素の終端（番兵）
    if (x === 0 || y === 0 || x === width + 1 || y === height + 1) {
      //番兵をkanryou: 1にし、外周を判断する
      map[y][x] = {
        kanryou: 1
      };
    } else {
      map[y][x] = {
        kanryou: 0,
        //連想配列でキーと値を紐づける
        kabe: { up: 1, down: 1, left: 1, right: 1 }
      };
    }
  }
}

//壁を表示する関数
const showMap = () => {
  const borderWidth = size / 30 + "px";
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      let masu = map[y][x];
      //壁があるところはborderを適用させる
      masu.element.style.borderWidth = `${masu.kabe.up ? borderWidth : 0} ` + `${masu.kabe.right ? borderWidth : 0} ` + `${masu.kabe.down ? borderWidth : 0} ` + `${masu.kabe.left ? borderWidth : 0}`;
    }
  }
};
//自分を表示する関数
let update = () => {
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      let masu = map[y][x];
      // 自分の場所は色を変える
      if (x == currentX && y == currentY) {
        masu.element.style.backgroundColor = "#0f8";
        // ゴールの色を変える
      } else if (x === width && y === height) {
        masu.element.style.backgroundColor = "#099";
      } else {
        masu.element.style.backgroundColor = "#fff";
      }
    }
  }
};
//baseDirectionの文字列に対応するベクトルを定義する
const vector = { "up": [0, -1], "down": [0, 1], "left": [-1, 0], "right": [1, 0] };

//スタート位置を設定する
let digTarget = [[1, 1]];
map[1][1].kanryou = 1;
let dig = async () => {
  while (digTarget.length) {
    let [x, y] = digTarget.pop();
    //ゴールまで掘ったら初めに戻る
    if (x == width && y == height) {
      continue;
    }
    let baseDirection = ["up", "down", "left", "right"];
    let directionList = [];
    //bsseDirectionからランダムで要素をとってdirectionListに追加する
    while (baseDirection.length) {
      // directionList[0] = baseDirection.splice(
      //   Math.trunc(Math.random() * baseDirection.length), 1)[0];

      let item = baseDirection.splice(
        Math.trunc(Math.random() * baseDirection.length), 1)[0];
      directionList.push(item);
    }
    let action = 0;
    //directionにdirectionListの要素を入れながら
    for (let direction of directionList) {
      // console.log(direction);
      let [dx, dy] = vector[direction];
      // console.log(dx,dy);

      //開始位置からどの方向に進むか
      let tx = x + dx;
      let ty = y + dy;
      //既に壁が壊されていたら初めに戻る
      if (map[ty][tx].kanryou) {
        continue;
      }
      map[ty][tx].kanryou = 1;
      //スタート位置を現在の位置にする
      digTarget.push([tx, ty]);
      action = 1;
      //borderがマスごとにあり、壁が二重になっているので二つずつ壊す
      switch (direction) {
        case "up":
          map[y][x].kabe.up = 0;
          map[ty][tx].kabe.down = 0;
          break;
        case "down":
          map[y][x].kabe.down = 0;
          map[ty][tx].kabe.up = 0;
          break;
        case "left":
          map[y][x].kabe.left = 0;
          map[ty][tx].kabe.right = 0;
          break;
        case "right":
          map[y][x].kabe.right = 0;
          map[ty][tx].kabe.left = 0;
          break;
        // default:
        //   break;
      }
      break;
    }
    if (action) {
      showMap();
      //過程が見えるようにする
      await new Promise((resolve) => setTimeout(resolve, 1));
      digTarget.unshift([x, y]);
    }
  }
};

let currentX = 1;
let currentY = 1;
let move = (direction) => {
  console.log(direction);
  //ゴールしたら処理を抜ける
  if (gameover) {
    return;
  }
  //自分のスタート位置
  let masu = map[currentY][currentX];
  //壁があったら処理を抜ける
  if (masu.kabe[direction]) {
    return;
  }
  let [dx, dy] = vector[direction];
  currentX += dx;
  currentY += dy;
  update();

  //ゴールした時の処理
  if (currentX === width && currentY === height) {
    gameover = 1
    location.reload();
    // alert("ゴール！！");
  }
};
//迷路を入れるcontainerの定義
let init = () => {
  let container = document.querySelector("#container");
  container.style.width = `${width * size}px`;
  container.style.height = `${height * size}px`;
  container.style.margin = "0 5vw";
  // container.style.marginTop = "5vh";

  //終端（番兵）を除いて迷路のマスを定義する
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      let div = document.createElement("div");
      //container(親)要素の中にdiv(マス)を追加する
      container.appendChild(div);
      // div.style.textAlign = "center"
      // div.style.justifyContent = "center";
      div.style.position = "absolute";
      div.style.width = `${size}px`;
      div.style.height = `${size}px`;
      div.style.left = `${(x - 1) * size}px`;
      div.style.top = `${(y - 1) * size}px`;
      div.style.backgroundColor = "#fff";
      div.style.border = "1px solid #f0f";
      div.style.boxSizing = "border-box";
      map[y][x].element = div;
    }
  }

};
// document.ondblclick = (e) => {
//   e.preventDefault();
// };
// 方向ボタンがクリックされたときの処理
left = () => {
  move("left");
}
right = () => {
  move("right");
}
up = () => {
  move("up");
}
down = () => {
  move("down");
};
// 方向キーが入力されたときの処理
document.addEventListener('keydown', (e) => {
  const code = e.code;
  switch (code) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
  }
});



window.onload =  () => {
  gameover = 1;
  init();
  dig();
  showMap();
  update();

  gameover = 0;
  let startTime = Date.now();
  let tick = () => {
    //タイマー
    let time = Date.now() - startTime;
    document.querySelector("#timer").textContent = (time / 1000).toFixed(2);
    requestAnimationFrame(tick);
  };
  tick();
};
// };
