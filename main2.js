// let start = () =>{
  // let textbox1 = (document.querySelector("width"))
  // let width = textbox1.value;
  // width = Number(width);
  // let textbox2 = (document.querySelector("height"));
  // let height = textbox2.value;
  // height = Number(height);
  // console.log(width);
  // console.log(height);
const size = 25;
let width = 20;
let height = 20;

let gameover = false;

const map = [];
//番兵を使って要素の終端を必ず失敗にする
for (let y = 0; y < height + 2; y++) {
  map[y] = [];
  for (let x = 0; x < width + 2; x++) {
    //要素の終端（番兵）
    if (x === 0 || y === 0 || x === width + 1 || y === height + 1) {
      //番兵をcheckkk: trueにし、外周を判断する
      map[y][x] = {
        checkkk: true
      };
    } else {
      map[y][x] = {
        checkkk: false,
        wall: {
          up: true,
          down: true,
          left: true,
          right: true
        }
      };
    }
  }
}

const vector = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0]
};

const showMap = () => {
  const borderWidth = size / 30 + "px";
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      let cell = map[y][x];
      cell.element.style.borderWidth =
        `${cell.wall.up ? borderWidth : 0} ` +
        `${cell.wall.right ? borderWidth : 0} ` +
        `${cell.wall.down ? borderWidth : 0} ` +
        `${cell.wall.left ? borderWidth : 0}`;
    }
  }
};

let update = () => {
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      let cell = map[y][x];
      if (x === currentX && y === currentY) {
        cell.element.style.backgroundColor = "#c88";
      } else if (x === width && y === height) {
        cell.element.style.backgroundColor = "#054";
      } else {
        cell.element.style.backgroundColor = "#fff";
      }
    }
  }
};

let digTarget = [[1, 1]];
map[1][1].checkkk = true;
let dig = async () => {
  while (digTarget.length) {
    let [x, y] = digTarget.pop();
    if (x === width && y === height) {
      continue;
    }
    let baseDirection = ["up", "down", "left", "right"];
    let directionList = [];
    while (baseDirection.length) {
      let item = baseDirection.splice(
        Math.trunc(Math.random() * baseDirection.length),
        1
      )[0];
      directionList.push(item);
    }
    let action = false;
    for (let direction of directionList) {
      let [dx, dy] = vector[direction];
      let tx = x + dx;
      let ty = y + dy;
      if (map[ty][tx].checkkk) {
        continue;
      }
      map[ty][tx].checkkk = true;
      digTarget.push([tx, ty]);
      action = true;
      switch (direction) {
        case "up":
          map[y][x].wall.up = false;
          map[ty][tx].wall.down = false;
          break;
        case "down":
          map[y][x].wall.down = false;
          map[ty][tx].wall.up = false;
          break;
        case "left":
          map[y][x].wall.left = false;
          map[ty][tx].wall.right = false;
          break;
        case "right":
          map[y][x].wall.right = false;
          map[ty][tx].wall.left = false;
          break;
        default:
          break;
      }
      break;
    }
    if (action) {
      showMap();
      await new Promise((r) => setTimeout(r, 1));
      digTarget.unshift([x, y]);
    }
  }
};

let currentX = 1;
let currentY = 1;
let move = (direction) => {
  if (gameover) {
    return;
  }
  let cell = map[currentY][currentX];
  if (cell.wall[direction]) {
    return;
  }
  let [dx, dy] = vector[direction];
  currentX += dx;
  currentY += dy;
  update();

  if (currentX === width && currentY === height) {
    gameover = true;
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
      div.style.left = `${(x-1) * size}px`;
      div.style.top = `${(y-1) * size}px`;
      div.style.backgroundColor = "#fff";
      div.style.border = "1px solid #f0f";
      div.style.boxSizing = "border-box";
      map[y][x].element = div;
    }
  }
  document.ondblclick = (e) => {
    e.preventDefault();
  };
  document.querySelector("#left").onpointerdown = (e) => {
    e.preventDefault();
    move("left");
  };
  document.querySelector("#up").onpointerdown = (e) => {
    e.preventDefault();
    move("up");
  };
  document.querySelector("#down").onpointerdown = (e) => {
    e.preventDefault();
    move("down");
  };
  document.querySelector("#right").onpointerdown = (e) => {
    e.preventDefault();
    move("right");
  };
};

window.onload = async () => {
  gameover = true;
  init();
  await dig();
  showMap();
  update();

  gameover = false;
  let startTime = Date.now();
  let tick = () => {
    if (gameover) {
      return;
    }
    let time = Date.now() - startTime;
    document.querySelector("#timer").textContent = (time / 1000).toFixed(2);
    requestAnimationFrame(tick);
  };
  tick();
};
// };
