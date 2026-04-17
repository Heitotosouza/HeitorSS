// Espera todo o conteúdo do DOM ser carregado antes de executar o código
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const navList = document.getElementById("nav-list");

  toggle.addEventListener("click", function () {
    navList.classList.toggle("active");
    toggle.classList.toggle("open"); // adiciona ou remove a classe "open" para animar o ícone
  });
});