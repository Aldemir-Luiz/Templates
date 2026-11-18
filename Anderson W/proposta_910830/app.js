
(() => {
  'use strict';
  const STORAGE_KEY = 'milacan_cotacao_proposta_910830';
  const WHATSAPP = '5581996259540';
  let itens = [];

  try {
    const armazenado = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    itens = Array.isArray(armazenado) ? armazenado.filter(x => typeof x === 'string') : [];
  } catch (_) {
    itens = [];
  }

  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));

  function salvarESincronizar() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(itens)); }
    catch (erro) { console.warn('Não foi possível salvar a cotação neste navegador.', erro); }

    const contador = $('#qcount');
    if (contador) contador.textContent = String(itens.length);

    const lista = $('#qlist');
    if (lista) {
      lista.innerHTML = itens.length
        ? itens.map((nome, indice) => `
          <div class="quote-item">
            <span>${escapeHtml(nome)}</span>
            <button type="button" data-rm="${indice}" aria-label="Remover ${escapeHtml(nome)}">Remover</button>
          </div>`).join('')
        : '<p class="empty-quote">Sua lista está vazia.</p>';
    }
  }

  function escapeHtml(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[caractere]);
  }

  function abrirDrawer(abrir) {
    const drawer = $('#drawer');
    const backdrop = $('.drawer-backdrop');
    if (!drawer) return;
    drawer.classList.toggle('on', abrir);
    drawer.setAttribute('aria-hidden', String(!abrir));
    if (backdrop) backdrop.classList.toggle('on', abrir);
  }

  function filtrarCatalogo() {
    const chip = $('.filter-chip.ativo');
    const categoria = chip ? chip.dataset.filter : 'todos';
    const termo = ($('#catalog-search')?.value || '').toLocaleLowerCase('pt-BR').trim();
    let visiveis = 0;

    $$('.product-card').forEach(card => {
      const texto = (card.textContent || '').toLocaleLowerCase('pt-BR');
      const catOk = categoria === 'todos' || card.dataset.cat === categoria;
      const textoOk = !termo || texto.includes(termo);
      const mostrar = catOk && textoOk;
      card.hidden = !mostrar;
      if (mostrar) visiveis += 1;
    });

    const contador = $('#result-count');
    if (contador) contador.textContent = `${visiveis} produto${visiveis === 1 ? '' : 's'}`;
    const vazio = $('#empty-results');
    if (vazio) vazio.hidden = visiveis !== 0;
  }

  document.addEventListener('click', evento => {
    const adicionar = evento.target.closest('[data-add]');
    if (adicionar) {
      const nome = adicionar.dataset.add;
      if (!itens.includes(nome)) itens.push(nome);
      salvarESincronizar();
      const textoOriginal = adicionar.textContent;
      adicionar.textContent = '✓ Adicionado';
      adicionar.disabled = true;
      window.setTimeout(() => {
        adicionar.textContent = textoOriginal;
        adicionar.disabled = false;
      }, 900);
      return;
    }

    const remover = evento.target.closest('[data-rm]');
    if (remover) {
      const indice = Number(remover.dataset.rm);
      if (Number.isInteger(indice) && indice >= 0 && indice < itens.length) {
        itens.splice(indice, 1);
        salvarESincronizar();
      }
      return;
    }

    if (evento.target.closest('[data-open]')) abrirDrawer(true);
    if (evento.target.closest('[data-close]')) abrirDrawer(false);

    if (evento.target.closest('[data-send]')) {
      const mensagem = itens.length
        ? 'Olá! Gostaria de solicitar uma cotação para:\\n- ' + itens.join('\\n- ')
        : 'Olá! Gostaria de solicitar um orçamento de móveis para escritório.';
      const url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(mensagem);
      window.open(url, '_blank', 'noopener');
    }

    const filtro = evento.target.closest('[data-filter]');
    if (filtro && filtro.classList.contains('filter-chip')) {
      $$('.filter-chip').forEach(botao => botao.classList.remove('ativo'));
      filtro.classList.add('ativo');
      filtrarCatalogo();
    }

    if (evento.target.closest('[data-menu]')) {
      const menu = $('.nav-menu');
      if (menu) menu.classList.toggle('open');
    }
  });

  const busca = $('#catalog-search');
  if (busca) busca.addEventListener('input', filtrarCatalogo);

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') abrirDrawer(false);
  });

  salvarESincronizar();
  filtrarCatalogo();
})();
