window.addEventListener("DOMContentLoaded", () => {
  const mainMenu = document.querySelector("#mainMenu");
  const heroNav = document.querySelector(".hero-nav");
  const hero = document.querySelector(".hero-section");
  const parallaxEnabled = window.matchMedia("(min-width: 681px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

  if (hero && parallaxEnabled.matches) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId = 0;

    const renderParallax = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      hero.style.setProperty("--hero-x", `${currentX.toFixed(2)}px`);
      hero.style.setProperty("--hero-y", `${currentY.toFixed(2)}px`);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frameId = window.requestAnimationFrame(renderParallax);
      } else {
        frameId = 0;
      }
    };

    const queueParallax = () => {
      if (!frameId) frameId = window.requestAnimationFrame(renderParallax);
    };

    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
      targetX = normalizedX * 22;
      targetY = normalizedY * 14;
      queueParallax();
    });

    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      queueParallax();
    });

    window.addEventListener("scroll", () => {
      const bounds = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(bounds.height, 1)));
      hero.style.setProperty("--hero-scroll", `${(progress * 18).toFixed(2)}px`);
    }, { passive: true });
  }

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    heroNav?.classList.toggle("nav-scrolled", currentScrollY > 24);
  }, { passive: true });

  heroNav?.classList.toggle("nav-scrolled", window.scrollY > 24);

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
  const bikeColorName = document.querySelector(".bike-color-name");
  const bikeButtons = document.querySelectorAll(".bike-switch");
  const bikeOptions = [
    { src: "assets/img/image 46.png", name: "Verde Eléctrico" },
    { src: "assets/img/IMG3-13.png", name: "Gris Piedra" },
    { src: "assets/img/IMG4-9.png", name: "Rosa Neón" },
  ];
  let bikeIndex = 0;

  const updateBike = (direction) => {
    if (!colorBike) return;
    bikeIndex = (bikeIndex + direction + bikeOptions.length) % bikeOptions.length;
    colorBike.style.opacity = "0";
    colorBike.style.transform = "scale(0.98)";

    window.setTimeout(() => {
      const bikeOption = bikeOptions[bikeIndex];
      colorBike.src = bikeOption.src;
      colorBike.alt = `Bicicleta Venzo ${bikeOption.name}`;
      if (bikeColorName) bikeColorName.textContent = bikeOption.name;
      colorBike.style.opacity = "1";
      colorBike.style.transform = "scale(1)";
    }, 140);
  };

  bikeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateBike(Number(button.dataset.bikeDirection || 1));
    });
  });

  const mobileTechDetail = document.querySelector(".mobile-tech-detail");
  const mobileTechTitle = mobileTechDetail?.querySelector("strong");
  const mobileTechCopy = mobileTechDetail?.querySelector("p");
  const componentHotspots = document.querySelectorAll(".component-hotspot");

  componentHotspots.forEach((hotspot) => {
    hotspot.addEventListener("click", () => {
      if (!window.matchMedia("(max-width: 680px)").matches || !mobileTechDetail) return;

      const sourceTitle = hotspot.querySelector(".callout-copy strong");
      const sourceCopy = hotspot.querySelector(".callout-copy small");

      componentHotspots.forEach((item) => item.classList.remove("is-selected"));
      hotspot.classList.add("is-selected");

      if (mobileTechTitle) mobileTechTitle.textContent = sourceTitle?.textContent || "";
      if (mobileTechCopy) mobileTechCopy.textContent = sourceCopy?.textContent || "";
      mobileTechDetail.classList.add("has-selection");
    });
  });

  const detailSlider = document.querySelector(".detail-grid");
  const detailPrev = document.querySelector(".detail-slider-prev");
  const detailNext = document.querySelector(".detail-slider-next");

  if (detailSlider && detailPrev && detailNext) {
    const detailCards = [...detailSlider.querySelectorAll(".detail-card")];

    const getActiveDetailIndex = () => {
      const sliderCenter = detailSlider.scrollLeft + detailSlider.clientWidth / 2;
      return detailCards.reduce((closestIndex, card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const closestCard = detailCards[closestIndex];
        const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;
        return Math.abs(cardCenter - sliderCenter) < Math.abs(closestCenter - sliderCenter)
          ? index
          : closestIndex;
      }, 0);
    };

    const updateDetailControls = () => {
      const activeIndex = getActiveDetailIndex();
      detailPrev.disabled = activeIndex === 0;
      detailNext.disabled = activeIndex === detailCards.length - 1;
    };

    const moveDetailSlider = (direction) => {
      const nextIndex = Math.min(
        detailCards.length - 1,
        Math.max(0, getActiveDetailIndex() + direction)
      );
      detailCards[nextIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    };

    detailPrev.addEventListener("click", () => moveDetailSlider(-1));
    detailNext.addEventListener("click", () => moveDetailSlider(1));
    detailSlider.addEventListener("scroll", updateDetailControls, { passive: true });
    window.addEventListener("resize", updateDetailControls);
    updateDetailControls();
  }

  const storySection = document.querySelector(".split-section");
  const storyText = storySection?.querySelector(".split-copy h2");

  if (storySection && storyText) {
    storyText.classList.add("scroll-reveal-text");

    const updateStoryReveal = () => {
      const bounds = storySection.getBoundingClientRect();
      const start = window.innerHeight * 0.86;
      const end = window.innerHeight * 0.18;
      const progress = Math.min(1, Math.max(0, (start - bounds.top) / (start - end)));
      storyText.style.setProperty("--text-reveal", `${(progress * 100).toFixed(2)}%`);
    };

    updateStoryReveal();
    window.addEventListener("scroll", updateStoryReveal, { passive: true });
    window.addEventListener("resize", updateStoryReveal);
  }

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
