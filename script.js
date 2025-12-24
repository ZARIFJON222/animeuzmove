const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = { x: null, y: null, targetX: null, targetY: null };
const numParticles = 65;
const maxDistance = 180;
const particles = [];

// Ekranni 8 katakka bo'lish: 2 satr × 4 ustun
const rows = 2;
const cols = 4;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

// Nuqtalarni kataklarda yaratish
for (let i = 0; i < numParticles; i++) {
  const col = Math.floor(Math.random() * cols);
  const row = Math.floor(Math.random() * rows);

  particles.push({
    x: Math.random() * cellWidth + col * cellWidth,
    y: Math.random() * cellHeight + row * cellHeight,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: 2,
    col,
    row,
  });
}

// Mouse pozitsiyasi
canvas.addEventListener("mousemove", (e) => {
  mouse.targetX = e.clientX;
  mouse.targetY = e.clientY;
});
canvas.addEventListener("mouseleave", () => {
  mouse.targetX = null;
  mouse.targetY = null;
});

// Mouse pozitsiyasini sekin yangilash (kechikish effekti)
function updateMousePosition() {
  if (mouse.targetX !== null && mouse.targetY !== null) {
    // Lerp bilan sekin yangilash
    if (mouse.x === null) mouse.x = mouse.targetX;
    else mouse.x += (mouse.targetX - mouse.x) * 0.1;

    if (mouse.y === null) mouse.y = mouse.targetY;
    else mouse.y += (mouse.targetY - mouse.y) * 0.1;
  } else {
    mouse.x = null;
    mouse.y = null;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Nuqtalarni chizish va harakatlantirish (katak ichida)
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    const minX = p.col * cellWidth;
    const maxX = (p.col + 1) * cellWidth;
    const minY = p.row * cellHeight;
    const maxY = (p.row + 1) * cellHeight;

    if (p.x < minX || p.x > maxX) p.vx *= -1;
    if (p.y < minY || p.y > maxY) p.vy *= -1;

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Nuqtalar orasidagi chiziqlar (oq)
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDistance) {
        const alpha = 1 - (dist / maxDistance) * 0.5;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Mouse chiziqlari (ko‘k, kechikkan)
  if (mouse.x !== null && mouse.y !== null) {
    particles.forEach((p) => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDistance) {
        const alpha = 1 - (dist / maxDistance) * 0.3;
        ctx.strokeStyle = `rgba(0,150,255,${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    });
  }

  updateMousePosition();
  requestAnimationFrame(draw);
}

draw();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
