const width = 15;
const height = 15;
const size = 20;

let gameover = false;

const map = [];
for (let y = 0; y < height + 2; y++) {
  map[y] = [];
  for (let x = 0; x < width + 2; x++) {
    if (x === 0 || y === 0 || x === width + 1 || y === height + 1) {
      map[y][x] = {
        checked: true
      };
    } else {
      map[y][x] = {
        checked: false,
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
      const cell = map[y][x];
      cell.element.style.borderWidth =
        `${cell.wall.up ? borderWidth : 0} ` +
        `${cell.wall.right ? borderWidth : 0} ` +
        `${cell.wall.down ? borderWidth : 0} ` +
        `${cell.wall.left ? borderWidth : 0}`;
    }
  }
};

const update = () => {
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      const cell = map[y][x];
      if (x === currentX && y === currentY) {
        cell.element.style.backgroundColor = "#c88";
      } else if (x === width && y === height) {
        cell.element.style.backgroundColor = "#ff8";
      } else {
        cell.element.style.backgroundColor = "#8cc";
      }
    }
  }
};

const digTarget = [[1, 1]];
map[1][1].checked = true;
const dig = async () => {
  while (digTarget.length) {
    const [x, y] = digTarget.pop();
    if (x === width && y === height) {
      continue;
    }
    const baseDirection = ["up", "down", "left", "right"];
    const directionList = [];
    while (baseDirection.length) {
      const item = baseDirection.splice(
        Math.trunc(Math.random() * baseDirection.length),
        1
      )[0];
      directionList.push(item);
    }
    let action = false;
    for (const direction of directionList) {
      const [dx, dy] = vector[direction];
      const tx = x + dx;
      const ty = y + dy;
      if (map[ty][tx].checked) {
        continue;
      }
      map[ty][tx].checked = true;
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
const move = (direction) => {
  if (gameover) {
    return;
  }
  const cell = map[currentY][currentX];
  if (cell.wall[direction]) {
    return;
  }
  const [dx, dy] = vector[direction];
  currentX += dx;
  currentY += dy;
  update();

  if (currentX === width && currentY === height) {
    gameover = true;
  }
};

const init = () => {
  const container = document.getElementById("container");
  container.style.width = `${width * size}px`;
  container.style.height = `${height * size}px`;

  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      const div = document.createElement("div");
      container.appendChild(div);
      div.style.position = "absolute";
      div.style.width = `${size}px`;
      div.style.height = `${size}px`;
      div.style.left = `${(x - 1) * size}px`;
      div.style.top = `${(y - 1) * size}px`;
      div.style.backgroundColor = "#8cc";
      div.style.border = "1px solid #000";
      div.style.boxSizing = "border-box";
      map[y][x].element = div;
    }
  }
  document.ondblclick = (e) => {
    e.preventDefault();
  };
  document.getElementById("left").onpointerdown = (e) => {
    e.preventDefault();
    move("left");
  };
  document.getElementById("up").onpointerdown = (e) => {
    e.preventDefault();
    move("up");
  };
  document.getElementById("down").onpointerdown = (e) => {
    e.preventDefault();
    move("down");
  };
  document.getElementById("right").onpointerdown = (e) => {
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
  const startTime = Date.now();
  const tick = () => {
    if (gameover) {
      return;
    }
    const time = Date.now() - startTime;
    document.getElementById("timer").textContent = (time / 1000).toFixed(2);
    requestAnimationFrame(tick);
  };
  tick();
};

