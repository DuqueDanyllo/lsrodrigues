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
        botoesTab.forEach(btn => btn.classList.remove('ativo'));
        paineisTab.forEach(painel => painel.classList.remove('ativo'));

        botao.classList.add('ativo');

        const alvoId = botao.getAttribute('data-alvo');
        document.getElementById(alvoId).classList.add('ativo');
    });
});

// 3. Simulador de Economia de Energia Solar
const sliderConta = document.getElementById('valor-conta');
const displayConta = document.getElementById('display-conta');
const displayMensal = document.getElementById('economia-mensal');
const displayAnual = document.getElementById('economia-anual');

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

sliderConta.addEventListener('input', () => {
    const valorAtual = Number(sliderConta.value);
    
    const economiaMes = valorAtual * 0.90;
    const economiaAno = economiaMes * 12;

    displayConta.textContent = formatarMoeda(valorAtual);
    displayMensal.textContent = formatarMoeda(economiaMes);
    displayAnual.textContent = formatarMoeda(economiaAno);
});

// 4. Formulário de Agendamento de Visita e Orçamento
const formOrcamento = document.getElementById('form-orcamento');
const inputDataVisita = document.getElementById('data-visita');

// Bloqueia datas anteriores a hoje no calendário
const hoje = new Date().toISOString().split('T')[0];
inputDataVisita.setAttribute('min', hoje);

formOrcamento.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nome = document.getElementById('nome-cliente').value.trim();
    const servico = document.getElementById('tipo-servico').value;
    const endereco = document.getElementById('endereco-cliente').value.trim();
    const dataBruta = document.getElementById('data-visita').value;
    const turno = document.getElementById('turno-visita').value;
    const imovel = document.getElementById('tipo-imovel').value;
    const detalhes = document.getElementById('detalhes-projeto').value.trim();

    // Converte data de YYYY-MM-DD para DD/MM/YYYY
    const [ano, mes, dia] = dataBruta.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Monta a mensagem para o WhatsApp
    let textoWhatsApp = `*SOLICITAÇÃO DE ORÇAMENTO / VISITA TÉCNICA*\n\n`;
    textoWhatsApp += `*Cliente:* ${nome}\n`;
    textoWhatsApp += `*Serviço:* ${servico}\n`;
    textoWhatsApp += `*Imóvel:* ${imovel}\n`;
    textoWhatsApp += `*Endereço:* ${endereco}\n`;
    textoWhatsApp += `*Data sugerida:* ${dataFormatada} (${turno})\n`;

    if (detalhes !== "") {
        textoWhatsApp += `*Detalhes:* ${detalhes}\n`;
    }

    const telefoneEmpresa = "5527995207409";
    const urlWhatsApp = `https://wa.me/${telefoneEmpresa}?text=${encodeURIComponent(textoWhatsApp)}`;

    window.open(urlWhatsApp, '_blank');
});