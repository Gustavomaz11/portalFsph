document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  if (!toggle) {
    console.error("Elemento com id 'toggle' não encontrado!");
    return;
  }
  const thumb = toggle.querySelector('.toggle-thumb');
  if (!thumb) {
    console.error(
      "Elemento com classe 'toggle-thumb' não encontrado dentro de #toggle!",
    );
    return;
  }

  // Função para aplicar o tema com base no valor de localStorage
  function applyTheme() {
    const isDark = localStorage.getItem('dark') === 'true';

    if (isDark) {
      toggle.classList.add('dark');
      thumb.innerHTML =
        '<svg class="icon" viewBox="0 0 20 20"><path fill="#4b5563" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>';
    } else {
      toggle.classList.remove('dark');
      thumb.innerHTML =
        '<svg class="icon" viewBox="0 0 20 20"><path fill="#fbbf24" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>';
    }
  }

  // Atualiza o tema no clique e salva no localStorage
  toggle.addEventListener('click', () => {
    const isDark = toggle.classList.toggle('dark');
    localStorage.setItem('dark', isDark);

    // Atualiza o ícone com base no estado atual
    thumb.innerHTML = isDark
      ? '<svg class="icon" viewBox="0 0 20 20"><path fill="#4b5563" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>'
      : '<svg class="icon" viewBox="0 0 20 20"><path fill="#fbbf24" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>';
  });

  // Aplica o tema ao carregar a página
  applyTheme();
});
