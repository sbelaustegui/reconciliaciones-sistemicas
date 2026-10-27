// Número de WhatsApp en formato internacional, sin "+" ni espacios (ej: 5491112345678)
const WHATSAPP = "34611558575";
// Each page can set its own default message with <body data-wa-msg="...">
const DEFAULT_MSG = document.body.dataset.waMsg || "Hola Jimena! Quiero recibir información sobre la formación de Reconciliaciones Sistémicas con Caballos (16 al 21 de febrero de 2027).";

if (WHATSAPP) {
  document.querySelectorAll(".js-wa").forEach(a => {
    a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(a.dataset.msg || DEFAULT_MSG);
    a.target = "_blank";
    a.rel = "noopener";
  });
}

const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

const lb = document.getElementById("lb");
if (lb) {
  document.querySelectorAll(".pr .body img, .integration img, .sci img").forEach(img => {
    img.addEventListener("click", () => { lb.querySelector("img").src = img.src; lb.classList.add("on"); });
  });
  lb.addEventListener("click", () => lb.classList.remove("on"));
  addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("on"); });
}
