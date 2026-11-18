const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Cadeira Cavaletti Flip Light",
        category: "cadeiras",
        line: "Linha Cavaletti",
        description: "Cadeira giratória ergonômica com encosto em tela flexível, regulagem de altura a gás e conformidade NR-17.",
        stock: "Pronta Entrega",
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Cadeira Presidente Florença Alta",
        category: "cadeiras",
        line: "Linha Executiva",
        description: "Poltrona executiva com espaldar alto, espuma injetada de alta densidade e braços reguláveis.",
        stock: "Sob Consulta",
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Cadeira Longarina New Iso (3 Lugares)",
        category: "cadeiras",
        line: "Recepção & Espera",
        description: "Estrutura metálica reforçada com assentos anatômicos de alta durabilidade para recepções e clínicas.",
        stock: "Pronta Entrega",
        image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Mesa Dinâmica com Armário Lateral - Yaris",
        category: "mesas",
        line: "Linha Yaris",
        description: "Estação executiva completa com tampo em MDP 25mm, armário credenza integrado e passagem de cabos.",
        stock: "Sob Encomenda",
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Mesa de Reunião Retangular com Caixa de Tomadas - Start",
        category: "mesas",
        line: "Linha Start",
        description: "Mesa corporativa para salas de reunião com conectividade integrada e pés metálicos em quadro.",
        stock: "Sob Encomenda",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Mesa Diretor em L (Pé Painel)",
        category: "mesas",
        line: "Linha Diretoria",
        description: "Ampla superfície de trabalho com mesa auxiliar acoplada e gaveteiro fixo com chave.",
        stock: "Pronta Entrega",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Armário Baixo Credenza - Yaris",
        category: "armarios",
        line: "Linha Yaris",
        description: "Armário organizador baixo com portas de abrir, puxadores em alumínio e fechadura cilíndrica.",
        stock: "Pronta Entrega",
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Armário Alto Fechado - Start",
        category: "armarios",
        line: "Linha Start",
        description: "Armário corporativo alto com 4 prateleiras internas reforçadas para arquivamento de pastas AZ.",
        stock: "Pronta Entrega",
        image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 9,
        name: "Arquivo em Aço com 4 Gavetas",
        category: "aco",
        line: "Móveis em Aço",
        description: "Arquivo deslizante para pastas suspensas com trilhos telescópicos e pintura eletrostática anticorrosiva.",
        stock: "Pronta Entrega",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 10,
        name: "Roupeiro em Aço (16 Portas)",
        category: "aco",
        line: "Móveis em Aço",
        description: "Vestiário industrial em chapa de aço reforçada com venezianas para ventilação e pitão para cadeado.",
        stock: "Pronta Entrega",
        image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80"
    }
];

let quoteList = JSON.parse(localStorage.getItem('milacan_quote') || '[]');

function updateQuoteUI() {
    const badges = document.querySelectorAll('.quote-badge');
    badges.forEach(b => b.textContent = quoteList.length);

    const container = document.getElementById('drawer-items');
    if (!container) return;

    if (quoteList.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.92rem;">Nenhum item selecionado para cotação ainda.</p>';
        return;
    }

    container.innerHTML = quoteList.map((item, idx) => `
        <div class="drawer-item">
            <div>
                <strong>${item.name}</strong>
                <div style="font-size: 0.78rem; color: var(--primary-color);">${item.line}</div>
            </div>
            <button class="remove-item" onclick="removeFromQuote(${idx})">✕</button>
        </div>
    `).join('');
}

function addToQuote(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    quoteList.push(product);
    localStorage.setItem('milacan_quote', JSON.stringify(quoteList));
    updateQuoteUI();
    toggleDrawer(true);
}

function removeFromQuote(index) {
    quoteList.splice(index, 1);
    localStorage.setItem('milacan_quote', JSON.stringify(quoteList));
    updateQuoteUI();
}

function toggleDrawer(forceOpen = null) {
    const drawer = document.getElementById('quote-drawer');
    if (!drawer) return;
    if (forceOpen === true) drawer.classList.add('open');
    else if (forceOpen === false) drawer.classList.remove('open');
    else drawer.classList.toggle('open');
}

function sendQuoteWhatsApp() {
    if (quoteList.length === 0) {
        alert("Adicione pelo menos um móvel à sua lista de cotação.");
        return;
    }
    const itemsText = quoteList.map((item, i) => `${i + 1}. ${item.name} (${item.line})`).join('%0A');
    const message = `Olá, equipe Milacan! Gostaria de solicitar uma cotação corporativa para os seguintes itens:%0A%0A${itemsText}`;
    window.open(`https://wa.me/5581996259540?text=${message}`, '_blank');
}

function renderCatalog(filter = 'all', search = '') {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    const filtered = PRODUCTS_DATA.filter(item => {
        const matchesCat = filter === 'all' || item.category === filter;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                              item.line.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    grid.innerHTML = filtered.map(item => `
        <article class="product-card">
            <div class="product-img-wrap">
                <img id="product-image" src="${item.image}" alt="${item.name}">
                <span class="product-line-tag">${item.line}</span>
            </div>
            <div class="product-body">
                <span class="product-category">${item.category}</span>
                <h3 id="product-title">${item.name}</h3>
                <p id="product-description">${item.description}</p>
                <div class="product-footer">
                    <span id="stock-quantity" class="stock-status">${item.stock}</span>
                    <button id="buy-button" class="btn-add-quote" onclick="addToQuote(${item.id})">+ Cotar Item</button>
                </div>
            </div>
        </article>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    updateQuoteUI();
    renderCatalog();

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const searchVal = document.getElementById('catalog-search')?.value || '';
            renderCatalog(btn.dataset.filter, searchVal);
        });
    });

    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            renderCatalog(activeFilter, e.target.value);
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const msg = document.getElementById('message').value;
            const text = `Olá, Milacan! Meu nome é ${name}.%0A%0ADetalhes do projeto:%0A${msg}`;
            window.open(`https://wa.me/5581996259540?text=${text}`, '_blank');
        });
    }
});
