document.addEventListener('DOMContentLoaded', () => {
  // Seletores gerais
  const body = document.querySelector('body');
  const headerContatos = document.querySelector('#headerContatos');
  const menuArea = document.querySelector('#menuArea');
  const darkBtn = document.querySelector('#toggle');
  const linksUteisDark = document.querySelector('#linksUteisDark');
  const breadcumbWrapper = document.querySelector('.breadcumb-wrapper');
  const foot = document.querySelector('#footerDark');
  const littleFooter = document.querySelector('#littleFooter');

  const introducao = document.querySelectorAll('.team-details .sec-title');
  const paragrafos = document.querySelectorAll('.team-details .mb-20');
  const subtitulo = document.querySelector('.team-details .subtitulo');
  const detalhes = document.querySelectorAll('.team-details ul li');
  const iconeDetalhes = document.querySelectorAll('.team-details ul li i');
  const numeroDetalhes = document.querySelectorAll('.team-details ul li b');

  // Função para ativar o modo escuro
  const ativarModoEscuro = () => {
    console.log('Ativando modo escuro');
    localStorage.setItem('dark', 'true');

    headerContatos?.classList.add('dark');
    menuArea?.classList.add('darkAbsolute');
    linksUteisDark?.classList.add('btnInDark');
    body.style.backgroundColor = '#000';
    foot?.classList.add('darkAbsolute');
    littleFooter?.classList.add('dark');

    subtitulo?.classList.add('fontInDark');
    introducao?.forEach((titulo) => titulo?.classList.add('fontInDark'));
    paragrafos?.forEach((paragrafo) => paragrafo?.classList.add('fontInDark'));
    detalhes?.forEach((detalhe) => detalhe?.classList.add('fontInDark'));
    iconeDetalhes?.forEach((icone) => icone?.classList.add('fontInDark'));
    numeroDetalhes?.forEach((numero) => numero?.classList.add('fontInDark'));
  };

  const desativarModoEscuro = () => {
    console.log('Desativando modo escuro');
    localStorage.setItem('dark', 'false');

    headerContatos?.classList.remove('dark');
    menuArea?.classList.remove('darkAbsolute');
    linksUteisDark?.classList.remove('btnInDark');
    body.style.backgroundColor = '#fff';
    foot?.classList.remove('darkAbsolute');
    littleFooter?.classList.remove('dark');

    subtitulo?.classList.remove('fontInDark');
    introducao?.forEach((titulo) => titulo?.classList.remove('fontInDark'));
    paragrafos?.forEach((paragrafo) =>
      paragrafo?.classList.remove('fontInDark'),
    );
    detalhes?.forEach((detalhe) => detalhe?.classList.remove('fontInDark'));
    iconeDetalhes?.forEach((icone) => icone?.classList.remove('fontInDark'));
    numeroDetalhes?.forEach((numero) => numero?.classList.remove('fontInDark'));
  };

  // Verificar e aplicar o modo escuro na inicialização
  if (localStorage.getItem('dark') === 'true') {
    ativarModoEscuro();
  } else {
    console.log('Modo escuro está inativo.');
  }

  // Adiciona evento para alternar o modo
  darkBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (localStorage.getItem('dark') === 'true') {
      desativarModoEscuro();
    } else {
      ativarModoEscuro();
    }
  });
});
