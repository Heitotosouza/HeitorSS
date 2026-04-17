// Executa o código somente depois que o DOM estiver totalmente carregado
document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------------------------
    // --- MENU HAMBÚRGUER (para mobile) ---
    // ------------------------------------------------------------
    const hamburguer = document.querySelector(".hamburguer"); // botão de menu mobile
    const nav = document.querySelector(".nav");               // barra de navegação principal

    // Ao clicar no botão hamburguer, abre/fecha o menu
    hamburguer.addEventListener("click", () => {
        nav.classList.toggle("active"); // alterna a classe 'active' no menu
    });

    // ------------------------------------------------------------
    // --- DROPDOWNS (submenus) ---
    // ------------------------------------------------------------
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector("a"); // pega o <a> principal do dropdown

        link.addEventListener("click", e => {
            // Só abre/fecha no mobile (largura <= 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault(); // evita que o link carregue outra página
                dropdown.classList.toggle("active"); // abre/fecha o submenu
            }
        });
    });

    // ------------------------------------------------------------
    // --- PARTÍCULAS NO CANVAS ---
    // ------------------------------------------------------------
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

// ------------------------------------------------------------
// --- EFEITO MÁQUINA DE ESCREVER NA LOGO ---
// ------------------------------------------------------------
const logo = document.querySelector('.logo'); // pega o elemento da logo
const text = logo.textContent; // texto original
logo.textContent = ''; // limpa o conteúdo para começar a "digitar"

let i = 0;
let forward = true; // controla se está digitando ou apagando

function typeWriterLoop() {
    if (forward) {
        // Digitando
        logo.textContent = text.substring(0, i + 1);
        i++;
        if (i === text.length) {
            forward = false; // começa a apagar
            setTimeout(typeWriterLoop, 1000); // pausa antes de apagar
            return;
        }
    } else {
        // Apagando
        logo.textContent = text.substring(0, i - 1);
        i--;
        if (i === 0) {
            forward = true; // volta a digitar
            setTimeout(typeWriterLoop, 500); // pausa antes de digitar
            return;
        }
    }
    setTimeout(typeWriterLoop, 150); // velocidade do efeito
}

// Inicia o efeito quando a página terminar de carregar
window.addEventListener('DOMContentLoaded', typeWriterLoop);
