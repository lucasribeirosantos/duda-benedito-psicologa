/* ============================================================
   Maria Eduarda Benedito · Psicóloga — interações
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));

  /* ---------- LOADER: a andorinha cruza e revela ---------- */
  (function loader() {
    const loader = $("#loader");
    if (!loader) return;
    const bird = $("#loaderBird");
    const dots = $("#loaderDots");
    const flight = $("#loaderFlight");
    document.body.classList.add("is-locked");
    /* a intro sempre começa no topo, no hero */
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let finished = false;
    function done() {
      if (finished) return;
      finished = true;
      loader.classList.add("is-done");
      document.body.classList.remove("is-locked");
      /* conteúdo entra durante o fade do loader (cross-fade, sem corte) */
      document.dispatchEvent(new Event("reveal:start"));
      setTimeout(() => { loader.style.display = "none"; }, 900);
    }

    if (reduce) { done(); return; }

    /* solta pontinhos no rastro do passarinho */
    let last = 0;
    function trail(t) {
      if (finished) return;
      if (t - last > 85 && bird && flight) {
        last = t;
        const b = bird.getBoundingClientRect();
        const f = flight.getBoundingClientRect();
        const x = b.left + b.width * 0.34 - f.left;   /* perto da cauda */
        const y = b.top + b.height * 0.62 - f.top;
        if (x > 4 && x < f.width - 4) {
          const i = document.createElement("i");
          i.style.left = x + "px";
          i.style.top = y + "px";
          dots.appendChild(i);
          setTimeout(() => i.remove(), 1400);
        }
      }
      requestAnimationFrame(trail);
    }
    requestAnimationFrame(trail);

    bird && bird.addEventListener("animationend", (e) => {
      if (e.animationName === "loaderFly") done();
    });
    /* trava de segurança */
    setTimeout(done, 4200);
    window.addEventListener("load", () => setTimeout(() => { if (!finished) done(); }, 2600));
  })();

  /* ---------- NAV: fixo + menu mobile ---------- */
  (function nav() {
    const nav = $("#nav");
    const burger = $("#burger");
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    burger && burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    $$("#nav .nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger && burger.setAttribute("aria-expanded", "false");
      })
    );
  })();

  /* ---------- REVEAL no scroll ---------- */
  (function reveal() {
    const items = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    /* o hero entra encenado só quando o loader sai; o resto via observer */
    const heroItems = $$(".hero .reveal");
    items.filter((el) => heroItems.indexOf(el) === -1).forEach((el) => io.observe(el));
    document.addEventListener("reveal:start", () => {
      heroItems.forEach((el, i) => setTimeout(() => el.classList.add("in"), 110 * i));
    });
  })();

  /* ---------- PARALLAX das nuvens + bird do hero ---------- */
  (function parallax() {
    if (reduce) return;
    const clouds = $$("[data-parallax]");
    let ticking = false;
    function run() {
      const vh = window.innerHeight;
      clouds.forEach((el) => {
        const r = el.getBoundingClientRect();
        const off = r.top + r.height / 2 - vh / 2;
        const f = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        el.style.transform = "translate3d(0," + (-off * f).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(run); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", run);
    run();
  })();

  /* ---------- FLIGHTPATH: a andorinha serpenteia entre as seções (assinatura) ---------- */
  (function flight() {
    if (reduce) return;
    const svg = $("#flightpath");
    if (!svg) return;
    const base = $("#routeBase"), lit = $("#routeLit"), bird = $("#routeBird");
    let L = 0, samples = [], lastIdx = 0, targetLen = 0, curLen = 0, running = false, docH = 1, isMobile = false;

    /* curva suave (Catmull-Rom -> Bézier) passando pelos pontos */
    function smooth(p) {
      if (p.length < 2) return "";
      let d = "M " + p[0].x.toFixed(1) + " " + p[0].y.toFixed(1);
      for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
        const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
        d += " C " + c1x.toFixed(1) + " " + c1y.toFixed(1) + ", " +
          c2x.toFixed(1) + " " + c2y.toFixed(1) + ", " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
      }
      return d;
    }

    function build() {
      svg.style.height = "0px";                       /* colapsa antes de medir (evita auto-realimentação) */
      const W = document.documentElement.clientWidth;
      const foot = document.querySelector(".foot");
      const H = Math.ceil((foot ? foot.getBoundingClientRect().bottom + window.scrollY
                                : document.documentElement.scrollHeight));
      svg.style.width = W + "px";
      svg.style.height = H + "px";
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      docH = H;

      isMobile = W < 760;
      const lx = W * (isMobile ? 0.24 : 0.17);   /* margem esquerda */
      const rx = W * (isMobile ? 0.76 : 0.83);   /* margem direita  */
      const cx = W * 0.5;

      /* ancora a rota nas seções, alternando os lados — o passarinho cruza nos vãos */
      const secs = $$("main > section");
      const pts = [{ x: cx, y: -40 }];
      secs.forEach((s, i) => pts.push({ x: i % 2 === 0 ? rx : lx, y: s.offsetTop + s.offsetHeight * 0.5 }));
      pts.push({ x: cx, y: H + 40 });

      const d = smooth(pts);
      base.setAttribute("d", d);
      lit.setAttribute("d", d);
      L = base.getTotalLength();
      lit.style.strokeDasharray = L;

      samples = [];
      const N = Math.max(160, Math.min(900, Math.round(H / 9)));
      for (let i = 0; i <= N; i++) {
        const len = L * i / N, p = base.getPointAtLength(len);
        samples.push({ len: len, x: p.x, y: p.y });
      }
      lastIdx = 0;
      measure();
      curLen = targetLen;          /* sem deslizar no carregamento */
      render();
    }

    /* alvo: ponto da rota na altura do meio da viewport */
    function measure() {
      if (!samples.length) return;
      const targetY = window.scrollY + window.innerHeight * 0.5;
      let idx = lastIdx;
      while (idx < samples.length - 1 && samples[idx].y < targetY) idx++;
      while (idx > 0 && samples[idx].y > targetY) idx--;
      lastIdx = idx;
      targetLen = samples[idx].len;
    }

    /* desenha a andorinha no comprimento atual da rota (sempre sobre o caminho) */
    function render() {
      const len = Math.max(0, Math.min(L, curLen));
      const pt = base.getPointAtLength(len);
      const pt2 = base.getPointAtLength(Math.min(L, len + 1.4));
      const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
      const bank = Math.max(-30, Math.min(30, (ang - 90) * 0.9));
      bird.setAttribute("x", (pt.x - 28).toFixed(1));
      bird.setAttribute("y", (pt.y - 29).toFixed(1));
      bird.setAttribute("transform", "rotate(" + bank.toFixed(1) + " " + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")");
      lit.style.strokeDashoffset = (L - len).toFixed(1);
      const vh = window.innerHeight;
      const fade = Math.max(0, Math.min(1, (window.scrollY - vh * 0.4) / (vh * 0.5)));
      /* no celular a andorinha passa atrás dos textos: bem translúcida para não atrapalhar a leitura */
      const maxOp = isMobile ? 0.3 : 0.92;
      bird.style.opacity = (maxOp * fade).toFixed(2);
    }

    /* easing contínuo: a andorinha plana suavemente até o alvo (independente da velocidade do scroll) */
    function animate() {
      curLen += (targetLen - curLen) * 0.1;
      /* limita o atraso para a andorinha nunca sair do viewport em scroll rápido/longo */
      const maxLag = L * (window.innerHeight * 0.42) / docH;
      if (curLen < targetLen - maxLag) curLen = targetLen - maxLag;
      if (curLen > targetLen + maxLag) curLen = targetLen + maxLag;
      render();
      if (Math.abs(targetLen - curLen) > 0.4) {
        requestAnimationFrame(animate);
      } else {
        curLen = targetLen; render(); running = false;
      }
    }
    function tick() { if (!running) { running = true; requestAnimationFrame(animate); } }
    function onScroll() { measure(); tick(); }

    build();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", () => setTimeout(build, 220));
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 160); });
  })();

  /* ---------- ano no rodapé (caso queira dinâmico) ---------- */
})();
