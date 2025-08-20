document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // FUNÇÕES GLOBAIS DE CÁLCULO E ATUALIZAÇÃO
    // =======================================================

    const carrinhoContador = document.getElementById('carrinho-contador');
    const formatarMoeda = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;
    let valorFrete = 0;

    const calcularTotais = () => {
        const produtos = document.querySelectorAll('#lista-carrinho .produto');
        let subtotal = 0;
        
        produtos.forEach(produto => {
            const precoUnitario = parseFloat(produto.dataset.preco);
            const quantidade = parseInt(produto.querySelector('.quantidade-valor').textContent);
            const totalItem = precoUnitario * quantidade;
            subtotal += totalItem;
            
            const itemTotalEl = produto.querySelector('.item-total');
            if(itemTotalEl) itemTotalEl.textContent = formatarMoeda(totalItem);
        });

        const subtotalSpan = document.querySelector('#subtotal-valor');
        const totalSpan = document.querySelector('#total-valor');
        
        if (subtotalSpan) subtotalSpan.textContent = formatarMoeda(subtotal);
        if (totalSpan) totalSpan.textContent = formatarMoeda(subtotal + valorFrete);
    };

    const atualizarContador = () => {
        const produtos = document.querySelectorAll('#lista-carrinho .produto');
        let totalItens = 0;
        produtos.forEach(produto => {
            const quantidade = parseInt(produto.querySelector('.quantidade-valor').textContent);
            totalItens += quantidade;
        });
        if (carrinhoContador) {
            carrinhoContador.textContent = totalItens;
            carrinhoContador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    };

    // =======================================================
    // LÓGICA ESPECÍFICA DA PÁGINA DO CARRINHO
    // =======================================================
    
    if (document.body.classList.contains('pagina-carrinho')) {
        
        const listaCarrinho = document.getElementById('lista-carrinho');
        const btnLimpar = document.getElementById('limpar-carrinho');
        const btnFinalizarCompra = document.getElementById('btn-finalizar');
        const btnCalcularFrete = document.getElementById('btn-frete');
        const inputCep = document.getElementById('cep');
        const resultadoFreteEl = document.getElementById('resultado-frete');
        const valorFreteEl = document.getElementById('valor-frete');

        let cepCalculado = false; 

        const atualizarVisibilidade = () => {
            const temItens = document.querySelectorAll('#lista-carrinho .produto').length > 0;
            const carrinhoVazioMsg = document.getElementById('carrinho-vazio');
            const limparContainer = document.querySelector('.btn-limpar-container');
            const resumoContainer = document.querySelector('.carrinho-resumo');

            if (carrinhoVazioMsg) carrinhoVazioMsg.style.display = temItens ? 'none' : 'block';
            if (limparContainer) limparContainer.style.display = temItens ? 'flex' : 'none';
            if (resumoContainer) resumoContainer.style.display = temItens ? 'block' : 'none';
        };

        if (listaCarrinho) {
            listaCarrinho.addEventListener('click', (e) => {
                const target = e.target;
                const produtoDiv = target.closest('.produto');
                if (!produtoDiv) return;
                
                const quantidadeSpan = produtoDiv.querySelector('.quantidade-valor');
                if (!quantidadeSpan) return;

                let quantidade = parseInt(quantidadeSpan.textContent);
                
                if (target.dataset.acao === 'aumentar') {
                    quantidade++;
                } else if (target.dataset.acao === 'diminuir') {
                    if (quantidade > 1) {
                        quantidade--;
                    }
                } else if (target.classList.contains('btn-remover')) {
                    if (confirm("Deseja remover este item do carrinho?")) {
                        produtoDiv.remove();
                    }
                }
                
                quantidadeSpan.textContent = quantidade;
                
                calcularTotais();
                atualizarContador();
                atualizarVisibilidade();
            });
        }

        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                if (confirm("Tem certeza que deseja limpar o carrinho?")) {
                    listaCarrinho.innerHTML = '';
                    valorFrete = 0;
                    cepCalculado = false;
                    if (valorFreteEl) valorFreteEl.textContent = formatarMoeda(0);
                    if (inputCep) inputCep.value = '';
                    if (resultadoFreteEl) resultadoFreteEl.textContent = '';
                    
                    calcularTotais();
                    atualizarContador();
                    atualizarVisibilidade();
                }
            });
        }
        
        if (btnCalcularFrete && inputCep) {
            btnCalcularFrete.addEventListener('click', async () => {
                const cep = inputCep.value.replace(/\D/g, '');
                if (cep.length !== 8) {
                    alert('Por favor, digite um CEP válido com 8 números.');
                    return;
                }

                btnCalcularFrete.textContent = 'Calculando...';
                btnCalcularFrete.disabled = true;
                resultadoFreteEl.textContent = '';

                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();

                    if (data.erro) {
                        resultadoFreteEl.textContent = 'CEP não encontrado.';
                        cepCalculado = false;
                        valorFrete = 0;
                    } 
                    else if (data.uf === 'SP') {
                        valorFrete = 8.00;
                        cepCalculado = true;
                        valorFreteEl.textContent = formatarMoeda(valorFrete);
                        resultadoFreteEl.textContent = `Entrega para ${data.localidade} - SP: ${formatarMoeda(valorFrete)}`;
                    } else {
                        valorFrete = 0;
                        cepCalculado = false;
                        resultadoFreteEl.textContent = `Desculpe, não entregamos em ${data.uf}.`;
                    }
                } catch (error) {
                    resultadoFreteEl.textContent = 'Não foi possível calcular o frete.';
                    cepCalculado = false;
                    valorFrete = 0;
                    console.error("Erro ao buscar CEP:", error);
                } finally {
                    btnCalcularFrete.textContent = 'Calcular';
                    btnCalcularFrete.disabled = false;
                    calcularTotais();
                }
            });

            inputCep.addEventListener('input', (e) => {
                let valor = e.target.value.replace(/\D/g, '').substring(0, 8);
                valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = valor;

                cepCalculado = false; 
                valorFrete = 0;
                if (valorFreteEl) valorFreteEl.textContent = formatarMoeda(0);
                if (resultadoFreteEl) resultadoFreteEl.textContent = '';
                calcularTotais();
            });
        }

        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', () => {
                if (listaCarrinho.children.length === 0) {
                    alert('Seu carrinho está vazio.');
                    return;
                }
                if (!cepCalculado) {
                    alert('Por favor, calcule um frete válido para finalizar a compra.');
                    return;
                }
                alert('Compra realizada com sucesso!');
            });
        }
        
        atualizarVisibilidade();
        calcularTotais();
        atualizarContador();
    }

    // =======================================================
    // LÓGICA PARA OUTRAS PÁGINAS (BOTÃO "VER DETALHES")
    // =======================================================

    const botoesDetalhes = document.querySelectorAll('.btn-detalhes');
    if (botoesDetalhes.length > 0) {
        botoesDetalhes.forEach(botao => {
            botao.addEventListener('click', function() {
                const detalhesDiv = this.nextElementSibling;
                if (detalhesDiv) {
                    detalhesDiv.classList.toggle('ativo');
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
    // ATIVIDADE 4: NAVEGAÇÃO POR PRODUTOS COM SETAS DO TECLADO
    // =======================================================

    const produtosNavegaveis = document.querySelectorAll('#NossosProdutos .card');
    let focoAtual = -1; // -1 significa que nenhum produto está em foco

    if (produtosNavegaveis.length > 0) {
        // Função para atualizar qual card tem o foco visual
        const atualizarFocoVisual = () => {
            produtosNavegaveis.forEach((produto, index) => {
                if (index === focoAtual) {
                    produto.classList.add('produto-foco');
                    // Rola a página para que o item focado fique visível
                    produto.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    produto.classList.remove('produto-foco');
                }
            });
        };

        // Escuta os eventos de teclado na página inteira
        document.addEventListener('keydown', (e) => {
            // Navegação com seta para a direita
            if (e.key === 'ArrowRight') {
                e.preventDefault(); // Impede a rolagem padrão da página
                focoAtual++;
                if (focoAtual >= produtosNavegaveis.length) {
                    focoAtual = 0; // Volta para o primeiro
                }
                atualizarFocoVisual();
            }
            // Navegação com seta para a esquerda
            else if (e.key === 'ArrowLeft') {
                e.preventDefault(); // Impede a rolagem padrão da página
                focoAtual--;
                if (focoAtual < 0) {
                    focoAtual = produtosNavegaveis.length - 1; // Vai para o último
                }
                atualizarFocoVisual();
            }
        });
    }

}); // Fim do 'DOMContentLoaded'