
document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // CONSTANTES E VARIÁVEIS GLOBAIS
    // ----------------------------------------------------
    const productGrid = document.getElementById('productGrid');
    const products = Array.from(productGrid.children); // Todos os elementos 'col' do produto
    const sortSelect = document.getElementById('sortSelect');
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    const STORAGE_KEY = 'styleHubCarrinho';

    // ----------------------------------------------------
    // LÓGICA DO CARRINHO (Persistência com localStorage)
    // ----------------------------------------------------

    // Carrega a contagem do carrinho do armazenamento local
    function carregarContador() {
        const storedCount = localStorage.getItem(STORAGE_KEY);
        return parseInt(storedCount) || 0; 
    }

    // Salva a contagem do carrinho
    function salvarContador(count) {
        localStorage.setItem(STORAGE_KEY, count);
    }
    
    let contadorCarrinho = carregarContador();
    const elementoContadorGlobal = document.getElementById('carrinhoContador');
    
    // Atualiza o número do carrinho na navbar
    function atualizarContadorNaInterfaceGlobal() {
        if (elementoContadorGlobal) {
            elementoContadorGlobal.textContent = contadorCarrinho;
        }
    }

    // Listener para os botões "Adicionar" na página de coleções
    document.querySelectorAll('.add-to-cart-collection').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            // Encontra o nome do produto a partir do card
            const cardBody = e.target.closest('.card-body');
            const productName = cardBody.querySelector('.card-title').textContent;
            
            // Substituímos o alert nativo por um simples "confirm"
            const confirmed = confirm(`Adicionar "${productName}" ao carrinho?`);
            
            if (confirmed) {
                // Atualiza o contador e salva globalmente
                contadorCarrinho++;
                salvarContador(contadorCarrinho);
                atualizarContadorNaInterfaceGlobal();
                alert(`Sucesso! "${productName}" adicionado. Seu carrinho tem agora ${contadorCarrinho} item(s).`);
            }
        });
    });

    // ----------------------------------------------------
    // LÓGICA DE FILTRO DE PREÇO
    // ----------------------------------------------------

    function applyFilter() {
        const maxPrice = parseFloat(priceRange.value);
        priceDisplay.textContent = `R$ ${maxPrice.toFixed(2).replace('.', ',')}`;

        products.forEach(product => {
            const productPrice = parseFloat(product.dataset.price);
            
            if (productPrice <= maxPrice) {
                product.style.display = 'block'; // Mostra o produto
            } else {
                product.style.display = 'none'; // Oculta o produto
            }
        });
        
        // Após filtrar, aplicamos a ordenação para manter a ordem correta dos itens visíveis
        applySort(); 
    }

    // Inicializa o filtro e o display de preço ao carregar
    priceRange.addEventListener('input', applyFilter);


    // ----------------------------------------------------
    // LÓGICA DE ORDENAÇÃO
    // ----------------------------------------------------

    function applySort() {
        const sortBy = sortSelect.value;
        
        // Cria uma cópia dos produtos visíveis para ordenar
        const visibleProducts = products.filter(p => p.style.display !== 'none');

        // Função de comparação para ordenação
        visibleProducts.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);

            if (sortBy === 'price-asc') {
                return priceA - priceB; // Preço mais baixo primeiro
            } else if (sortBy === 'price-desc') {
                return priceB - priceA; // Preço mais alto primeiro
            }
            // Para 'default' ou 'novelty', mantemos a ordem original (do HTML)
            // Mas, como estamos reordenando apenas os visíveis, precisamos reconstruir
            return 0; 
        });

        // Reinsere os produtos ordenados na grid
        visibleProducts.forEach(product => {
            productGrid.appendChild(product);
        });

        // Garantir que os produtos escondidos permaneçam no final do DOM para fácil reexibição, 
        // embora eles já estejam ocultos por 'display: none'.
        products.filter(p => p.style.display === 'none').forEach(product => {
            productGrid.appendChild(product);
        });
    }

    // Listener para o dropdown de ordenação
    sortSelect.addEventListener('change', applySort);

    // ----------------------------------------------------
    // INICIALIZAÇÃO
    // ----------------------------------------------------
    
    // 1. Carrega o estado do carrinho
    atualizarContadorNaInterfaceGlobal();
    
    // 2. Aplica o filtro inicial e a ordenação
    applyFilter(); 
});
