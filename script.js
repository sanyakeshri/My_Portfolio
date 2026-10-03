// Vanilla JS for the interactive bits. No libraries or build step needed.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CAN_HOVER = matchMedia("(hover: hover)").matches;
const EMAIL = "keshrisanya621@gmail.com";
const root = document.documentElement;

/* Theme toggle */
const themeBtn = $("#themeBtn");
const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : !matchMedia("(prefers-color-scheme: light)").matches;
const paintBtn = () => (themeBtn.textContent = isDark() ? "Light" : "Dark");
themeBtn.onclick = () => { root.dataset.theme = isDark() ? "light" : "dark"; paintBtn(); };
paintBtn();

/* Typing role line */
(function typer() {
  const el = $("#typed"), words = ["Java developer", "Full-stack developer", "Spring Boot & React builder"];
  if (REDUCE) { el.textContent = words[0]; return; }
  let w = 0, i = 0, del = false;
  (function tick() {
    const word = words[w];
    i += del ? -1 : 1; el.textContent = word.slice(0, i);
    let d = del ? 35 : 75;
    if (!del && i === word.length) { del = true; d = 1700; }
    else if (del && i === 0) { del = false; w = (w + 1) % words.length; d = 300; }
    setTimeout(tick, d);
  })();
})();

/* Greeting + live Jabalpur clock */
(function hello() {
  const run = () => {
    const now = new Date();
    const hr = parseInt(now.toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }), 10) % 24;
    const g = hr < 5 ? "Hello, night owl" : hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : hr < 21 ? "Good evening" : "Good night";
    $("#greet").textContent = g + ", I'm";
    $("#clock").textContent = "Jabalpur " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" }) + " IST";
  };
  run(); setInterval(run, 1000);
})();

/* Tech marquee (list is doubled for a seamless loop) */
(function marquee() {
  const items = ["Java", "Spring Boot", "React.js", "MySQL", "Hibernate / JPA", "Spring Security", "REST APIs", "JavaScript", "Git & GitHub"];
  $("#mqt").innerHTML = [...items, ...items].map(t => `<span>${t}</span>`).join("");
})();

/* Scroll reveal */
const hasIO = "IntersectionObserver" in window;
$$(".rv").forEach(el => {
  if (REDUCE || !hasIO) return el.classList.add("in");
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.1 });
  io.observe(el);
});

/* Count-up stats */
$$(".stats b").forEach(el => {
  const to = parseFloat(el.dataset.to), dec = (el.dataset.to.split(".")[1] || "").length;
  if (REDUCE || !hasIO) return;
  el.textContent = (0).toFixed(dec);
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; io.disconnect();
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1400); el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, { threshold: 0.6 });
  io.observe(el);
});

/* Active nav link */
if (hasIO) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$(".links a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach(s => io.observe(s));
}

/* Scroll progress + back-to-top */
const onScroll = () => {
  const d = root;
  $("#prog").style.width = (100 * scrollY / Math.max(1, d.scrollHeight - innerHeight)) + "%";
  $("#totop").classList.toggle("show", scrollY > 600);
};
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* Project filter */
$$(".fbtn").forEach(b => b.onclick = () => {
  $$(".fbtn").forEach(x => x.classList.toggle("on", x === b));
  $$(".card[data-kind]").forEach(c => c.hidden = !(b.dataset.f === "All" || c.dataset.kind === b.dataset.f));
});

/* Mouse glow + 3D tilt (desktop only) */
if (!REDUCE && CAN_HOVER) {
  const glow = $("#glow");
  addEventListener("mousemove", e => { glow.style.opacity = 1; glow.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; });
  $$(".tilt").forEach(el => {
    const deg = +el.dataset.deg || 6;
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transition = "transform .1s";
      el.style.transform = `perspective(900px) rotateX(${-y * deg}deg) rotateY(${x * deg}deg) translateY(-4px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transition = "transform .5s"; el.style.transform = ""; });
  });
}

/* Contact form (opens the visitor's email app) + copy email */
const fName = $("#fName"), fMsg = $("#fMsg");
const updateMail = () => $("#send").href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Portfolio enquiry from " + (fName.value || "a visitor")) + "&body=" + encodeURIComponent(fMsg.value);
fName.oninput = fMsg.oninput = updateMail; updateMail();
$("#copyBtn").onclick = async e => {
  try { await navigator.clipboard.writeText(EMAIL); e.target.textContent = "Copied!"; }
  catch { e.target.textContent = EMAIL; }
  setTimeout(() => (e.target.textContent = "Copy email"), 2000);
};
