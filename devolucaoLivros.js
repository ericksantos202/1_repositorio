// CONTADORES//
let totalLivros = 0;
let livrosMulta = 0;

// BOTÃO//
const btn = document.getElementById("btnRegistrar");
btn.addEventListener("click", adicionarLivro);

// FUNÇÃO PRINCIPAL //
function adicionarLivro() {
  const nomeInput = document.getElementById("nomeLivro");
  const diasInput = document.getElementById("diasAtraso");

  const nome = nomeInput.value;
  const dias = Number(diasInput.value);

  if (nome === "") {
    alert("Digite o nome do livro");
    return;
  }

  const lista = document.getElementById("listaLivros");

  let status = "OK";
  let classe = "";

  if (dias > 0) {
    status = "ATRASADO";
    classe = "atrasado";
    livrosMulta++;
  }

  totalLivros++;

  const linha = document.createElement("tr");
  linha.className = classe;

  linha.innerHTML = `
    <td>${nome}</td>
    <td>${dias}</td>
    <td>${status}</td>
    <td>
      <button class="remover">Confirmar Arquivamento</button>
    </td>
  `;

  // botão de remover//
  linha.querySelector(".remover").addEventListener("click", function () {
    removerLivro(linha, dias);
  });

  lista.appendChild(linha);

  atualizarContadores();

  // limpar inputs//
  nomeInput.value = "";
  diasInput.value = "";
}

// REMOVER LIVRO//
function removerLivro(linha, dias) {
  linha.remove();

  totalLivros--;

  if (dias > 0) {
    livrosMulta--;
  }

  atualizarContadores();
}

// ATUALIZAR CONTADORES//
function atualizarContadores() {
  document.getElementById("total").innerText =
    `Total de livros processados: ${totalLivros}`;

  document.getElementById("multa").innerText =
    `Livros com multa: ${livrosMulta}`;
}