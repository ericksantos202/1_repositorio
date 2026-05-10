const container = document.getElementById("cards-container");
const btnAdd = document.getElementById("addCard");
const search = document.getElementById("search");

// ================= UTIL =================
function normalizarRaridade(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ================= ESTADO =================
let filtroAtual = "todos";

// ================= BASE =================
const cartasBase = [
  {
    nome: "Relâmpago",
    imagem: "https://i.pinimg.com/1200x/11/39/24/1139246f92257a9e1dd6afd9170d1475.jpg",
    raridade: "Comum",
    repetido: false
  },
  {
    nome: "Dragão Guardião",
    imagem: "https://i.pinimg.com/736x/a9/80/7c/a9807c7b0f17e9a519a43d935de819aa.jpg",
    raridade: "Comum",
    repetido: false
  },
  {
    nome: "Cometa Rubro",
    imagem: "https://i.pinimg.com/736x/f9/cf/c3/f9cfc338d7ce5e0ac19d2a3d0daaa517.jpg",
    raridade: "Raro",
    repetido: false
  },
  {
    nome: "Espírito da Realeza",
    imagem: "https://i.pinimg.com/736x/ad/95/6e/ad956e266c8bbab94bb62f716b28bb2c.jpg",
    raridade: "Raro",
    repetido: false
  },
  {
    nome: "Feixe Estelar",
    imagem: "https://i.pinimg.com/736x/a7/d7/d9/a7d7d990b1ed177f9d416e36336141ec.jpg",
    raridade: "Lendária",
    repetido: false
  },
  {
    nome: "Katana do Oriente",
    imagem: "https://i.pinimg.com/736x/0c/da/66/0cda66078b25d9a3eacf0ae2a1e71e5d.jpg",
    raridade: "Lendária",
    repetido: false
  },
];

// ================= LOCALSTORAGE =================
function salvar() {
  localStorage.setItem("colecao", JSON.stringify(colecao));
}

function carregar() {
  const dados = localStorage.getItem("colecao");

  if (dados) return JSON.parse(dados);

  // primeira vez = base
  return cartasBase.map(c => ({
    ...c,
    id: crypto.randomUUID(),
    favorito: false,
    troca: false
  }));
}

// ================= COLEÇÃO =================
let colecao = carregar();

// ================= PAINEL =================
function atualizarPainel() {
  document.getElementById("total").textContent = colecao.length;
  document.getElementById("repetidas").textContent =
    colecao.filter(c => c.repetido).length;
  document.getElementById("unicas").textContent =
    colecao.filter(c => !c.repetido).length;
}

// ================= CARD =================
function criarCard(card) {
  const div = document.createElement("div");

  div.classList.add("Card");
  div.classList.add(normalizarRaridade(card.raridade));

  if (card.favorito) div.classList.add("favorito");
  if (card.troca) div.classList.add("troca");

  const img = document.createElement("img");
  img.src = card.imagem;

  const titulo = document.createElement("h2");
  titulo.textContent = card.nome;

  const raridade = document.createElement("p");
  raridade.textContent = card.raridade;

  const badge = document.createElement("div");
  badge.classList.add("badge");

  badge.textContent =
    card.favorito ? "⭐" :
    card.troca ? "🔄" : "";

  // ===== BOTÕES =====
  const btnFav = document.createElement("button");
  btnFav.textContent = "⭐ Favorito";

  const btnTrade = document.createElement("button");
  btnTrade.textContent = "🔄 Trocar";

  const btnDel = document.createElement("button");
  btnDel.textContent = "🗑 Destruir";

  // FAVORITO
  btnFav.addEventListener("click", () => {
    card.favorito = !card.favorito;
    if (card.favorito) card.troca = false;
    salvar();
    renderizar();
  });

  // TROCA
  btnTrade.addEventListener("click", () => {
    card.troca = !card.troca;
    if (card.troca) card.favorito = false;
    salvar();
    renderizar();
  });

  // 🧨 DESTRUIR (REMOVE PERMANENTE)
  btnDel.addEventListener("click", () => {
    colecao = colecao.filter(c => c.id !== card.id);
    salvar();
    renderizar();
  });

  div.appendChild(badge);
  div.appendChild(img);
  div.appendChild(titulo);
  div.appendChild(raridade);
  div.appendChild(btnFav);
  div.appendChild(btnTrade);
  div.appendChild(btnDel);

  container.appendChild(div);
}

// ================= RENDER =================
function renderizar() {
  container.innerHTML = "";

  let lista = colecao;

  if (filtroAtual === "favoritos") {
    lista = lista.filter(c => c.favorito);
  }

  if (filtroAtual === "troca") {
    lista = lista.filter(c => c.troca);
  }

  const busca = search.value?.toLowerCase() || "";

  lista
    .filter(c => c.nome.toLowerCase().includes(busca))
    .forEach(criarCard);

  atualizarPainel();
}

// ================= ADD =================
btnAdd.addEventListener("click", () => {
  const nome = document.getElementById("nome").value;
  const imagem = document.getElementById("imagem").value;
  const raridade = document.getElementById("raridade").value;
  const repetido = document.getElementById("repetido").checked;

  if (!nome) return;

  colecao.push({
    id: crypto.randomUUID(),
    nome,
    imagem: imagem || "https://placehold.co/300x200",
    raridade,
    repetido,
    favorito: false,
    troca: false
  });

  salvar();
  renderizar();

  document.getElementById("nome").value = "";
  document.getElementById("imagem").value = "";
  document.getElementById("repetido").checked = false;
});

// ================= BUSCA =================
search.addEventListener("input", renderizar);

// ================= FILTROS =================
document.getElementById("filtroTodos")?.addEventListener("click", () => {
  filtroAtual = "todos";
  renderizar();
});

document.getElementById("filtroFav")?.addEventListener("click", () => {
  filtroAtual = "favoritos";
  renderizar();
});

document.getElementById("filtroTrade")?.addEventListener("click", () => {
  filtroAtual = "troca";
  renderizar();
});

// ================= SIDEBAR =================
const sidebar = document.getElementById("sidebar");
document.getElementById("openSidebar").onclick = () =>
  sidebar.classList.add("open");

document.getElementById("closeSidebar").onclick = () =>
  sidebar.classList.remove("open");

// ================= INIT =================
renderizar();

