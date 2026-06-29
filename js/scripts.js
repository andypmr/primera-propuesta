window.addEventListener("DOMContentLoaded", () => {
  const mainMenu = document.querySelector("#mainMenu");
  const heroNav = document.querySelector(".hero-nav");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const menuIsOpen = mainMenu?.classList.contains("show") || mainMenu?.classList.contains("collapsing");

    if (currentScrollY <= 80 || currentScrollY < lastScrollY) {
      heroNav?.classList.remove("nav-hidden");
    } else if (currentScrollY > lastScrollY && !menuIsOpen) {
      heroNav?.classList.add("nav-hidden");
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (mainMenu?.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(mainMenu).hide();
      }
    });
  });

  const colorBike = document.querySelector("#colorBike");
  const bikeButtons = document.querySelectorAll(".bike-switch");
  const bikeOptions = [
    "assets/img/image 46.png",
    "assets/img/IMG3-13.png",
    "assets/img/IMG4-9.png",
  ];
  let bikeIndex = 0;

  const updateBike = (direction) => {
    if (!colorBike) return;
    bikeIndex = (bikeIndex + direction + bikeOptions.length) % bikeOptions.length;
    colorBike.style.opacity = "0";
    colorBike.style.transform = "scale(0.98)";

    window.setTimeout(() => {
      colorBike.src = bikeOptions[bikeIndex];
      colorBike.alt = `Bicicleta Venzo alternativa ${bikeIndex + 1}`;
      colorBike.style.opacity = "1";
      colorBike.style.transform = "scale(1)";
    }, 140);
  };

  bikeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateBike(Number(button.dataset.bikeDirection || 1));
    });
  });

  const techButtons = document.querySelectorAll("[data-tech-target]");
  const techInfos = document.querySelectorAll("[data-tech-info]");

  techButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.techTarget;
      const isAlreadyActive = button.classList.contains("active");

      techButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-expanded", "false");
      });
      techInfos.forEach((item) => item.classList.remove("active"));

      if (isAlreadyActive) return;

      button.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      document.querySelector(`[data-tech-info="${target}"]`)?.classList.add("active");
    });
  });

  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-arrow");
    const setOpen = (open) => {
      item.classList.toggle("is-open", open);
      button?.setAttribute("aria-expanded", String(open));
    };

    button?.addEventListener("mouseenter", () => setOpen(true));
    button?.addEventListener("focus", () => setOpen(true));
    button?.addEventListener("click", () => setOpen(!item.classList.contains("is-open")));
    item.addEventListener("mouseleave", () => setOpen(false));
    item.addEventListener("focusout", (event) => {
      if (!item.contains(event.relatedTarget)) setOpen(false);
    });
  });

});
