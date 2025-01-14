// Mapeamento de símbolos das moedas
const simbolos = {
    "BRL": "R$",
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "CNY": "¥",
    "JPY": "¥"
};

// Taxas de câmbio fixas (exemplo)
const taxasDeCambio = {
    "BRL": { "USD": 0.20, "EUR": 0.18, "GBP": 0.16, "CNY": 1.34, "JPY": 28.00 },
    "USD": { "BRL": 5.00, "EUR": 0.90, "GBP": 0.80, "CNY": 6.70, "JPY": 140.00 },
    "EUR": { "BRL": 5.56, "USD": 1.10, "GBP": 0.89, "CNY": 7.50, "JPY": 155.00 },
    "GBP": { "BRL": 6.25, "USD": 1.25, "EUR": 1.12, "CNY": 8.40, "JPY": 174.00 },
    "CNY": { "BRL": 0.75, "USD": 0.15, "EUR": 0.13, "GBP": 0.12, "JPY": 20.70 },
    "JPY": { "BRL": 0.036, "USD": 0.0071, "EUR": 0.0065, "GBP": 0.0057, "CNY": 0.048 }
};

// Função para formatar números de acordo com a moeda
function formatarValor(valor, moeda) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: moeda
    }).format(valor);
}

const botaoParaConverter = document.querySelector(".botao-para-converter");

// Função para converter as moedas
async function converter() {
    const moedaDe = document.querySelector('.select-primary').value;
    const moedaPara = document.querySelector('.select-secundary').value;
    const valor = parseFloat(document.querySelector('.input-valor').value);

    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    // Verificar se a moeda de origem e a de destino estão definidas nas taxas
    if (!taxasDeCambio[moedaDe] || !taxasDeCambio[moedaDe][moedaPara]) {
        alert("Conversão não disponível para essas moedas.");
        return;
    }

    // Obter a taxa de câmbio fixada
    const taxa = taxasDeCambio[moedaDe][moedaPara];
    const valorConvertido = (valor * taxa).toFixed(2);

    // Atualiza o valor no HTML com os símbolos das moedas
    document.querySelector('.valor-para-converter').textContent = formatarValor(valor, moedaDe);
    document.querySelector('.valor-convertido').textContent = formatarValor(valorConvertido, moedaPara);
}

// Função para trocar as opções de conversão (De e Para), atualizar as moedas e converter automaticamente
document.querySelector('.button-change').addEventListener('click', () => {
    const selectDe = document.querySelector('.select-primary');
    const selectPara = document.querySelector('.select-secundary');

    const temp = selectDe.value;
    selectDe.value = selectPara.value;
    selectPara.value = temp;

    // Limpar os resultados anteriores para recalcular com as novas moedas
    document.querySelector('.valor-para-converter').textContent = `0.00 ${simbolos[selectDe.value]}`;
    document.querySelector('.valor-convertido').textContent = `0.00 ${simbolos[selectPara.value]}`;

    // Chama a função de conversão após a troca das moedas
    converter();
    atualizarNomesMoeda();
});

// Função para atualizar os nomes das moedas no display
function atualizarNomesMoeda() {
    const selectDe = document.querySelector('.select-primary');
    const selectPara = document.querySelector('.select-secundary');

    document.querySelector('.moeda-para-converter').textContent = selectDe.options[selectDe.selectedIndex].text;
    document.querySelector('.moeda-convertida').textContent = selectPara.options[selectPara.selectedIndex].text;
    
    // Evento para atualizar os nomes das moedas quando o usuário selecionar uma moeda diferente
    document.querySelector('.select-primary').addEventListener('change', atualizarNomesMoeda);
    document.querySelector('.select-secundary').addEventListener('change', atualizarNomesMoeda);

    // Chama a função para atualizar os nomes das moedas ao carregar a página
    removerOpcaoRepetida(selectDe, selectPara);
    converter();
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
document.querySelector('.botao-para-converter').addEventListener('click', converter);
