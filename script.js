// Mapeamento de símbolos das moedas
const simbolos = {
    "BRL": "R$",
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "CNY": "¥",
    "JPY": "¥"
};

// Função para formatar números de acordo com a moeda
function formatarValor(valor, moeda) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: moeda
    }).format(valor);
}

const botaoParaConverter = document.querySelector(".botao-para-converter")

// Função para converter as moedas
async function converter() {
    // Pegando os valores selecionados nas opções de moeda
    const moedaDe = document.querySelector('.select-primary').value;
    const moedaPara = document.querySelector('.select-secundary').value;

    // Pegando o valor que o usuário digitou
    const valor = parseFloat(document.querySelector('.input-valor').value);

    // Verifica se o valor inserido é válido
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    // URL da API, substituindo a base da moeda escolhida
    const url = `https://v6.exchangerate-api.com/v6/9e93ad138d72d7cd8adc9d93/latest/${moedaDe}`;

    try {
        // Realizando a requisição para pegar as taxas de câmbio
        const response = await fetch(url);
        const data = await response.json();

        // Verifica se a API retornou com sucesso
        if (data.result === "success") {
            const taxa = data.conversion_rates[moedaPara];  // Obtém a taxa de conversão

            // Realiza a conversão
            const valorConvertido = (valor * taxa).toFixed(2);

            // Atualiza o valor no HTML com os símbolos das moedas
            document.querySelector('.valor-para-converter').textContent = formatarValor(valor, moedaDe);
            document.querySelector('.valor-convertido').textContent = formatarValor(valorConvertido, moedaPara);
        } else {
            alert("Erro ao obter dados da API.");
        }
    } catch (error) {
        console.error("Erro ao acessar a API:", error);
        alert("Houve um erro na comunicação com a API.");
    }
}

// Função para trocar as opções de conversão (De e Para), atualizar as moedas e converter automaticamente
document.querySelector('.button-change').addEventListener('click', () => {
    const selectDe = document.querySelector('.select-primary');
    const selectPara = document.querySelector('.select-secundary');

    // Troca os valores selecionados
    const temp = selectDe.value;
    selectDe.value = selectPara.value;
    selectPara.value = temp;



    // Limpar os resultados anteriores para recalcular com as novas moedas
    document.querySelector('.valor-para-converter').textContent = `0.00 ${simbolos[selectDe.value]}`;
    document.querySelector('.valor-convertido').textContent = `0.00 ${simbolos[selectPara.value]}`;

    // Chama a função de conversão após a troca das moedas
    converter();
    atualizarNomesMoeda()
});

function atualizarNomesMoeda() {

    const selectDe = document.querySelector('.select-primary');
    const selectPara = document.querySelector('.select-secundary');

    // Atualiza as moedas no display
    document.querySelector('.moeda-para-converter').textContent = selectDe.options[selectDe.selectedIndex].text;
    document.querySelector('.moeda-convertida').textContent = selectPara.options[selectPara.selectedIndex].text;
    // Evento para atualizar os nomes das moedas quando o usuário selecionar uma moeda diferente

    document.querySelector('.select-primary').addEventListener('change', atualizarNomesMoeda);
    document.querySelector('.select-secundary').addEventListener('change', atualizarNomesMoeda);
    // Chama a função para atualizar os nomes das moedas ao carregar a página
    // Atualiza as opções do select, removendo a opção repetida
    removerOpcaoRepetida(selectDe, selectPara);
    converter()
}

// Função para remover a opção repetida de ambos os selects
const removerOpcaoRepetida = (selectDe, selectPara) => {
    const valorDe = selectDe.value;
    const valorPara = selectPara.value;

    // Remove a moeda de destino do select de origem
    Array.from(selectDe.options).forEach(option => {
        if (option.value === valorPara) {
            option.style.display = 'none';  // Esconde a opção
        } else {
            option.style.display = 'block'; // Mostra as outras opções
        }
    });

    // Remove a moeda de origem do select de destino
    Array.from(selectPara.options).forEach(option => {
        if (option.value === valorDe) {
            option.style.display = 'none';  // Esconde a opção
        } else {
            option.style.display = 'block'; // Mostra as outras opções
        }
    });
}





// Função para o botão "Converter" - Quando o valor é inserido manualmente
document.querySelector('.botao-para-converter').addEventListener('click', converter,);
botaoParaConverter.addEventListener("click", atualizarNomesMoeda)