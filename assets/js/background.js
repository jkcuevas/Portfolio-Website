// ===== Live IT Network Background (Canvas) =====
(() => {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;

  function resize() {
  const container = canvas.parentElement; // home section
  const rect = container.getBoundingClientRect();

  w = rect.width * 1.4;
  h = rect.height * 1.4;

  canvas.width = Math.floor(w * DPR);
  canvas.height = Math.floor(h * DPR);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const baseCount = () => {
    const area = w * h;
    if (area < 450000) return 40;        // phones
    if (area < 900000) return 60;        // small laptops
    return 85;                            // big screens
  };

  let nodes = [];
  function init() {
    const count = prefersReduced ? Math.floor(baseCount() / 2) : baseCount();
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: 1.1 + Math.random() * 1.6
    }));
  }

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function hslaFromCss(cssHsl, a) {
    // cssHsl example: "hsl(199, 89%, 48%)"
    const m = cssHsl.match(/hsl\(([^)]+)\)/i);
    if (!m) return `rgba(59,130,246,${a})`;
    return `hsla(${m[1]}, ${a})`;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // soft glow wash
    const c1 = cssVar("--first-color", "hsl(199, 89%, 48%)");
    const c2 = cssVar("--first-color-2", "hsl(221, 83%, 53%)");

    const g = ctx.createRadialGradient(w * 0.2, h * 0.2, 0, w * 0.2, h * 0.2, Math.max(w, h));
    g.addColorStop(0, hslaFromCss(c1, 0.10));
    g.addColorStop(0.55, hslaFromCss(c2, 0.06));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const linkDist = prefersReduced ? 110 : 140;

    // lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < linkDist) {
          const t = 1 - d / linkDist;
          ctx.strokeStyle = `rgba(37,99,235,${0.15 * t})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // dots
    for (const p of nodes) {
      ctx.fillStyle = "rgba(14,165,233,0.65)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function update() {
    for (const p of nodes) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;
    }
  }

  let raf = 0;
  function loop() {
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  resize();
  init();
  loop();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    resize();
    init();
    loop();
  });
})();
