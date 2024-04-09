const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

class Body {
  constructor(x, y, mass, color) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.vx = 0;
    this.vy = 0;
    this.color = color;
    this.trail = []; // 新增軌跡
  }

  update(acceleration) {
    this.vx += acceleration.x;
    this.vy += acceleration.y;
    this.x += this.vx;
    this.y += this.vy;
    this.trail.push({x: this.x, y: this.y}); // 將新的位置添加到軌跡中
    if (this.trail.length > 100) { // 如果軌跡太長，移除最舊的位置
      this.trail.shift();
    }
  }

  draw() {
    ctx.beginPath();
    for (let i = 0; i < this.trail.length; i++) {
      ctx.arc(this.trail[i].x, this.trail[i].y, 1, 0, 2 * Math.PI);
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.sqrt(this.mass), 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const G = 100; // gravitational constant

const bodies = [
  new Body(400, 400, 200, "red"), // Body 1
  new Body(800, 400, 300, "green"), // Body 2
  new Body(600, 200, 400, "blue"), // Body 3
];

function calculateAcceleration(body) {
  let ax = 0;
  let ay = 0;
  const minDistance = 130; // 設定最小距離
  for (const otherBody of bodies) {
    if (otherBody !== body) {
      const dx = otherBody.x - body.x;
      const dy = otherBody.y - body.y;
      const distanceSquared = dx * dx + dy * dy;

      // 如果距離小於最小距離，則不計算引力
      if (distanceSquared < minDistance * minDistance) {
        continue;
      }

      const distance = Math.sqrt(distanceSquared);
      const force = (G * otherBody.mass) / distanceSquared;
      ax += force * (dx / distance);
      ay += force * (dy / distance);
    }
  }
  return { x: ax, y: ay };
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const body of bodies) {
    const acceleration = calculateAcceleration(body);
    body.update(acceleration);
    body.draw();
  }

  requestAnimationFrame(update);
}

update();
