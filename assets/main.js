// Lista simples de clientes frequentes
const clientesFrequentes = [
  { id: 1, nome: "João Silva", telefone: "(11) 98765-4321" },
  { id: 2, nome: "Maria Souza", telefone: "(11) 91234-5678" },
];

console.log("--- Lista de Clientes Frequentes ---");
clientesFrequentes.forEach((cliente) => {
  console.log(
    `ID: ${cliente.id} | Nome: ${cliente.nome} | Telefone: ${cliente.telefone}`
  );
});
console.log("---------------------------------------");

const cliente1 = {
  nome: "Amanda Oliveira",
  endereco: "Av. Brasil, 456 - São Paulo/SP",
  telefone: "(21) 90000-5555",
  pontosFidelidade: 0,
};

// Formatar nome do cliente
const nomeFormatado =
  cliente1.nome.charAt(0).toUpperCase() + cliente1.nome.slice(1);

// Saudação
let saudacaoPersonalizada = `Olá, ${nomeFormatado}! Bem-vindo(a) à nossa loja.`;

// Verificar se o cliente é frequente e adicionar mensagem
const isClienteFrequente = clientesFrequentes.some(
  (cliente) => cliente.nome === cliente1.nome
);
if (isClienteFrequente) {
  saudacaoPersonalizada += " É ótimo ter você de volta!";
}

console.log(saudacaoPersonalizada);
console.log("---------------------------------------");

// Data do pedido
const dataPedido = new Date();
const dataHoraFormatada = dataPedido.toLocaleString("pt-BR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
console.log(`Pedido realizado em: ${dataHoraFormatada}`);
console.log("---------------------------------------");

console.log(`Nome: ${cliente1.nome}`);
console.log(`Endereço: ${cliente1.endereco}`);
console.log(`Telefone: ${cliente1.telefone}`);

// ---------------------------
// Produtos disponíveis
const produtos = [
  { codigo: "PAO001", nome: "Pão Francês", preco: 1.0, estoque: 80 },
  { codigo: "TOR002", nome: "Torta de Frango", preco: 20.0, estoque: 100 },
  { codigo: "BOL003", nome: "Bolo de Chocolate", preco: 5.0, estoque: 100 },
  { codigo: "BEB004", nome: "Café com Leite", preco: 2.0, estoque: 100 },
  { codigo: "BEB005", nome: "Suco de Laranja", preco: 4.0, estoque: 100 },
];

console.log("---------------------------------------");

// Filtra apenas os produtos com estoque
const produtosEmEstoque = produtos.filter((p) => p.estoque > 0);

console.log("Produtos disponíveis:");
produtosEmEstoque.forEach((p) => {
  console.log(`${p.nome} - R$ ${p.preco.toFixed(2)} (Estoque: ${p.estoque})`);
});
console.log("---------------------------------------");

// ---------------------------
// Carrinho de compras
let carrinho = [];
const historicoPedidos = [];
const vendasPorProduto = {}; // Objeto para rastrear a quantidade vendida de cada produto

const formatarMoeda = (valor) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const adicionarAoCarrinho = (codigo, quantidade) => {
  const produto = produtos.find((p) => p.codigo === codigo);
  if (!produto) {
    console.log("Produto não encontrado!");
    return;
  }
  if (produto.estoque < quantidade) {
    console.log(`Estoque insuficiente para ${produto.nome}.`);
    return;
  }
  carrinho.push({ produto: produto.nome, preco: produto.preco, quantidade });
  produto.estoque -= quantidade;
  console.log(`${quantidade}x ${produto.nome} adicionado(s) ao carrinho.`);
};

const removerDoCarrinho = (nomeProduto) => {
  const index = carrinho.findIndex((item) => item.produto === nomeProduto);
  if (index !== -1) {
    const item = carrinho[index];
    const produtoOriginal = produtos.find((p) => p.nome === item.produto);
    produtoOriginal.estoque += item.quantidade; // devolve ao estoque
    carrinho.splice(index, 1);
    console.log(`${item.produto} removido do carrinho.`);
  } else {
    console.log("Produto não encontrado no carrinho.");
  }
};

// A função `finalizarCompra` agora lida com todos os cálculos
const finalizarCompra = (valorPago) => {
  if (carrinho.length === 0) {
    console.log("Carrinho vazio. Não é possível finalizar a compra.");
    return;
  }

  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  const quantidadeTotal = carrinho.reduce(
    (acc, item) => acc + item.quantidade,
    0
  );

  let desconto = 0;
  if (quantidadeTotal >= 10) desconto = 0.15;
  else if (quantidadeTotal >= 5) desconto = 0.1;
  else if (quantidadeTotal >= 3) desconto = 0.03;

  const valorComDesconto = subtotal * (1 - desconto);
  const imposto = valorComDesconto * 0.05;
  const taxaEntrega = 5.0;
  const total = valorComDesconto + imposto + taxaEntrega;
  const troco = valorPago - total;
  const pontos = Math.floor(valorComDesconto);

  cliente1.pontosFidelidade += pontos;

  const cotacaoEuro = 0.18;
  const totalEmEuro = total * cotacaoEuro;

  console.log("---------------------------------------");
  console.log("Detalhes do Pedido:");
  carrinho.forEach((item) => {
    console.log(
      `${item.quantidade}x ${item.produto} - ${formatarMoeda(
        item.preco * item.quantidade
      )}`
    );

    // Atualiza o contador de vendas para o ranking
    if (vendasPorProduto[item.produto]) {
      vendasPorProduto[item.produto] += item.quantidade;
    } else {
      vendasPorProduto[item.produto] = item.quantidade;
    }
  });
  console.log(`Subtotal: ${formatarMoeda(subtotal)}`);
  console.log(`Desconto aplicado: ${desconto * 100}%`);
  console.log(`Valor com desconto: ${formatarMoeda(valorComDesconto)}`);
  console.log(`Imposto (5%): ${formatarMoeda(imposto)}`);
  console.log(`Taxa de entrega: ${formatarMoeda(taxaEntrega)}`);
  console.log(`Total final: ${formatarMoeda(total)}`);
  console.log(`Valor pago: ${formatarMoeda(valorPago)}`);
  console.log(`Troco: ${formatarMoeda(troco)}`);
  console.log(`Pontos de fidelidade ganhos: ${pontos}`);
  console.log(`Total em Euros: € ${totalEmEuro.toFixed(2)}`);

  // Adiciona o pedido ao histórico
  historicoPedidos.push({
    data: new Date(),
    itens: [...carrinho],
    total: total,
    cliente: cliente1.nome,
  });

  carrinho = []; // esvazia carrinho
  console.log("---------------------------------------");
  console.log("Compra finalizada!");
};

// --- Uso do carrinho ---

// Pedido de Torta de Frango (7 unidades)
console.log("--- Pedido de Torta de Frango ---");
adicionarAoCarrinho("TOR002", 7);
finalizarCompra(200.0); // Valor pago de R$ 200,00

// Nova compra com vários itens
console.log("\n--- Nova compra com múltiplos itens ---");
adicionarAoCarrinho("PAO001", 5);
adicionarAoCarrinho("BOL003", 2);
finalizarCompra(50.0); // Valor pago de R$ 50,00

console.log("---------------------------------------");
console.log("Histórico de Pedidos do Dia:");
historicoPedidos.forEach((pedido, index) => {
  console.log(
    `Pedido #${index + 1} - Cliente: ${
      pedido.cliente
    } - Data: ${pedido.data.toLocaleString()}`
  );
  console.log("Itens:");
  pedido.itens.forEach((item) => {
    console.log(`  - ${item.quantidade}x ${item.produto}`);
  });
  console.log(`Total: R$ ${pedido.total.toFixed(2)}`);
  console.log("---");
});

// ---------------------------------------
// Funcionalidade de Favoritos
// ---------------------------------------

const produtosFavoritos = [];

const adicionarAosFavoritos = (codigo) => {
  const produto = produtos.find((p) => p.codigo === codigo);
  if (!produto) {
    console.log("Erro: Produto não encontrado.");
    return;
  }
  if (produtosFavoritos.includes(codigo)) {
    console.log(`${produto.nome} já está na sua lista de favoritos.`);
  } else {
    produtosFavoritos.push(codigo);
    console.log(`${produto.nome} foi adicionado aos favoritos.`);
  }
};

const removerDosFavoritos = (codigo) => {
  const index = produtosFavoritos.indexOf(codigo);
  const produto = produtos.find((p) => p.codigo === codigo);

  if (index !== -1) {
    produtosFavoritos.splice(index, 1);
    console.log(`${produto.nome} foi removido dos favoritos.`);
  } else {
    console.log("Produto não encontrado nos favoritos.");
  }
};

const mostrarFavoritos = () => {
  console.log("--- Seus Produtos Favoritos ---");
  if (produtosFavoritos.length === 0) {
    console.log("Sua lista de favoritos está vazia.");
    return;
  }
  produtosFavoritos.forEach((codigo) => {
    const produto = produtos.find((p) => p.codigo === codigo);
    console.log(`- ${produto.nome} (Código: ${produto.codigo})`);
  });
};

// Exemplo de uso da funcionalidade de Favoritos
adicionarAosFavoritos("PAO001");
adicionarAosFavoritos("BOL003");
mostrarFavoritos();

removerDosFavoritos("PAO001");
mostrarFavoritos();

// ---------------------------------------
// Ranking de Produtos Mais Vendidos
// ---------------------------------------

const mostrarRankingVendas = () => {
  console.log("--- Ranking de Produtos Mais Vendidos ---");
  // Converte o objeto de vendas para um array de pares [nome do produto, quantidade vendida]
  const ranking = Object.entries(vendasPorProduto);

  // Ordena o array em ordem decrescente de quantidade vendida
  ranking.sort((a, b) => b[1] - a[1]);

  if (ranking.length === 0) {
    console.log("Nenhum produto foi vendido ainda.");
    return;
  }

  ranking.forEach((item, index) => {
    console.log(
      `${index + 1}º lugar: ${item[0]} (${item[1]} unidades vendidas)`
    );
  });
};

// Mostra o ranking depois das compras
console.log("\n");
mostrarRankingVendas();
