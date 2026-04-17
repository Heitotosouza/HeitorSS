document.addEventListener("DOMContentLoaded", function () {
    const hamburguer = document.querySelector(".hamburguer");
    const nav = document.querySelector(".nav");
    if (hamburguer && nav) {
        hamburguer.addEventListener("click", () => nav.classList.toggle("active"));
    }

    const logo = document.querySelector('.logo');
    if (logo) {
        const text = "HeitorSS";
        logo.textContent = '';
        let i = 0;
        let forward = true;
        function typeWriter() {
            if (forward) {
                logo.textContent = text.substring(0, i + 1);
                i++;
                if (i === text.length) { forward = false; setTimeout(typeWriter, 2000); return; }
            } else {
                logo.textContent = text.substring(0, i - 1);
                i--;
                if (i === 0) { forward = true; setTimeout(typeWriter, 500); return; }
            }
            setTimeout(typeWriter, 150);
        }
        typeWriter();
    }

    const cardsLuz = document.querySelectorAll('.projeto-card');

    cardsLuz.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
    });