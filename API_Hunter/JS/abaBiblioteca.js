const areaBiblioteca = document.getElementById("biblioteca");

let jogosInstalados = JSON.parse(localStorage.getItem("jogosInstalados")) || [];

console.log("Jogos da biblioteca:", jogosInstalados);

if (jogosInstalados.length === 0) {
  areaBiblioteca.innerHTML = `
        <div class="biblioteca-vazia">
            <h2>Ainda sem nada por aqui...</h2>
            <p>Baixe um jogo para começar sua biblioteca.</p>
        </div>
    `;
}

for (let i = 0; i < jogosInstalados.length; i++) {
  areaBiblioteca.innerHTML += `
        <div>
            <h2>${jogosInstalados[i].title}</h2>
            <p>${jogosInstalados[i].genre}</p>
            <img src="${jogosInstalados[i].thumbnail}">
            <button onclick="iniciarJogo(${jogosInstalados[i].id})">Iniciar</button>
            <button onclick="excluirJogo(${jogosInstalados[i].id})">Excluir</button>
        </div>
    `;
}

//FUNÇÃO DE EXCLUIR DA BIBLIOTECA//
function excluirJogo(id) {
  let jogosInstalados =
    JSON.parse(localStorage.getItem("jogosInstalados")) || [];

  jogosInstalados = jogosInstalados.filter((jogo) => jogo.id !== id);

  localStorage.setItem("jogosInstalados", JSON.stringify(jogosInstalados));

  location.reload();
}

//FUNÇÃO INICIAR//
function iniciarJogo(id) {
  const jogo = jogosInstalados.find((jogo) => jogo.id === id);

  alert(`Iniciando ${jogo.title}...`);
}
