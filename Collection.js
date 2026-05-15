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
    imagem: "https://placehold.co/300x200",
    raridade: "Comum",
    repetido: false
  },
  {
    nome: "Dragão Guardião",
    imagem: "https://placehold.co/300x200",
    raridade: "Comum",
    repetido: false
  },
  {
    nome: "Cometa Rubro",
    imagem: "https://placehold.co/300x200",
    raridade: "Raro",
    repetido: false
  },
  {
    nome: "Espírito da Realeza",
    imagem: "https://placehold.co/300x200",
    raridade: "Raro",
    repetido: false
  },
  {
    nome: "Feixe Estelar",
    imagem: "https://placehold.co/300x200",
    raridade: "Lendária",
    repetido: false
  },
  {
    nome: "Katana do Oriente",
    imagem: "https://placehold.co/300x200",
    raridade: "Lendária",
    repetido: false
  },
];

// ================= SALVAR E CARREGAR =================
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

  if (card.nova) {
  div.classList.add("invocando");
  }

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

  // DESTRUIR (REMOVE PERMANENTE)
  btnDel.addEventListener("click", () => {

  div.classList.add("destruindo");

  setTimeout(() => {

    colecao = colecao.filter(c => c.id !== card.id);

    salvar();
    renderizar();

  }, 400);

});

  div.appendChild(badge);
  div.appendChild(img);
  div.appendChild(titulo);
  div.appendChild(raridade);
  const actionsTop = document.createElement("div");
  actionsTop.classList.add("actions-top");

  const actionsBottom = document.createElement("div");
  actionsBottom.classList.add("actions-bottom");

  actionsTop.appendChild(btnFav);
  actionsTop.appendChild(btnTrade);

  actionsBottom.appendChild(btnDel);

  div.appendChild(actionsTop);
  div.appendChild(actionsBottom);

  container.appendChild(div);
}

// ================= RENDERIZAR =================
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
    troca: false,
    nova: true
  });

  salvar();
  renderizar();

  colecao.forEach(c => c.nova = false);

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

