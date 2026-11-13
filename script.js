// 1. Menu Mobile (Abre e fecha no celular)
const btnMobile = document.getElementById('btn-mobile');
const navMenu = document.getElementById('nav-menu');

btnMobile.addEventListener('click', () => {
    navMenu.classList.toggle('aberto');
});

// Fecha o menu mobile ao clicar em qualquer link
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('aberto');
    });
});

// 2. Sistema de Abas (Tabs) de Especialidades
const botoesTab = document.querySelectorAll('.tab-btn');
const paineisTab = document.querySelectorAll('.tab-painel');

botoesTab.forEach(botao => {
    botao.addEventListener('click', () => {
        // Remove a classe 'ativo' de todos os botões e painéis
        botoesTab.forEach(btn => btn.classList.remove('ativo'));
        paineisTab.forEach(painel => painel.classList.remove('ativo'));

        // Ativa o botão clicado
        botao.classList.add('ativo');

        // Pega o ID alvo pelo atributo data-alvo e mostra o painel correspondente
        const alvoId = botao.getAttribute('data-alvo');
        document.getElementById(alvoId).classList.add('ativo');
    });
});

// 3. Simulador de Economia de Energia Solar
const sliderConta = document.getElementById('valor-conta');
const displayConta = document.getElementById('display-conta');
const displayMensal = document.getElementById('economia-mensal');
const displayAnual = document.getElementById('economia-anual');
const btnSimulacao = document.getElementById('btn-enviar-simulacao');

// Função para formatar números em Real Brasileiro (R$)
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

sliderConta.addEventListener('input', () => {
    const valorAtual = Number(sliderConta.value);
    
    // Considera uma economia média realista de 90% na fatura
    const economiaMes = valorAtual * 0.90;
    const economiaAno = economiaMes * 12;

    // Atualiza os textos na tela
    displayConta.textContent = formatarMoeda(valorAtual);
    displayMensal.textContent = formatarMoeda(economiaMes);
    displayAnual.textContent = formatarMoeda(economiaAno);

    // Atualiza dinamicamente o link do WhatsApp com os valores simulados
    const mensagem = `Olá! Fiz uma simulação no site da LS Rodrigues. Minha conta é de ${formatarMoeda(valorAtual)}/mês e vi que posso economizar cerca de ${formatarMoeda(economiaAnual)} por ano. Gostaria de um orçamento!`;
    btnSimulacao.href = `https://wa.me/5527995207409?text=${encodeURIComponent(mensagem)}`;
});