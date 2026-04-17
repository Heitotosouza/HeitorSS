
document.addEventListener("DOMContentLoaded", function () {
const canvas = document.getElementById('particles');
if (!canvas) return;
const ctx = canvas.getContext('2d');


let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;


window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});


let mouse = { x: null, y: null };
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});


class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = '#00ffc8';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;


        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particlesArray = [];
const numParticles = window.innerWidth < 600 ? 80 : 150;
for (let i = 0; i < numParticles; i++) {
    particlesArray.push(new Particle());
}


function connect(p) {
    for (let a = 0; a < particlesArray.length; a++) {
        const dx = particlesArray[a].x - p.x;
        const dy = particlesArray[a].y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            ctx.strokeStyle = 'rgba(0,255,200,' + (1 - dist / 120) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }
    }
}


function animate() {
    ctx.clearRect(0, 0, width, height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
        if (mouse.x !== null && mouse.y !== null) connect(p);
    });
    requestAnimationFrame(animate);
}

animate();
});