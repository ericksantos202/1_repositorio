// Pega a área HTML onde os jogos da biblioteca serão exibidos.
const areaBiblioteca = document.getElementById("biblioteca");

// Recupera os jogos salvos no localStorage.
// JSON.parse transforma o texto salvo novamente em um array.
// Se não existir nenhum jogo salvo, utiliza um array vazio.
let jogosInstalados = JSON.parse(localStorage.getItem("jogosInstalados")) || [];

// Mostra no console os jogos que foram recuperados.
console.log("Jogos da biblioteca:", jogosInstalados);

// Verifica se a biblioteca está vazia.
if (jogosInstalados.length === 0) {
  // Se não houver jogos, mostra uma mensagem informando
  // que ainda não existem jogos na biblioteca.
  areaBiblioteca.innerHTML = `
        <div class="biblioteca-vazia">
            <h2>Ainda sem nada por aqui...</h2>
            <p>Baixe um jogo para começar sua biblioteca.</p>
        </div>
    `;
}

// Percorre todos os jogos instalados.
for (let i = 0; i < jogosInstalados.length; i++) {
  // Adiciona um card para cada jogo encontrado.
  areaBiblioteca.innerHTML += `
        <div>
            <h2>${jogosInstalados[i].title}</h2>
            <p>${jogosInstalados[i].genre}</p>
            <img src="${jogosInstalados[i].thumbnail}">
            
            <!-- Botão que chama a função para iniciar o jogo. -->
            <button onclick="iniciarJogo(${jogosInstalados[i].id})">
                Iniciar
            </button>

            <!-- Botão que chama a função para excluir o jogo. -->
            <button onclick="excluirJogo(${jogosInstalados[i].id})">
                Excluir
            </button>
        </div>
    `;
}

// FUNÇÃO DE EXCLUIR DA BIBLIOTECA

function excluirJogo(id) {
  // Recupera novamente os jogos salvos no localStorage.
  let jogosInstalados =
    JSON.parse(localStorage.getItem("jogosInstalados")) || [];

  // filter cria um novo array mantendo apenas os jogos
  // cujo ID seja diferente do jogo que será excluído.
  jogosInstalados = jogosInstalados.filter((jogo) => jogo.id !== id);

  // Salva o novo array atualizado no localStorage.
  // JSON.stringify transforma o array em texto para poder ser armazenado.
  localStorage.setItem("jogosInstalados", JSON.stringify(jogosInstalados));

  // Recarrega a página para atualizar a biblioteca na tela.
  location.reload();
}

// FUNÇÃO INICIAR

function iniciarJogo(id) {
  // Procura no array o jogo que possui o ID recebido.
  const jogo = jogosInstalados.find((jogo) => jogo.id === id);

  // Exibe uma mensagem simulando o início do jogo.
  alert(`Iniciando ${jogo.title}...`);
}
