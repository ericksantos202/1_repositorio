let dadosJogos = []; //variavel disponivel para o arquivo inteiro.

//aba de pesquisa e botões//
const campoBusca = document.getElementById("busca");
const botaoBuscar = document.getElementById("btnBuscar");
const filtroGenero = document.getElementById("filtroGenero");

//evento para quando botão é clicado//
botaoBuscar.addEventListener("click", function() {

    const texto = campoBusca.value;
    console.log(texto)
    const areaJogos = document.getElementById("jogos");
    const generoSelecionado = filtroGenero.value;
    console.log("Gênero:", generoSelecionado);
    
    let encontrou = false;
    
    areaJogos.innerHTML = "";
    for (let i = 0; i < dadosJogos.length; i++) {

        console.log(dadosJogos[i].title.toLowerCase().includes(texto.toLowerCase()));

        if (
            dadosJogos[i].title.toLowerCase().includes(texto.toLowerCase()) &&
            (generoSelecionado === "" || dadosJogos[i].genre.trim() === generoSelecionado)
        ) {
            
            encontrou = true;
            
            areaJogos.innerHTML += `
                <div>
                    <h2>${dadosJogos[i].title}</h2>
                    <p>${dadosJogos[i].genre}</p>
                    <img src="${dadosJogos[i].thumbnail}">
                </div>
            `;
        }
    }
    if (encontrou === false) {
        areaJogos.innerHTML = "<p>Nenhum jogo encontrado.</p>";
    }

    console.log(dadosJogos);
});


//função assincrona - busca na API//
async function buscarJogos() {

    const areaJogos = document.getElementById("jogos");

    areaJogos.innerHTML = "<p>Carregando jogos...</p>";

    try {

        const resposta = await fetch("https://www.freetogame.com/api/games");

        dadosJogos = await resposta.json();

        const generos = [...new Set(dadosJogos.map(jogo => jogo.genre.trim()))];
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
                    </div>
                `;
            
    }

    } catch (erro) {

        areaJogos.innerHTML = "<p>Não foi possível carregar os jogos.</p>";

        console.log(erro);
    }
}

buscarJogos();