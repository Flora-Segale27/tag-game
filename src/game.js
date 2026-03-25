let x = 100;
let y = 100;
let speed = 3;

export function update() {
  x += speed;
  if (x > 750 || x < 0) speed *= -1;
}

export function draw(ctx) {
  ctx.clearRect(0, 0, 800, 600);
  ctx.fillStyle = "hotpink";
  ctx.fillRect(x, y, 50, 50);
}
