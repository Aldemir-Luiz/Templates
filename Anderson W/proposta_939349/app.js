
const itens = JSON.parse(localStorage.getItem('milacan_cotacao') || '[]');
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function salvarESincronizar() {
    localStorage.setItem('milacan_cotacao', JSON.stringify(itens));

    const qcount = $('#qcount');
    if(qcount) qcount.textContent = itens.length;

    const l = $('#qlist');

    if(l) {
        l.innerHTML = itens.length ? itens.map((n, i) => `
            <div class="it">
                <span>${n}</span>
                <button data-rm="${i}" style="background:none;border:0;font-weight:bold;cursor:pointer;color:var(--mut)">✕</button>
            </div>
        `).join('') : '<p style="color:var(--mut)">Sua lista está vazia.</p>';
    }
}

function abrir(on) {
    const dr = $('#drawer');
    if(dr) dr.classList.toggle('on', on);
}

document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');

    if (a) {
        if (!itens.includes(a.dataset.add)) itens.push(a.dataset.add);

        salvarESincronizar();

        const txt = a.textContent;
        a.textContent = '✓ Adicionado';

        setTimeout(() => a.textContent = txt, 1200);
    }

    const r = e.target.closest('[data-rm]');

    if (r) {
        itens.splice(+r.dataset.rm, 1);
        salvarESincronizar();
    }

    if (e.target.closest('[data-open]')) abrir(true);
    if (e.target.closest('[data-close]')) abrir(false);

    if (e.target.closest('[data-send]')) {
        const t = itens.length
            ? 'Olá! Gostaria de cotação:\n- ' + itens.join('\n- ')
            : 'Olá! Gostaria de solicitar orçamento de móveis.';

        window.open(
            'https://wa.me/5581996259540?text=' + encodeURIComponent(t),
            '_blank'
        );
    }

    const chip = e.target.closest('.chip');

    if (chip) {
        $$('.chip').forEach(c => c.classList.remove('ativo'));
        chip.classList.add('ativo');
        filtrarCatalogo();
    }
});

function filtrarCatalogo() {
    const ativo = $('.chip.ativo');
    const cat = ativo ? ativo.dataset.filter : 'todos';

    const termo = $('#catalog-search')
        ? $('#catalog-search').value.toLowerCase().trim()
        : '';

    $$('.card').forEach(card => {
        const cardCat = card.dataset.cat;
        const texto = card.textContent.toLowerCase();

        const matchCat = (cat === 'todos' || cardCat === cat);
        const matchTerm = (!termo || texto.includes(termo));

        card.style.display = (matchCat && matchTerm) ? 'flex' : 'none';
    });
}

const searchEl = $('#catalog-search');

if(searchEl) {
    searchEl.addEventListener('input', filtrarCatalogo);
}

salvarESincronizar();
