window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".page-nav");
  const navCollapse = document.querySelector("#mainNav");
  const toggler = document.querySelector(".navbar-toggler");
  const navLinks = document.querySelectorAll("#mainNav .nav-link");

  const setNavState = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (toggler && window.getComputedStyle(toggler).display !== "none") {
        toggler.click();
      }
    });
  });

  if (navCollapse && nav) {
    navCollapse.addEventListener("show.bs.collapse", () => nav.classList.add("showing-menu"));
    navCollapse.addEventListener("hidden.bs.collapse", () => nav.classList.remove("showing-menu"));
  }
});
