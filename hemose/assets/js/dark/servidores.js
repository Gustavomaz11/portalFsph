document.addEventListener('DOMContentLoaded', () => {
  // Seletores gerais
  let body = document.querySelector('body');
  let darkAtivo = localStorage.getItem('dark') === 'true';
  let headerContatos = document.querySelector('.header-top');
  let darkBtn = document.querySelector('#toggle');
  let menuArea = document.querySelector('.menu-area');
  let menu = document.querySelectorAll('.main-menu ul li a');
  let logo = document.querySelector('.header-logo a img');
  let sizeToggle = document.querySelector('#sizeToggle')
  let listaLogo = [
    'assets/img/logo_hemose.png',
    'assets/img/logo FSPH hemoseBranco.png',
  ];
  

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
    menu?.forEach(m => m?.classList.add('fontInDark'))
    sizeToggle?.classList.add('fontInDark')
    headerContatos?.classList.add('dark');
    menuArea?.classList.add('darkAbsolute');
    body.style.setProperty(
      'background',
      'linear-gradient(125deg, #3b0d0d 0%, #4a1010 20%, #2d0808 40%, #1f0505 60%, #170303 80%, #000000 100%)',
      'important',
    );
    logo.src = listaLogo[1];

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
    body.style.setProperty('background', '#f5f5f5', 'important');
    menu?.forEach(m => m?.classList.remove('fontInDark'))
    sizeToggle?.classList.remove('fontInDark')



    logo.src = listaLogo[0];

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
    location.reload()

    e.preventDefault();
    if (darkAtivo) {
      desativarModoEscuro();
    } else {
      ativarModoEscuro();
    }
  });
});
