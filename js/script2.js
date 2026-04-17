
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const navList = document.getElementById("nav-list");

  toggle.addEventListener("click", function () {
    navList.classList.toggle("active");
    toggle.classList.toggle("open");
  });
});