(() => {
  const carousel = document.querySelector(".service-carousel");
  if (!carousel) return;
  const track = carousel.querySelector(".carousel-track");
  const slides = [...track.querySelectorAll(".service-slide")];
  const dots = [...carousel.querySelectorAll("[data-slide]")];
  const toggle = carousel.querySelector(".carousel-toggle");
  const status = carousel.querySelector(".carousel-status");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let playing = !motion.matches;
  let active = 0;
  let visible = false;
  let timer;
  let settle;

  function update() {
    active = slides.reduce(
      (best, slide, index) =>
        Math.abs(slide.offsetLeft - slides[0].offsetLeft - track.scrollLeft) <
        Math.abs(
          slides[best].offsetLeft - slides[0].offsetLeft - track.scrollLeft,
        )
          ? index
          : best,
      0,
    );
    dots.forEach((dot, i) => {
      if (i === active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    carousel.querySelector(".carousel-counter").textContent =
      `0${active + 1} / 03`;
    // Keep off-screen controls out of keyboard navigation; all slides remain usable without JS.
    slides.forEach((slide, i) => {
      slide.inert = i !== active;
      if (i !== active) {
        slide.querySelectorAll("details[open]").forEach((details) => {
          details.open = false;
        });
      }
    });
  }

  function startTimer() {
    clearInterval(timer);
    if (!playing) return;
    timer = setInterval(() => {
      if (
        !visible ||
        document.hidden ||
        carousel.matches(":hover") ||
        carousel.contains(document.activeElement) ||
        carousel.querySelector("details[open]")
      )
        return;
      go(active + 1, false);
    }, 6500);
  }

  function setPlaying(value) {
    playing = value;
    toggle.textContent = playing ? "Pausar Ⅱ" : "Reproduzir ▷";
    toggle.setAttribute(
      "aria-label",
      playing ? "Pausar troca automática" : "Iniciar troca automática",
    );
    startTimer();
  }

  function go(index, manual = true) {
    const next = (index + slides.length) % slides.length;
    if (manual) {
      setPlaying(false);
      status.textContent = slides[next].getAttribute("aria-label");
    }
    // Absolute positioning within the scroll container never moves the surrounding page.
    track.scrollTo({
      left: slides[next].offsetLeft - slides[0].offsetLeft,
      behavior: motion.matches ? "instant" : "smooth",
    });
  }

  carousel
    .querySelector(".carousel-prev")
    .addEventListener("click", () => go(active - 1));
  carousel
    .querySelector(".carousel-next")
    .addEventListener("click", () => go(active + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => go(i)));
  toggle.addEventListener("click", () => setPlaying(!playing));
  track.addEventListener("pointerdown", () => setPlaying(false), {
    passive: true,
  });
  track.addEventListener("keydown", (event) => {
    if (
      event.target !== track ||
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
    )
      return;
    event.preventDefault();
    go(
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? slides.length - 1
          : active + (event.key === "ArrowRight" ? 1 : -1),
    );
  });
  track.addEventListener(
    "scroll",
    () => {
      clearTimeout(settle);
      settle = setTimeout(update, 120);
    },
    { passive: true },
  );
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0.4 },
  ).observe(carousel);
  motion.addEventListener("change", () => {
    if (motion.matches) setPlaying(false);
  });
  new ResizeObserver(update).observe(track);
  carousel.querySelector(".carousel-controls").hidden = false;
  update();
  setPlaying(playing);
})();
