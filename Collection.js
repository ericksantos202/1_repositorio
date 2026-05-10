const container = document.getElementById("cards-container");
const btnAdd = document.getElementById("addCard");
const search = document.getElementById("search");

// ESTADO
let colecao = [];
let filtroAtual = "todos";

// CARTAS BASE
const cartas = [
  {
    nome: "Magia de Fogo",
    imagem: "https://placehold.co/300x200",
    raridade: "Rara",
    repetido: false
  },
  {
    nome: "Magia de Gelo",
    imagem: "https://placehold.co/300x200",
    raridade: "Comum",
    repetido: false
  }
];


// ================= PAINEL =================
function atualizarPainel() {
  document.getElementById("total").textContent = colecao.length;
  document.getElementById("repetidas").textContent =
    colecao.filter(c => c.repetido).length;
  document.getElementById("unicas").textContent =
    colecao.filter(c => !c.repetido).length;
}


// ================= CRIAR CARD =================
function criarCard(card) {
  const div = document.createElement("div");
  div.classList.add("Card");

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

  if (card.favorito) badge.textContent = "⭐";
  else if (card.troca) badge.textContent = "🔄";

  const btnFav = document.createElement("button");
  btnFav.textContent = "⭐ Favorito";

  const btnTrade = document.createElement("button");
  btnTrade.textContent = "🔄 Trocar";

  const btnDel = document.createElement("button");
  btnDel.textContent = "🗑 Deletar";


  // ⭐ FAVORITO
  btnFav.addEventListener("click", () => {
    card.favorito = !card.favorito;

    if (card.favorito) card.troca = false;

    renderizar();
  });


  // 🔄 TROCAR
  btnTrade.addEventListener("click", () => {
    card.troca = !card.troca;

    if (card.troca) card.favorito = false;

    renderizar();
  });


  // 🗑 DELETAR
  btnDel.addEventListener("click", () => {
    colecao = colecao.filter(c => c.id !== card.id);
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


// ================= INICIAL =================
cartas.forEach(c => {
  colecao.push({
    ...c,
    id: Date.now() + Math.random(),
    favorito: false,
    troca: false
  });
});

renderizar();


// ================= ADICIONAR =================
btnAdd.addEventListener("click", () => {
  const nome = document.getElementById("nome").value;
  const imagem = document.getElementById("imagem").value;
  const raridade = document.getElementById("raridade").value;
  const repetido = document.getElementById("repetido").checked;

  const imagemFinal = imagem || "https://placehold.co/300x200";

  colecao.push({
  id: Date.now(),
  nome,
  imagem: imagemFinal,
  raridade,
  repetido,
  favorito: false,
  troca: false
  });

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
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");

openBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
});