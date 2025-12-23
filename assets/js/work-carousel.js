// assets/js/work-carousel.js
document.addEventListener("DOMContentLoaded", () => {
  // ===== LIGHTBOX (ZOOM OVERLAY) SETUP =====
  const lightbox = document.getElementById("workLightbox");
  const lightboxImg = lightbox?.querySelector(".work__lightbox-img");
  const closeBtn = lightbox?.querySelector(".work__lightbox-close");

  function openLightbox(src, alt = "Preview") {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("active");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ===== CAROUSEL LOGIC =====
  const carousels = document.querySelectorAll(".work__carousel[data-images]");

  carousels.forEach((carousel) => {
    let images = [];

    // 1) Read + parse data-images safely
    const raw = carousel.getAttribute("data-images") || "[]";
    try {
      images = JSON.parse(raw);
    } catch (e) {
      console.error("Invalid data-images JSON:", raw, e);
      return;
    }

    if (!Array.isArray(images) || images.length === 0) {
      console.warn("No images found in data-images:", raw);
      return;
    }

    // 2) Get elements
    const imgEl = carousel.querySelector(".work__carousel-img");
    const prevBtn = carousel.querySelector(".work__carousel-prev");
    const nextBtn = carousel.querySelector(".work__carousel-next");
    const dotsWrap = carousel.querySelector(".work__carousel-dots");

    // If any is missing, stop for this carousel
    if (!imgEl || !prevBtn || !nextBtn || !dotsWrap) {
      console.error("Carousel missing required elements:", {
        hasImg: !!imgEl,
        hasPrev: !!prevBtn,
        hasNext: !!nextBtn,
        hasDots: !!dotsWrap,
      });
      return;
    }

    // Make image clickable for zoom
    imgEl.style.cursor = "zoom-in";
    imgEl.addEventListener("click", () => {
      openLightbox(imgEl.src, imgEl.alt || "Preview");
    });

    // 3) State
    let index = 0;

    // 4) Build dots
    dotsWrap.innerHTML = "";
    images.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "work__dot" + (i === 0 ? " active" : "");
      dot.dataset.index = String(i);
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll(".work__dot");

    // 5) Helpers
    function setActiveDot() {
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    }

    function updateButtons() {
      const disabled = images.length <= 1;
      prevBtn.disabled = disabled;
      nextBtn.disabled = disabled;
      prevBtn.style.opacity = disabled ? "0.5" : "1";
      nextBtn.style.opacity = disabled ? "0.5" : "1";
      prevBtn.style.pointerEvents = disabled ? "none" : "auto";
      nextBtn.style.pointerEvents = disabled ? "none" : "auto";
    }

    // If an image path is wrong, log it and skip to the next image
    function loadImage(src, retryCount = 0) {
      imgEl.onerror = () => {
        console.log("❌ Missing image:", src);
        if (retryCount >= images.length) return;

        index = (index + 1) % images.length;
        setActiveDot();
        loadImage(images[index], retryCount + 1);
      };

      imgEl.onload = () => {};
      imgEl.src = src;

      // If lightbox is open, keep it in sync with current slide
      if (lightbox && lightbox.classList.contains("active") && lightboxImg) {
        lightboxImg.src = src;
      }
    }

    function updateCarousel() {
      index = (index + images.length) % images.length;
      setActiveDot();
      updateButtons();
      loadImage(images[index], 0);
    }

    // 6) Events
    prevBtn.addEventListener("click", () => {
      index = (index - 1 + images.length) % images.length;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % images.length;
      updateCarousel();
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        index = Number(dot.dataset.index);
        updateCarousel();
      });
    });

    // Swipe support
    let startX = 0;
    carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) {
        index =
          diff > 0
            ? (index - 1 + images.length) % images.length
            : (index + 1) % images.length;
        updateCarousel();
      }
    });

    // 7) Init
    updateCarousel();
  });
});
