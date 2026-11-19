// 1. Menu Mobile
const btnMobile = document.getElementById('btn-mobile');
const navMenu = document.getElementById('nav-menu');

btnMobile.addEventListener('click', () => {
    navMenu.classList.toggle('aberto');
});

document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('aberto'));
});

// 2. Filtro da Galeria de Obras por Área
const botoesFiltro = document.querySelectorAll('.filtro-btn');
const cardsFoto = document.querySelectorAll('.card-foto');

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
        botao.classList.add('ativo');

        const categoria = botao.getAttribute('data-filtro');

        cardsFoto.forEach(card => {
            if (categoria === 'todos' || card.getAttribute('data-categoria') === categoria) {
                card.classList.remove('oculto');
            } else {
                card.classList.add('oculto');
            }
        });
    });
});

// 3. Simulador de Economia Solar
const sliderConta = document.getElementById('valor-conta');
const displayConta = document.getElementById('display-conta');
const displayMensal = document.getElementById('economia-mensal');
const displayAnual = document.getElementById('economia-anual');
const btnExportarSimulacao = document.getElementById('btn-exportar-simulacao');

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarSimulador() {
    const valor = Number(sliderConta.value);
    const econMes = valor * 0.90;
    const econAno = econMes * 12;

    displayConta.textContent = formatarMoeda(valor);
    displayMensal.textContent = formatarMoeda(econMes);
    displayAnual.textContent = formatarMoeda(econAno);
}

sliderConta.addEventListener('input', atualizarSimulador);
atualizarSimulador();

// 4. Seleção Automática de Serviço ao clicar nos Cards ou Portal
const selectServico = document.getElementById('tipo-servico');
const campoDetalhes = document.getElementById('detalhes-projeto');

document.querySelectorAll('[data-servico]').forEach(item => {
    item.addEventListener('click', () => {
        const servico = item.getAttribute('data-servico');
        if (servico) {
            selectServico.value = servico;
        }
    });
});

btnExportarSimulacao.addEventListener('click', () => {
    selectServico.value = "Energia Solar (Projeto / Instalação)";
    campoDetalhes.value = `Simulação no site: Conta média de ${displayConta.textContent}/mês (Economia estimada de ${displayMensal.textContent}/mês).`;
});

// 5. Envio Estruturado para WhatsApp com Protocolo
const formOrcamento = document.getElementById('form-orcamento');
const inputData = document.getElementById('data-visita');

const hoje = new Date().toISOString().split('T')[0];
inputData.setAttribute('min', hoje);

formOrcamento.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome-cliente').value.trim();
    const servico = selectServico.value;
    const endereco = document.getElementById('endereco-cliente').value.trim();
    const imovel = document.getElementById('tipo-imovel').value;
    const dataBruta = inputData.value;
    const turno = document.getElementById('turno-visita').value;
    const detalhes = campoDetalhes.value.trim();

    const [ano, mes, dia] = dataBruta.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const protocolo = `LSR-${ano}-${Math.floor(1000 + Math.random() * 9000)}`;

    let mensagem = `*SOLICITAÇÃO DE ORÇAMENTO — ${protocolo}*\n\n`;
    mensagem += `*Cliente:* ${nome}\n`;
    mensagem += `*Serviço:* ${servico}\n`;
    mensagem += `*Imóvel:* ${imovel}\n`;
    mensagem += `*Local:* ${endereco}\n`;
    mensagem += `*Data Preferencial:* ${dataFormatada} (${turno})\n`;

    if (detalhes) {
        mensagem += `*Observações:* ${detalhes}\n`;
    }

    const telefone = "5527995207409";
    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, '_blank');
});