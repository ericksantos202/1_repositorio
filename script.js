const livros = [
    { id: 1, titulo: "Dom Casmurro", preco: 35.00 },
    { id: 2, titulo: "Clean Code", preco: 25.00 },
    { id: 3, titulo: "O Alquimista", preco: 42.00 },
    { id: 4, titulo: "Javascript Eloquente", preco: 75.00 }
];

let carrinho = {};
let total = 0;

const listaLivros = document.getElementById("lista-livros");
const itemCarrinho = document.getElementById("item-carrinho");
const valorTotal = document.getElementById("valor-total");

function carregarCatalogo() {
    livros.forEach(livro => {
        const div = document.createElement("div");
        div.classList.add("livro-card");

        div.innerHTML = `
            <h3>${livro.titulo}</h3>
            <p>R$ ${livro.preco.toFixed(2)}</p>
            <button onclick="adicionarAoCarrinho(${livro.id})">
                Adicionar
            </button>
         `;

        listaLivros.appendChild(div);
    });
}

function adicionarAoCarrinho(id) {
    const livro = livros.find(l => l.id === id);

    if (carrinho[id]) {
        carrinho[id].quantidade++;
    } else {
        carrinho[id] = {
            ...livro,
            quantidade: 1
        };
    }

    atualizarCarrinho();
}

function atualizarCarrinho() {
    itemCarrinho.innerHTML = "";
    total = 0;

    Object.values(carrinho).forEach(item => {
        const li = document.createElement("li");

        li.textContent = `${item.titulo} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`;

        itemCarrinho.appendChild(li);

        total += item.preco * item.quantidade;
    });

    valorTotal.textContent = total.toFixed(2);
}
