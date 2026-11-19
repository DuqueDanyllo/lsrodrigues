document.addEventListener("DOMContentLoaded", () => {
    // Menu mobile
    const btnMobile = document.getElementById("btn-mobile");
    const navMenu = document.getElementById("nav-menu");

    if (btnMobile && navMenu) {
        btnMobile.addEventListener("click", () => {
            navMenu.classList.toggle("aberto");
        });

        navMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("aberto");
            });
        });
    }

    // Evita ícone de imagem quebrada enquanto as mídias de automação não sobem
        document.querySelectorAll(".carrossel-slide img").forEach((img) => {
            img.addEventListener("error", () => {
                const box = img.closest(".midia-box");
                if (box && !box.querySelector(".placeholder-midia")) {
                    img.style.display = "none";
                    const aviso = document.createElement("div");
                    aviso.className = "placeholder-midia";
                    aviso.innerHTML = `
                        <strong>Mídia em breve</strong>
                        <span>Caminho configurado: <code>${img.getAttribute("src")}</code></span>
                    `;
                    box.appendChild(aviso);
                }
            });
        });

    // Troca de abas do carrossel (sem opção "Todos")
    const abasBtns = document.querySelectorAll(".filtros-galeria .filtro-btn");
    const paineis = document.querySelectorAll(".carrossel-painel");

    abasBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const area = btn.getAttribute("data-area");

            abasBtns.forEach((b) => b.classList.remove("ativo"));
            btn.classList.add("ativo");

            paineis.forEach((painel) => {
                const ehArea = painel.getAttribute("data-area") === area;
                painel.classList.toggle("ativo", ehArea);
                if (!ehArea) {
                    painel.querySelectorAll("video").forEach((vid) => vid.pause());
                }
            });
        });
    });

    // Controle dos carrosseis de cada área
    const estadoCarrosseis = {};

    paineis.forEach((painel) => {
        const area = painel.getAttribute("data-area");
        const track = painel.querySelector(".carrossel-track");
        const slides = painel.querySelectorAll(".carrossel-slide");
        const contador = painel.querySelector(".carrossel-contador");
        const dotsContainer = painel.querySelector(".carrossel-dots");

        estadoCarrosseis[area] = {
            indice: 0,
            total: slides.length,
            track,
            slides,
            contador,
            dots: []
        };

        if (dotsContainer) {
            dotsContainer.innerHTML = "";
            slides.forEach((_, idx) => {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "carrossel-dot" + (idx === 0 ? " ativo" : "");
                dot.setAttribute("aria-label", `Ir para item ${idx + 1}`);
                dot.addEventListener("click", () => irParaSlide(area, idx));
                dotsContainer.appendChild(dot);
                estadoCarrosseis[area].dots.push(dot);
            });
        }

        atualizarCarrossel(area);
    });

    function pausarVideosForaDoSlide(area, indiceAtivo) {
        const dados = estadoCarrosseis[area];
        if (!dados) return;
        dados.slides.forEach((slide, idx) => {
            if (idx !== indiceAtivo) {
                slide.querySelectorAll("video").forEach((vid) => vid.pause());
            }
        });
    }

    function atualizarCarrossel(area) {
        const dados = estadoCarrosseis[area];
        if (!dados || dados.total === 0) return;

        dados.track.style.transform = `translateX(-${dados.indice * 100}%)`;

        if (dados.contador) {
            dados.contador.textContent = `Item ${dados.indice + 1} de ${dados.total}`;
        }

        dados.dots.forEach((dot, idx) => {
            dot.classList.toggle("ativo", idx === dados.indice);
        });

        pausarVideosForaDoSlide(area, dados.indice);
    }

    function irParaSlide(area, novoIndice) {
        const dados = estadoCarrosseis[area];
        if (!dados || dados.total === 0) return;

        if (novoIndice < 0) {
            dados.indice = dados.total - 1;
        } else if (novoIndice >= dados.total) {
            dados.indice = 0;
        } else {
            dados.indice = novoIndice;
        }

        atualizarCarrossel(area);
    }

    document.querySelectorAll(".carrossel-seta").forEach((seta) => {
        seta.addEventListener("click", () => {
            const area = seta.getAttribute("data-target");
            const dados = estadoCarrosseis[area];
            if (!dados) return;

            if (seta.classList.contains("prev")) {
                irParaSlide(area, dados.indice - 1);
            } else {
                irParaSlide(area, dados.indice + 1);
            }
        });
    });

    // Simulador solar
    const sliderConta = document.getElementById("valor-conta");
    const displayConta = document.getElementById("display-conta");
    const economiaMensal = document.getElementById("economia-mensal");
    const economiaAnual = document.getElementById("economia-anual");
    const btnExportarSimulacao = document.getElementById("btn-exportar-simulacao");
    const detalhesProjeto = document.getElementById("detalhes-projeto");
    const selectServico = document.getElementById("tipo-servico");

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function atualizarSimulador() {
        if (!sliderConta) return;
        const conta = Number(sliderConta.value);
        const mensal = conta * 0.9;
        const anual = mensal * 12;

        if (displayConta) displayConta.textContent = formatarMoeda(conta);
        if (economiaMensal) economiaMensal.textContent = formatarMoeda(mensal);
        if (economiaAnual) economiaAnual.textContent = formatarMoeda(anual);
    }

    if (sliderConta) {
        sliderConta.addEventListener("input", atualizarSimulador);
        atualizarSimulador();
    }

    if (btnExportarSimulacao && sliderConta) {
        btnExportarSimulacao.addEventListener("click", () => {
            const conta = Number(sliderConta.value);
            const mensal = conta * 0.9;
            const anual = mensal * 12;

            if (selectServico) {
                selectServico.value = "Energia Solar (Projeto / Instalação)";
            }

            if (detalhesProjeto) {
                detalhesProjeto.value = `Simulação Solar: fatura média de ${formatarMoeda(conta)}, economia mensal estimada de ${formatarMoeda(mensal)} e economia anual estimada de ${formatarMoeda(anual)}.`;
            }
        });
    }

    // Preenchimento automático da especialidade via links de acesso rápido / cards
    document.querySelectorAll("[data-servico]").forEach((gatilho) => {
        gatilho.addEventListener("click", () => {
            const servico = gatilho.getAttribute("data-servico");
            if (selectServico && servico) {
                const existeOpcao = Array.from(selectServico.options).some(
                    (opt) => opt.value === servico
                );
                if (existeOpcao) {
                    selectServico.value = servico;
                }
            }
        });
    });

    // Envio estruturado para o WhatsApp
    const formOrcamento = document.getElementById("form-orcamento");

    if (formOrcamento) {
        formOrcamento.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("nome-cliente")?.value.trim() || "";
            const servico = document.getElementById("tipo-servico")?.value || "";
            const endereco = document.getElementById("endereco-cliente")?.value.trim() || "";
            const imovel = document.getElementById("tipo-imovel")?.value || "";
            const dataVisita = document.getElementById("data-visita")?.value || "";
            const turno = document.getElementById("turno-visita")?.value || "";
            const detalhes = document.getElementById("detalhes-projeto")?.value.trim() || "Não informado";

            const mensagem = [
                "Olá! Gostaria de solicitar um orçamento / visita técnica:",
                `• *Nome/Empresa:* ${nome}`,
                `• *Especialidade:* ${servico}`,
                `• *Localidade:* ${endereco}`,
                `• *Tipo de Imóvel:* ${imovel}`,
                `• *Data Preferencial:* ${dataVisita}`,
                `• *Turno:* ${turno}`,
                `• *Detalhes:* ${detalhes}`
            ].join("\n");

            const numeroWhatsApp = "5527996393464";
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, "_blank");
        });
    }

    // Ano dinâmico no rodapé
    const anoAtual = document.getElementById("ano-atual");
    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }
});