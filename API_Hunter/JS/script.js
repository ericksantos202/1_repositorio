let dadosJogos = []; // variável disponível para o arquivo inteiro.

// aba de pesquisa e botões
const campoBusca = document.getElementById("busca");
const botaoBuscar = document.getElementById("btnBuscar");
const filtroGenero = document.getElementById("filtroGenero");

// evento para quando o botão é clicado
botaoBuscar.addEventListener("click", function () {
  const texto = campoBusca.value;
  console.log(texto);

  const areaJogos = document.getElementById("jogos");
  const generoSelecionado = filtroGenero.value;

  console.log("Gênero:", generoSelecionado);

  let encontrou = false;

  areaJogos.innerHTML = "";

  for (let i = 0; i < dadosJogos.length; i++) {
    console.log(
      dadosJogos[i].title.toLowerCase().includes(texto.toLowerCase()),
    );

    if (
      dadosJogos[i].title.toLowerCase().includes(texto.toLowerCase()) &&
      (generoSelecionado === "" ||
        dadosJogos[i].genre.trim() === generoSelecionado)
    ) {
      encontrou = true;

      areaJogos.innerHTML += `
        <div>
          <h2>${dadosJogos[i].title}</h2>
          <p>${dadosJogos[i].genre}</p>
          <img src="${dadosJogos[i].thumbnail}">
          <button
            id="btn-download-${dadosJogos[i].id}"
            onclick="baixarJogo(${dadosJogos[i].id})"
            ${jogoEstaInstalado(dadosJogos[i].id) ? "disabled" : ""}
          >
            ${jogoEstaInstalado(dadosJogos[i].id) ? "Instalado" : "Download"}
          </button>
        </div>
      `;
    }
  }

  if (encontrou === false) {
    areaJogos.innerHTML = "<p>Nenhum jogo encontrado.</p>";
  }

  console.log(dadosJogos);
});

// função assíncrona - busca na API
async function buscarJogos() {
  const areaJogos = document.getElementById("jogos");

  areaJogos.innerHTML = "<p>Carregando jogos...</p>";

  try {
    const resposta = await fetch("https://www.freetogame.com/api/games");

    dadosJogos = await resposta.json();

    const generos = [...new Set(dadosJogos.map((jogo) => jogo.genre.trim()))];

    for (let i = 0; i < generos.length; i++) {
      filtroGenero.innerHTML += `
        <option value="${generos[i]}">
          ${generos[i]}
        </option>
      `;
    }

    console.log(dadosJogos);

    areaJogos.innerHTML = "";

    for (let i = 0; i < dadosJogos.length; i++) {
      areaJogos.innerHTML += `
        <div>
          <h2>${dadosJogos[i].title}</h2>
          <p>${dadosJogos[i].genre}</p>
          <img src="${dadosJogos[i].thumbnail}">
          <button
            id="btn-download-${dadosJogos[i].id}"
            onclick="baixarJogo(${dadosJogos[i].id})"
            ${jogoEstaInstalado(dadosJogos[i].id) ? "disabled" : ""}
          >
            ${jogoEstaInstalado(dadosJogos[i].id) ? "Instalado" : "Download"}
          </button>
        </div>
      `;
    }
  } catch (erro) {
    areaJogos.innerHTML = "<p>Não foi possível carregar os jogos.</p>";

    console.log(erro);
  }
}

buscarJogos();

// função que verifica se o jogo está instalado
function jogoEstaInstalado(id) {
  const jogosInstalados =
    JSON.parse(localStorage.getItem("jogosInstalados")) || [];

  return jogosInstalados.some((jogo) => jogo.id === id);
}

// função baixar o game
function baixarJogo(id) {
  if (jogoEstaInstalado(id)) {
    return;
  }

  const jogo = dadosJogos.find((jogo) => jogo.id === id);

  let jogosInstalados =
    JSON.parse(localStorage.getItem("jogosInstalados")) || [];

  const jaInstalado = jogosInstalados.some(
    (jogoInstalado) => jogoInstalado.id === jogo.id,
  );

  console.log("Jogo selecionado:", jogo);

  const areaDownloads = document.getElementById("downloads");

  areaDownloads.style.display = "block";

  areaDownloads.innerHTML = `
    <div>
      <p>Baixando ${jogo.title}...</p>
    </div>
  `;

  // intervalo para download mandar na biblioteca
  let progresso = 0;

  const intervalo = setInterval(function () {
    progresso += 20;

    areaDownloads.innerHTML = `
      <div>
        <p>Baixando ${jogo.title}...</p>
        <p>${progresso}%</p>
      </div>
    `;

    if (progresso >= 100) {
      clearInterval(intervalo);
    }

    if (progresso >= 100) {
      clearInterval(intervalo);

      let jogosInstalados =
        JSON.parse(localStorage.getItem("jogosInstalados")) || [];

      const jaInstalado = jogosInstalados.some(
        (jogoInstalado) => jogoInstalado.id === jogo.id,
      );

      if (!jaInstalado) {
        jogosInstalados.push(jogo);

        localStorage.setItem(
          "jogosInstalados",
          JSON.stringify(jogosInstalados),
        );
      }

      const botao = document.getElementById(`btn-download-${jogo.id}`);

      if (botao) {
        botao.textContent = "Instalado";
        botao.disabled = true;
      }

      areaDownloads.innerHTML = `
        <div>
          <p>Instalação concluída!</p>
          <p>${jogo.title} foi instalado.</p>
        </div>
      `;

      // delay da notificação
      setTimeout(function () {
        areaDownloads.style.display = "none";
      }, 3000);
    }
  }, 500);
}
