
document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // LÓGICA DE ESTADO E PERSISTÊNCIA (localStorage)
    // ----------------------------------------------------
    const STORAGE_KEY = 'styleHubCarrinho';
    
    // Função para carregar a contagem do carrinho do armazenamento local
    function carregarContador() {
        const storedCount = localStorage.getItem(STORAGE_KEY);
        // Retorna o valor salvo ou 0 se for a primeira visita
        return parseInt(storedCount) || 0; 
    }

    // Função para salvar a contagem do carrinho
    function salvarContador(count) {
        localStorage.setItem(STORAGE_KEY, count);
    }
    
    // Variável de ESTADO principal
    let contadorCarrinho = carregarContador();
    
    // Referência ao elemento no DOM que exibe a contagem
    const elementoContador = document.getElementById('carrinhoContador');
    
    // Função para atualizar a interface (o número no topo)
    function atualizarContadorNaInterface() {
        if (elementoContador) {
            elementoContador.textContent = contadorCarrinho;
        }
    }

    // ----------------------------------------------------
    // FUNÇÃO ADICIONAR AO CARRINHO (Usada pelos botões do index.html)
    // ----------------------------------------------------
    function adicionarAoCarrinho(productName) {
        contadorCarrinho++;
        salvarContador(contadorCarrinho);
        atualizarContadorNaInterface();
        // Não usamos alert() neste exemplo, pois o prompt confirm() já foi usado antes
    }

    // ----------------------------------------------------
    // INTERAÇÃO DO USUÁRIO: Botões "Adicionar" na página inicial
    // ----------------------------------------------------
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const cardBody = e.target.closest('.card-body');
            const productName = cardBody.querySelector('.card-title').textContent;
            
            const confirmed = confirm(`Adicionar "${productName}" ao carrinho?`);
            
            if (confirmed) {
                adicionarAoCarrinho(productName);
                alert(`Sucesso! ${productName} adicionado. Seu carrinho tem agora ${contadorCarrinho} item(s).`);
            }
        });
    });
    
    // ----------------------------------------------------
    // Inicializa o contador ao carregar a página
    // ----------------------------------------------------
    atualizarContadorNaInterface();
});
