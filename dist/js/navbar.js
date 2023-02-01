const menu = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

menu.addEventListener("click", (e) => {
  menu.classList.toggle("bx-x");
  navbar.classList.toggle("open");
});
