import { update, draw } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function gameLoop() {
  update();
  draw(ctx);
  requestAnimationFrame(gameLoop);
}

gameLoop();
