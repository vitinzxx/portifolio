/* =========================================================
   Portfólio | JavaScript
   1) Seus dados (edite só este bloco)
   2) Tema claro/escuro
   3) Menu no celular e link ativo
   4) Calculadora de zonas de treino
   5) Galeria de fotos
   6) Formulário de contato
   ========================================================= */

/* ---------- 1) Seus dados ---------- */
const PERFIL = {
  nome: "Vitor",
  iniciais: "VT",
  idade: 18,
  email: "vitordelduca@gmail.com",
  github: "https://github.com/vitinzxx",
  instagram: "https://www.instagram.com/vitinzxx__/"
};

document.title = PERFIL.nome + " | Portfólio";

document.querySelectorAll("[data-nome]").forEach(function (el) {
  el.textContent = PERFIL.nome;
});
document.querySelectorAll("[data-iniciais]").forEach(function (el) {
  el.textContent = PERFIL.iniciais;
});
document.querySelectorAll("[data-idade]").forEach(function (el) {
  el.textContent = PERFIL.idade;
});
document.querySelectorAll("[data-email]").forEach(function (el) {
  el.textContent = PERFIL.email;
});
document.querySelectorAll("[data-link]").forEach(function (el) {
  var url = PERFIL[el.dataset.link];
  if (url) el.setAttribute("href", url);
});
document.getElementById("ano").textContent = new Date().getFullYear();

/* ---------- 2) Tema claro/escuro ---------- */
var raiz = document.documentElement;
var botaoTema = document.getElementById("tema");

try {
  var salvo = localStorage.getItem("tema");
  if (salvo === "dark" || salvo === "light") raiz.setAttribute("data-theme", salvo);
} catch (e) { /* sem armazenamento, segue com o tema do sistema */ }

botaoTema.addEventListener("click", function () {
  var atual = raiz.getAttribute("data-theme");
  if (!atual) {
    atual = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var novo = atual === "dark" ? "light" : "dark";
  raiz.setAttribute("data-theme", novo);
  try { localStorage.setItem("tema", novo); } catch (e) {}
});

/* ---------- 3) Menu no celular e link ativo ---------- */
var menu = document.getElementById("menu");
var botaoMenu = document.getElementById("abrir-menu");

botaoMenu.addEventListener("click", function () {
  var aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", String(aberto));
});

menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  });
});

var linksMenu = Array.from(menu.querySelectorAll("a"));
var secoes = linksMenu
  .map(function (a) { return document.querySelector(a.getAttribute("href")); })
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        linksMenu.forEach(function (a) {
          a.classList.toggle("ativo", a.getAttribute("href") === "#" + entrada.target.id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  secoes.forEach(function (s) { observador.observe(s); });
}

/* ---------- 4) Calculadora de zonas de treino ---------- */
var formFc = document.getElementById("form-fc");
var campoIdade = document.getElementById("idade");
var erroFc = document.getElementById("erro-fc");
var listaZonas = document.getElementById("zonas");
var textoFcMax = document.getElementById("fcmax");
var legendaFc = document.getElementById("legenda-fc");
var coracao = document.getElementById("coracao");

var ZONAS = [
  { nome: "Muito leve", de: 0.5, ate: 0.6, cor: "#7fcf7a" },
  { nome: "Leve",       de: 0.6, ate: 0.7, cor: "#2fa35a" },
  { nome: "Moderada",   de: 0.7, ate: 0.8, cor: "#e3b800" },
  { nome: "Intensa",    de: 0.8, ate: 0.9, cor: "#ee8a1f" },
  { nome: "Máxima",     de: 0.9, ate: 1.0, cor: "#d93a2b" }
];

function calcularZonas(idade) {
  var fcMax = 220 - idade;
  return {
    fcMax: fcMax,
    zonas: ZONAS.map(function (z) {
      return {
        nome: z.nome,
        de: Math.round(fcMax * z.de),
        ate: Math.round(fcMax * z.ate),
        pctDe: Math.round(z.de * 100),
        pctAte: Math.round(z.ate * 100),
        cor: z.cor
      };
    })
  };
}

function mostrarZonas(idade, exemplo) {
  var r = calcularZonas(idade);
  textoFcMax.textContent = r.fcMax;

  /* o coração bate na velocidade de um esforço moderado */
  var batidasPorMinuto = r.fcMax * 0.75;
  coracao.style.setProperty("--batida", (60 / batidasPorMinuto).toFixed(2) + "s");

  legendaFc.textContent = exemplo
    ? "Exemplo com " + idade + " anos. Troque pela sua idade."
    : "Resultado para " + idade + " anos.";

  listaZonas.innerHTML = "";
  r.zonas.forEach(function (z) {
    var item = document.createElement("li");
    item.className = "zona";
    item.innerHTML =
      '<div class="zona__linha">' +
        '<span class="zona__nome">' + z.nome +
          '<span class="zona__pct">' + z.pctDe + " a " + z.pctAte + "%</span></span>" +
        '<span class="zona__bpm">' + z.de + " a " + z.ate + " bpm</span>" +
      "</div>" +
      '<div class="zona__barra"><span class="zona__preenche" style="width:0;background:' + z.cor + '"></span></div>';
    listaZonas.appendChild(item);

    /* a barra cresce até a zona final (percentual da frequência máxima) */
    var barra = item.querySelector(".zona__preenche");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { barra.style.width = z.pctAte + "%"; });
    });
  });
}

formFc.addEventListener("submit", function (evento) {
  evento.preventDefault();
  var idade = Number(campoIdade.value);

  if (!Number.isInteger(idade) || idade < 10 || idade > 100) {
    erroFc.textContent = "Digite uma idade inteira entre 10 e 100 anos.";
    erroFc.hidden = false;
    campoIdade.focus();
    return;
  }
  erroFc.hidden = true;
  mostrarZonas(idade, false);
});

mostrarZonas(Number(campoIdade.value), true);

/* ---------- 5) Galeria: ampliar a foto ao clicar ---------- */
var janelaFoto = document.getElementById("ampliar");
var imgAmpliada = janelaFoto.querySelector("img");
var legendaAmpliada = janelaFoto.querySelector("p");
var itensGaleria = document.querySelectorAll(".galeria__item");

function temFoto(item) {
  var img = item.querySelector("img");
  return Boolean(img && img.complete && img.naturalWidth > 0);
}

/* destaca com cursor de zoom só as figuras que já têm foto */
itensGaleria.forEach(function (item) {
  var img = item.querySelector("img");
  if (!img) return;
  function marcar() { if (temFoto(item)) item.classList.add("tem-foto"); }
  marcar();
  img.addEventListener("load", marcar);
});

itensGaleria.forEach(function (item) {
  item.addEventListener("click", function () {
    if (!temFoto(item)) return;
    var img = item.querySelector("img");
    imgAmpliada.src = img.currentSrc || img.src;
    imgAmpliada.alt = img.alt;
    legendaAmpliada.textContent = item.querySelector("figcaption").textContent;
    janelaFoto.showModal();
  });
});

document.getElementById("fechar-foto").addEventListener("click", function () {
  janelaFoto.close();
});
/* clicar fora da foto também fecha */
janelaFoto.addEventListener("click", function (evento) {
  if (evento.target === janelaFoto) janelaFoto.close();
});

/* ---------- 6) Formulário de contato ---------- */
/* Este site não tem servidor. O botão abre o seu aplicativo de e-mail
   com a mensagem pronta para enviar. */
var formContato = document.getElementById("form-contato");
var statusContato = document.getElementById("status-contato");

formContato.addEventListener("submit", function (evento) {
  evento.preventDefault();
  var nome = document.getElementById("c-nome").value.trim();
  var mensagem = document.getElementById("c-msg").value.trim();

  if (!nome || !mensagem) {
    statusContato.textContent = "Preencha seu nome e a mensagem.";
    statusContato.hidden = false;
    return;
  }

  var assunto = "Contato pelo portfólio";
  var corpo = mensagem + "\n\n" + nome;
  window.location.href =
    "mailto:" + PERFIL.email +
    "?subject=" + encodeURIComponent(assunto) +
    "&body=" + encodeURIComponent(corpo);

  statusContato.textContent =
    "Seu aplicativo de e-mail deve abrir com a mensagem pronta. Se não abrir, escreva para " + PERFIL.email + ".";
  statusContato.hidden = false;
});
