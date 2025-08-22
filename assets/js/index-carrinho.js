document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // LÓGICA DO MENU HAMBÚRGUER
    // =======================================================
    
    const btnMobile = document.getElementById('btn-mobile');
    const nav = document.getElementById('nav');

    if (btnMobile && nav) {
        btnMobile.addEventListener('click', () => {
            nav.classList.toggle('ativo');
            const menuAtivo = nav.classList.contains('ativo');
            btnMobile.setAttribute('aria-expanded', menuAtivo);
            if (menuAtivo) {
                btnMobile.setAttribute('aria-label', 'Fechar Menu');
            } else {
                btnMobile.setAttribute('aria-label', 'Abrir Menu');
            }
        });
    }

    // =======================================================
    // LÓGICA DA PÁGINA DO CARRINHO
    // =======================================================

    if (document.body.classList.contains('pagina-carrinho')) {
        
        const listaCarrinho = document.getElementById('lista-carrinho');
        const btnLimpar = document.getElementById('limpar-carrinho');
        const btnFinalizarCompra = document.getElementById('btn-finalizar');
        const btnCalcularFrete = document.getElementById('btn-frete');
        const inputCep = document.getElementById('cep');
        const resultadoFreteEl = document.getElementById('resultado-frete');
        const valorFreteEl = document.getElementById('valor-frete');
        const carrinhoContadorHeader = document.getElementById('carrinho-contador');
        
        let valorFrete = 0;
        let cepCalculado = false;
        const formatarMoeda = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

        const calcularTotais = () => {
            const produtos = document.querySelectorAll('#lista-carrinho .produto');
            let subtotal = 0;
            produtos.forEach(produto => {
                const precoUnitario = parseFloat(produto.dataset.preco);
                const quantidade = parseInt(produto.querySelector('.quantidade-valor').textContent);
                subtotal += precoUnitario * quantidade;
                produto.querySelector('.item-total').textContent = formatarMoeda(precoUnitario * quantidade);
            });
            document.querySelector('#subtotal-valor').textContent = formatarMoeda(subtotal);
            document.querySelector('#total-valor').textContent = formatarMoeda(subtotal + valorFrete);
        };

        const atualizarContadorHeader = () => {
            const produtos = document.querySelectorAll('#lista-carrinho .produto');
            let totalItens = 0;
            produtos.forEach(produto => {
                totalItens += parseInt(produto.querySelector('.quantidade-valor').textContent);
            });
            if (carrinhoContadorHeader) {
                carrinhoContadorHeader.textContent = totalItens;
                carrinhoContadorHeader.style.display = totalItens > 0 ? 'flex' : 'none';
            }
        };

        const atualizarVisibilidadeCarrinho = () => {
            const temItens = document.querySelectorAll('#lista-carrinho .produto').length > 0;
            document.getElementById('carrinho-vazio').style.display = temItens ? 'none' : 'block';
            document.querySelector('.btn-limpar-container').style.display = temItens ? 'flex' : 'none';
            document.querySelector('.carrinho-resumo').style.display = temItens ? 'block' : 'none';
        };

        const atualizarEstadoCarrinho = () => {
            calcularTotais();
            atualizarContadorHeader();
            atualizarVisibilidadeCarrinho();
        };

        const resetarCarrinhoCompleto = () => {
            if(listaCarrinho) listaCarrinho.innerHTML = '';
            valorFrete = 0;
            cepCalculado = false;
            if (valorFreteEl) valorFreteEl.textContent = formatarMoeda(0);
            if (inputCep) inputCep.value = '';
            if (resultadoFreteEl) resultadoFreteEl.textContent = '';
            atualizarEstadoCarrinho();
        };

        if (listaCarrinho) {
            listaCarrinho.addEventListener('click', (e) => {
                const target = e.target;
                const produtoDiv = target.closest('.produto');
                if (!produtoDiv) return;
                
                const quantidadeSpan = produtoDiv.querySelector('.quantidade-valor');
                let quantidade = parseInt(quantidadeSpan.textContent);
                
                if (target.dataset.acao === 'aumentar') {
                    quantidade++;
                } else if (target.dataset.acao === 'diminuir') {
                    quantidade--;
                    if (quantidade === 0) {
                        if (confirm("Deseja remover este item do carrinho?")) {
                            produtoDiv.remove();
                        } else {
                            quantidade = 1;
                        }
                    }
                } else if (target.classList.contains('btn-remover')) {
                    if (confirm("Deseja remover este item do carrinho?")) {
                        produtoDiv.remove();
                    }
                }
                
                if (quantidadeSpan) quantidadeSpan.textContent = quantidade;
                atualizarEstadoCarrinho();
            });
        }

        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                if (confirm("Tem certeza que deseja limpar o carrinho?")) {
                    resetarCarrinhoCompleto();
                }
            });
        }
        
        if (btnCalcularFrete) {
            btnCalcularFrete.addEventListener('click', async () => {
                const cep = inputCep.value.replace(/\D/g, '');
                if (cep.length !== 8) return alert('Por favor, digite um CEP válido.');
                
                btnCalcularFrete.textContent = 'Calculando...';
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    if (data.erro) throw new Error('CEP não encontrado.');
                    
                    // LÓGICA DE ENTREGA RESTRITA À CIDADE DE SÃO PAULO
                    if (data.uf === 'SP' && data.localidade === 'São Paulo') {
                        valorFrete = 8.00;
                        cepCalculado = true;
                        valorFreteEl.textContent = formatarMoeda(valorFrete);
                        resultadoFreteEl.textContent = `Entrega para São Paulo - SP: ${formatarMoeda(valorFrete)}`;
                    } else if (data.uf === 'SP') {
                        valorFrete = 0;
                        cepCalculado = false;
                        resultadoFreteEl.textContent = `Desculpe, no momento entregamos apenas na cidade de São Paulo.`;
                    } else {
                        valorFrete = 0;
                        cepCalculado = false;
                        resultadoFreteEl.textContent = `Desculpe, não realizamos entregas para o estado de ${data.uf}.`;
                    }
                } catch (error) {
                    resultadoFreteEl.textContent = 'Não foi possível calcular o frete.';
                    console.error("Erro ao buscar CEP:", error);
                } finally {
                    btnCalcularFrete.textContent = 'Calcular';
                    calcularTotais();
                }
            });
        }

        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', () => {
                if (!listaCarrinho || listaCarrinho.children.length === 0) return alert('Seu carrinho está vazio.');
                if (!cepCalculado) return alert('Por favor, calcule um frete válido para finalizar a compra.');
                
                // LÓGICA DE FINALIZAR COMPRA E RECARREGAR A PÁGINA
                alert('Compra realizada com sucesso! Agradecemos a sua preferência.');
                window.location.reload(); // Recarrega a página para limpar tudo
            });
        }
        
        atualizarEstadoCarrinho();
    }
});

// Conteúdo para o seu arquivo JS principal (ex: /assets/main.js)

document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // LÓGICA DO MENU HAMBÚRGUER
    // =======================================================
    
    const btnMobile = document.getElementById('btn-mobile');
    const nav = document.getElementById('nav');

    if (btnMobile && nav) {
        btnMobile.addEventListener('click', () => {
            nav.classList.toggle('ativo');
            const menuAtivo = nav.classList.contains('ativo');
            btnMobile.setAttribute('aria-expanded', menuAtivo);
            if (menuAtivo) {
                btnMobile.setAttribute('aria-label', 'Fechar Menu');
            } else {
                btnMobile.setAttribute('aria-label', 'Abrir Menu');
            }
        });
    }

    // =======================================================
    // LÓGICA DA PÁGINA DO CARRINHO (só executa na pág. do carrinho)
    // =======================================================

    if (document.body.classList.contains('pagina-carrinho')) {
        // ... (toda a lógica do carrinho que já fizemos)
        // Se precisar, posso reenviar essa parte, mas o importante é que ela esteja aqui dentro.
    }

    // =======================================================
    // LÓGICA DO BOTÃO "VER DETALHES" (para a página inicial)
    // =======================================================

    const botoesDetalhes = document.querySelectorAll('.btn-detalhes');
    if (botoesDetalhes.length > 0) {
        botoesDetalhes.forEach(botao => {
            botao.addEventListener('click', function() {
                // this.nextElementSibling se refere ao próximo elemento "irmão" do botão
                const detalhesDiv = this.nextElementSibling; 
                
                // Verifica se o próximo elemento realmente é a div de detalhes
                if (detalhesDiv && detalhesDiv.classList.contains('detalhes-produto')) {
                    detalhesDiv.classList.toggle('ativo'); // Adiciona/remove a classe .ativo
                    
                    // Muda o texto do botão
                    if (detalhesDiv.classList.contains('ativo')) {
                        this.textContent = 'Ocultar Detalhes';
                    } else {
                        this.textContent = 'Ver Detalhes';
                    }
                }
            });
        });
    }

    // =======================================================
    // NAVEGAÇÃO POR PRODUTOS COM SETAS DO TECLADO (para a página inicial)
    // =======================================================

    const produtosNavegaveis = document.querySelectorAll('#NossosProdutos .card');
    let focoAtual = -1; // -1 significa que nenhum produto está em foco

    if (produtosNavegaveis.length > 0) {
        const atualizarFocoVisual = () => {
            produtosNavegaveis.forEach((produto, index) => {
                if (index === focoAtual) {
                    produto.classList.add('produto-foco');
                    produto.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    produto.classList.remove('produto-foco');
                }
            });
        };

        document.addEventListener('keydown', (e) => {
            // Verifica se a tecla pressionada é a seta da direita ou esquerda
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault(); // Impede a rolagem padrão da página

                if (e.key === 'ArrowRight') {
                    focoAtual++;
                    if (focoAtual >= produtosNavegaveis.length) {
                        focoAtual = 0; // Volta para o primeiro
                    }
                } else if (e.key === 'ArrowLeft') {
                    focoAtual--;
                    if (focoAtual < 0) {
                        focoAtual = produtosNavegaveis.length - 1; // Vai para o último
                    }
                }
                atualizarFocoVisual();
            }
        });
    }
    
    // ... (aqui entram outras lógicas globais ou de outras páginas, como a do formulário de contato, etc.)

});