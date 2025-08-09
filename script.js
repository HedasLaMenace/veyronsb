// Terminal typing code + looping

const codeLines = [
  "console.log('Initialisation de VeyronSB...');",
  "import APP from './modules/script.js';",
  "",
  "const app = new APP ({",
  "    mode: 'auto',",
  "    optimize: true,",
  "    debug: false",
  "});",
  "",
  "app.start();",
  "console.log('Le VeyronSB est prêt 🚀');",
  "",
  "// Intégration bot Discord",
  "bot.on('message', message => {",
  "  if(message.content === '!help') {",
  "    message.channel.send('Voici les commandes disponibles...');",
  "  }",
  "});",
  "",
  "// Reste connecté au serveur",
  "bot.login(process.env.TOKEN);"
];

const codeElement = document.getElementById('code');
let lineIndex = 0;
let charIndex = 0;

function typeCode() {
  if (lineIndex < codeLines.length) {
    if (charIndex < codeLines[lineIndex].length) {
      codeElement.textContent += codeLines[lineIndex][charIndex];
      charIndex++;
      setTimeout(typeCode, 40);
    } else {
      // Fin de la ligne, saut de ligne, ligne suivante
      codeElement.textContent += '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(typeCode, 300);
    }
  } else {
    // Fin tableau, ajoute marqueur puis recommence à écrire sans effacer
    codeElement.textContent += '\n// --- Nouveau cycle ---\n\n';
    lineIndex = 0;
    charIndex = 0;
    setTimeout(typeCode, 800);
  }
}

typeCode();


// Canvas background animation

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const PARTICLE_COUNT = 120;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = randomRange(0, width);
    this.y = randomRange(0, height);
    this.vx = randomRange(-0.3, 0.3);
    this.vy = randomRange(-0.3, 0.3);
    this.size = randomRange(1, 3);
    this.alpha = randomRange(0.1, 0.4);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(88, 166, 255, ${this.alpha})`;
    ctx.shadowColor = 'rgba(88, 166, 255, 0.6)';
    ctx.shadowBlur = 8;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  resize();
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
  animate();
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(88, 166, 255, ${1 - dist / 120})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(88, 166, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
});

init();
