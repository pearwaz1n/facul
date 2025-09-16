// 1. Inicializa a variável 'produtos' no escopo global
// Isso garante que todas as outras funções possam acessá-la.
let produtos = [];


// Exemplo de como validar o campo código e adicionar máscara automática. 
// >>>>>>>>>>>>>   Não precisa sem implementado nada aqui <<<<<<<<<<<<<<<<<<<<<<<
document.addEventListener('DOMContentLoaded', function() {
    // 2. Carrega os produtos do Local Storage
    function carregaProdutosLocalStorage() {
        produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    }

    // 3. Adiciona o evento de 'blur', ou seja, quando sai do campo ao campo de código de barras
    // Adicione a lógica da máscara e da validação aqui
    const inputCodBarras = document.getElementById('codbarras');
    inputCodBarras.addEventListener('input', function(e) {
        let valor = e.target.value;
        valor = valor.replace(/\D/g, '');
        valor = valor.replace(/^(\d{1})(\d{6})(\d{6})/, "$1.$2.$3");
        if (valor.length > 15) {
            valor = valor.slice(0, 15);
        }
        e.target.value = valor;
    });

    inputCodBarras.addEventListener('blur', function() {
        const valor = inputCodBarras.value.replace(/\D/g, '');
        if (valor === '') {
            alert('Por favor, preencha o código de barras.');
            inputCodBarras.focus() //Faz com que o foco volte ao campo Código de Barras
        } else if (valor.length !== 13) {
            alert('O código de barras deve ter 13 dígitos.');
            inputCodBarras.focus()
        }
    });

    // 4. Carrega a lista de produtos 
    carregaProdutosLocalStorage();

    // 5. Lista os produtos na tabela
    listarProdutos(); 

});


// --- Funções que devem ser implementadas por vocês ---


function salvaProdutosLocalStorage() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
    // Dica: Use JSON.stringify() para converter o array 'produtos' em uma string
    // e localStorage.setItem('produtos', ...) para salvar no Local Storage.
}

function adicionarProduto() {
    const codBarras = document.getElementById('codbarras').value.replace(/\D/g, '');
    const nome = document.getElementById('nome').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const preco = parseFloat(document.getElementById('preco').value);
    const produto = { codBarras, nome, quantidade, preco };
    if (!codBarras || !nome || isNaN(quantidade) || isNaN(preco)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }
    const existe = produtos.some(p => p.codBarras === codBarras);
    if (existe) {
        alert('Produto com este código de barras já existe.');
        return;
    }
    produtos.push(produto);
    salvaProdutosLocalStorage();
    listarProdutos();
    document.getElementById('formProduto').reset();

    // Dica: 
    // 1. Pegue os valores dos campos do formulário: codbarras, nome, quantidade e preco.
    // 2. Crie um objeto com esses valores.
    // 3. Adicione este novo objeto ao array 'produtos' usando o método push().
    // 4. Chame salvaProdutosLocalStorage() para persistir os dados.
    // 5. Chame listarProdutos() para atualizar a tabela na tela.
    // 6. Limpe o formulário com document.getElementById('formProduto').reset().
    // 7. Implemente a validação para que os campos não fiquem vazios.
    // 8. Verifique se o produto já existe pelo código de barras e alerte o usuário.
}

function removerUltimo() {
    if (produtos.length > 0) {
        produtos.pop();
        salvaProdutosLocalStorage();
        listarProdutos();
        return;
    }
    alert('A lista está vazia, não há produtos para remover.');
    return;

    // Ou use produtos.length > 0 para verificar se há produtos antes de remover.
    // Dica: Use o método pop() para remover o último item do array 'produtos'.
    // Lembre-se de chamar salvaProdutosLocalStorage() e listarProdutos() depois.
    // Verifique se a lista não está vazia antes de tentar remover.
}

function removerPrimeiro() {
     if (produtos.length > 0) {
        produtos.shift();
        salvaProdutosLocalStorage();
        listarProdutos();
        return;
    }
    alert('A lista está vazia, não há produtos para remover.');
    return;
    // Dica: Use o método shift() para remover o primeiro item do array 'produtos'.
    // Lembre-se de chamar salvaProdutosLocalStorage() e listarProdutos() depois.
    // Verifique se a lista não está vazia antes de tentar remover.
}

function listarProdutos() {
   const tbody = document.querySelector('#tabelaProdutos tbody');
   tbody.innerHTML = '';
    produtos.forEach(produto => {
        tbody.innerHTML += `<tr>
            <td>${produto.codBarras}</td>
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
        </tr>`;
    });
   calcularTotal();
    // Dica:
    // 1. Encontre o elemento <tbody> da sua tabela.
    // 2. Limpe o conteúdo existente com innerHTML = ''.
    // 3. Use o método forEach() para iterar sobre o array 'produtos'.
    // 4. Para cada produto, crie uma string de linha de tabela (<tr>...</tr>)
    //    e adicione ao innerHTML do <tbody>.
    // 5. Chame a função calcularTotal() no final para atualizar o valor total.
}

function ordenarPorNome() {
    produtos.sort((a,b ) => a.nome.localeCompare(b.nome));
    listarProdutos();
    // Dica: Use o método sort() no array 'produtos'.
    // A função de comparação deve usar localeCompare() para comparar os nomes (a.nome, b.nome).
    // Depois, chame listarProdutos() para exibir a lista ordenada.
}

function ordenarPorPreco() {
    produtos.sort((a,b) => a.preco - b.preco);
    listarProdutos();
    // Dica: Use o método sort() no array 'produtos'.
    // A função de comparação deve retornar a diferença entre os preços (a.preco - b.preco).
    // Depois, chame listarProdutos() para exibir a lista ordenada.
}

function filtrarPorPreco() {
    const filter = produtos.filter(produto => produto.preco > 100 ).map(produto => produto.nome)  
    if(filter.length > 0 ){
        alert("Produtos acima de R$100,00: " + filter.join(", "))
        return;
    } else{
        alert("Não há nenhum produto acima de R$100,00")
        return;
    }

    // Dica: Use o método filter() para criar um novo array com produtos
    // cujo preço seja maior que 100.
    // Em seguida, use map() para extrair apenas os nomes dos produtos filtrados.
    // Use join(', ') para formatar os nomes em uma única string e exiba com alert().
}

function calcularTotal() {
   const total = produtos.reduce((acc, p) => acc + (p.quantidade * p.preco), 0);
    document.getElementById('totalPreco').textContent = "R$ " + total.toFixed(2);
    // Dica: Use o método reduce() no array 'produtos'.
    // A função de callback deve somar o valor total de cada produto (produto.quantidade * produto.preco).
    // Atualize o texto do elemento HTML que exibe o total com o valor formatado.
}