// ============================================================
// DADOS E ELEMENTOS DA INTERFACE
// ============================================================

// Array que ficará disponível para todo o arquivo.
// Ele recebe os jogos vindos da API.
let dadosJogos = [];

// Referências aos elementos HTML usados na pesquisa e no filtro.
const campoBusca = document.getElementById("busca");
const botaoBuscar = document.getElementById("btnBuscar");
const filtroGenero = document.getElementById("filtroGenero");

// ============================================================
// PESQUISA E FILTRO DOS JOGOS
// ============================================================

// Evento executado quando o botão de pesquisa é clicado.
botaoBuscar.addEventListener("click", function () {
  // Pega o texto digitado pelo usuário no campo de busca.
  const texto = campoBusca.value;
  console.log(texto);

  // Local onde os cards dos jogos serão exibidos.
  const areaJogos = document.getElementById("jogos");

  // Pega o gênero selecionado no filtro.
  const generoSelecionado = filtroGenero.value;

  console.log("Gênero:", generoSelecionado);

  // Variável usada para verificar se algum jogo foi encontrado.
  let encontrou = false;

  // Limpa os resultados anteriores antes de mostrar a nova pesquisa.
  areaJogos.innerHTML = "";

  // Percorre todos os jogos armazenados em dadosJogos.
  for (let i = 0; i < dadosJogos.length; i++) {
    // Verifica se o título do jogo contém o texto pesquisado.
    // toLowerCase() deixa os dois textos em minúsculo,
    // permitindo uma pesquisa sem diferenciar maiúsculas e minúsculas.
    console.log(
      dadosJogos[i].title.toLowerCase().includes(texto.toLowerCase()),
    );

    // O jogo precisa:
    // 1. Ter o texto pesquisado no título;
    // 2. E ter o gênero selecionado, caso algum gênero tenha sido escolhido.
    if (
      dadosJogos[i].title.toLowerCase().includes(texto.toLowerCase()) &&
      (generoSelecionado === "" ||
        dadosJogos[i].genre.trim() === generoSelecionado)
    ) {
      // Indica que pelo menos um jogo foi encontrado.
      encontrou = true;

      // Adiciona o card do jogo na área de resultados.
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

  // Caso nenhum jogo tenha correspondido à pesquisa,
  // mostra uma mensagem para o usuário.
  if (encontrou === false) {
    areaJogos.innerHTML = "<p>Nenhum jogo encontrado.</p>";
  }

  console.log(dadosJogos);
});

// ============================================================
// BUSCA DOS JOGOS NA API
// ============================================================

// Função assíncrona responsável por buscar os jogos na API.
async function buscarJogos() {
  // Área onde os jogos serão exibidos.
  const areaJogos = document.getElementById("jogos");

  // Mensagem exibida enquanto os dados estão sendo carregados.
  areaJogos.innerHTML = "<p>Carregando jogos...</p>";

  try {
    // Faz uma requisição para a API da FreeToGame.
    // await faz o código esperar a resposta antes de continuar.
    const resposta = await fetch("https://www.freetogame.com/api/games");

    // Converte a resposta recebida para JSON
    // e armazena os jogos na variável principal.
    dadosJogos = await resposta.json();

    // Cria uma lista com os gêneros dos jogos.
    // map() pega o gênero de cada jogo.
    // Set remove gêneros repetidos.
    // Os três pontos (...) transformam o Set novamente em array.
    const generos = [...new Set(dadosJogos.map((jogo) => jogo.genre.trim()))];

    // Percorre os gêneros encontrados.
    for (let i = 0; i < generos.length; i++) {
      // Adiciona cada gênero como uma opção no filtro.
      filtroGenero.innerHTML += `
        <option value="${generos[i]}">
          ${generos[i]}
        </option>
      `;
    }

    console.log(dadosJogos);

    // Limpa a mensagem "Carregando jogos...".
    areaJogos.innerHTML = "";

    // Percorre todos os jogos recebidos da API.
    for (let i = 0; i < dadosJogos.length; i++) {
      // Cria o card de cada jogo.
      // Os dados são inseridos dinamicamente no HTML.
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
    // Caso aconteça algum erro na comunicação com a API,
    // mostra uma mensagem para o usuário.
    areaJogos.innerHTML = "<p>Não foi possível carregar os jogos.</p>";

    // Exibe o erro no console para ajudar na identificação do problema.
    console.log(erro);
  }
}

// Executa a função para carregar os jogos assim que a página é aberta.
buscarJogos();

// ============================================================
// VERIFICAÇÃO DE JOGO INSTALADO
// ============================================================

// Verifica se determinado jogo já está salvo na biblioteca.
function jogoEstaInstalado(id) {
  // Recupera a lista de jogos instalados do localStorage.
  // Caso não exista nenhuma lista, utiliza um array vazio.
  const jogosInstalados =
    JSON.parse(localStorage.getItem("jogosInstalados")) || [];

  // some() verifica se existe algum jogo com o mesmo ID.
  // Retorna true se encontrar e false caso contrário.
  return jogosInstalados.some((jogo) => jogo.id === id);
}

// ============================================================
// DOWNLOAD E INSTALAÇÃO DO JOGO
// ============================================================

// Função responsável por iniciar o download simulado.
function baixarJogo(id) {
  // Se o jogo já estiver instalado, não inicia outro download.
  if (jogoEstaInstalado(id)) {
    return;
  }

  // Procura dentro dos jogos carregados aquele que possui o ID recebido.
  const jogo = dadosJogos.find((jogo) => jogo.id === id);

  // Recupera os jogos já instalados.
  const jogosInstalados =
    JSON.parse(localStorage.getItem("jogosInstalados")) || [];

  // Verifica se o jogo já está na biblioteca.
  const jaInstalado = jogosInstalados.some(
    (jogoInstalado) => jogoInstalado.id === jogo.id,
  );

  console.log("Jogo selecionado:", jogo);

  // Local onde a notificação do download será exibida.
  const areaDownloads = document.getElementById("downloads");

  // Torna a área de download visível.
  areaDownloads.style.display = "block";

  // Mostra inicialmente a mensagem de download.
  areaDownloads.innerHTML = `
    <div>
      <p>Baixando ${jogo.title}...</p>
    </div>
  `;

  // ==========================================================
  // SIMULAÇÃO DO DOWNLOAD
  // ==========================================================

  // Começa o progresso em 0%.
  let progresso = 0;

  // setInterval executa esse bloco repetidamente.
  // Nesse caso, a cada 500 milissegundos.
  const intervalo = setInterval(function () {
    // Aumenta o progresso em 20% a cada intervalo.
    progresso += 20;

    // Atualiza a mensagem mostrando o progresso atual.
    areaDownloads.innerHTML = `
      <div>
        <p>Baixando ${jogo.title}...</p>
        <p>${progresso}%</p>
      </div>
    `;

    // Quando chega a 100%, encerra o intervalo.
    if (progresso >= 100) {
      clearInterval(intervalo);
    }

    // ========================================================
    // FINALIZAÇÃO DA INSTALAÇÃO
    // ========================================================

    if (progresso >= 100) {
      clearInterval(intervalo);

      // Recupera novamente os jogos instalados.
      let jogosInstalados =
        JSON.parse(localStorage.getItem("jogosInstalados")) || [];

      // Verifica novamente se o jogo já está instalado.
      const jaInstalado = jogosInstalados.some(
        (jogoInstalado) => jogoInstalado.id === jogo.id,
      );

      // Se ainda não estiver instalado, adiciona o jogo à lista.
      if (!jaInstalado) {
        jogosInstalados.push(jogo);

        // Salva a lista atualizada no localStorage.
        // JSON.stringify transforma o array em texto.
        localStorage.setItem(
          "jogosInstalados",
          JSON.stringify(jogosInstalados),
        );
      }

      // Localiza o botão correspondente ao jogo instalado.
      const botao = document.getElementById(`btn-download-${jogo.id}`);

      // Se o botão existir, altera seu estado.
      if (botao) {
        botao.textContent = "Instalado";
        botao.disabled = true;
      }

      // Mostra a mensagem de instalação concluída.
      areaDownloads.innerHTML = `
        <div>
          <p>Instalação concluída!</p>
          <p>${jogo.title} foi instalado.</p>
        </div>
      `;

      // ======================================================
      // FECHAMENTO DA NOTIFICAÇÃO
      // ======================================================

      // Aguarda 3 segundos e depois esconde a notificação.
      setTimeout(function () {
        areaDownloads.style.display = "none";
      }, 3000);
    }
  }, 500);
}
