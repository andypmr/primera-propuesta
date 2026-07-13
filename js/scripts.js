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
  const detailDots = document.querySelectorAll(".detail-dots button");

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
      detailDots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });
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
    detailDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        detailCards[index]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      });
    });
    detailSlider.addEventListener("scroll", updateDetailControls, { passive: true });
    window.addEventListener("resize", updateDetailControls);
    updateDetailControls();
  }

  const testimonialTrack = document.querySelector(".testimonial-track");
  const testimonialDots = document.querySelectorAll(".testimonial-dots button");

  if (testimonialTrack && testimonialDots.length) {
    const testimonialCards = [...testimonialTrack.querySelectorAll(".testimonial-card")];

    const getCenteredTestimonialIndex = () => {
      const trackCenter = testimonialTrack.scrollLeft + testimonialTrack.clientWidth / 2;
      return testimonialCards.reduce((closestIndex, card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const closestCard = testimonialCards[closestIndex];
        const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;
        return Math.abs(cardCenter - trackCenter) < Math.abs(closestCenter - trackCenter)
          ? index
          : closestIndex;
      }, 0);
    };

    const updateTestimonialDots = () => {
      const maxScroll = Math.max(1, testimonialTrack.scrollWidth - testimonialTrack.clientWidth);
      const activePage = Math.round((testimonialTrack.scrollLeft / maxScroll) * (testimonialDots.length - 1));
      const centeredIndex = getCenteredTestimonialIndex();
      testimonialDots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activePage);
      });
      testimonialCards.forEach((card, index) => {
        card.classList.toggle("is-centered", index === centeredIndex);
      });
    };

    testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const maxScroll = testimonialTrack.scrollWidth - testimonialTrack.clientWidth;
        const targetLeft = maxScroll * (index / Math.max(1, testimonialDots.length - 1));
        testimonialTrack.scrollTo({ left: targetLeft, behavior: "smooth" });
      });
    });

    testimonialTrack.addEventListener("scroll", updateTestimonialDots, { passive: true });
    window.addEventListener("resize", updateTestimonialDots);
    updateTestimonialDots();
  }

  const colorBikeTrack = document.querySelector(".color-bike-grid");
  const colorBikeDots = document.querySelectorAll(".color-bike-dots button");

  if (colorBikeTrack && colorBikeDots.length) {
    const colorBikeCards = [...colorBikeTrack.querySelectorAll(".color-bike-card")];

    const getActiveColorBikeIndex = () => {
      const trackCenter = colorBikeTrack.scrollLeft + colorBikeTrack.clientWidth / 2;
      return colorBikeCards.reduce((closestIndex, card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const closestCard = colorBikeCards[closestIndex];
        const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;
        return Math.abs(cardCenter - trackCenter) < Math.abs(closestCenter - trackCenter)
          ? index
          : closestIndex;
      }, 0);
    };

    const updateColorBikeDots = () => {
      const activeIndex = getActiveColorBikeIndex();
      colorBikeDots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });
    };

    colorBikeDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        colorBikeCards[index]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      });
    });

    colorBikeTrack.addEventListener("scroll", updateColorBikeDots, { passive: true });
    window.addEventListener("resize", updateColorBikeDots);
    updateColorBikeDots();
  }

  const storySection = document.querySelector(".split-section");
  const storyText = storySection?.querySelector(".split-copy h2");

  if (storySection && storyText) {
    storyText.classList.add("scroll-reveal-text");
    const storyWords = storyText.textContent
      .trim()
      .split(/\s+/)
      .map((word) => {
        const span = document.createElement("span");
        span.className = "reveal-word";
        span.textContent = word;
        return span;
      });

    storyText.textContent = "";
    storyWords.forEach((word, index) => {
      storyText.appendChild(word);
      if (index < storyWords.length - 1) {
        storyText.appendChild(document.createTextNode(" "));
      }
    });

    const updateStoryReveal = () => {
      const bounds = storySection.getBoundingClientRect();
      const start = window.innerHeight * 0.86;
      const end = window.innerHeight * 0.5;
      const progress = Math.min(1, Math.max(0, (start - bounds.top) / (start - end)));
      storyText.style.setProperty("--text-reveal", `${(progress * 100).toFixed(2)}%`);
      const visibleWords = Math.round(progress * storyWords.length);
      storyWords.forEach((word, index) => {
        word.classList.toggle("is-visible", index < visibleWords);
      });
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
