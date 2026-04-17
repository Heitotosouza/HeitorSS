// ------------------------------------------------------------
// --- PARTÍCULAS NO CANVAS ---
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
const canvas = document.getElementById('particles');
if (!canvas) return; // se não existir canvas, não executa
const ctx = canvas.getContext('2d');

// Define o tamanho do canvas igual ao da janela
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Atualiza o tamanho do canvas ao redimensionar a janela
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Guarda a posição do mouse para o efeito de repulsão
let mouse = { x: null, y: null };
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Classe que define o comportamento de cada partícula
class Particle {
    constructor() {
        this.x = Math.random() * width;    // posição inicial X
        this.y = Math.random() * height;   // posição inicial Y
        this.size = Math.random() * 3 + 1; // tamanho aleatório (1–4px)
        this.speedX = Math.random() * 1 - 0.5; // velocidade horizontal
        this.speedY = Math.random() * 1 - 0.5; // velocidade vertical
        this.color = '#00ffc8'; // cor padrão das partículas
    }

    // Atualiza a posição e interações
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Faz as partículas "quicarem" nas bordas do canvas
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;

        // Efeito de repulsão do mouse
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) { // interage até 100px de distância do mouse
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }
    }

    // Desenha a partícula na tela
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Cria um conjunto de partículas (menos em telas pequenas)
const particlesArray = [];
const numParticles = window.innerWidth < 600 ? 80 : 150;
for (let i = 0; i < numParticles; i++) {
    particlesArray.push(new Particle());
}

// Liga as partículas próximas com linhas
function connect(p) {
    for (let a = 0; a < particlesArray.length; a++) {
        const dx = particlesArray[a].x - p.x;
        const dy = particlesArray[a].y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { // conecta partículas próximas
            ctx.strokeStyle = 'rgba(0,255,200,' + (1 - dist / 120) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }
    }
}

// Loop de animação
function animate() {
    ctx.clearRect(0, 0, width, height); // limpa o canvas
    particlesArray.forEach(p => {
        p.update(); // atualiza posição
        p.draw();   // desenha a partícula
        if (mouse.x !== null && mouse.y !== null) connect(p); // conecta partículas
    });
    requestAnimationFrame(animate); // repete infinitamente a animação
}

animate(); // inicia a animação
});