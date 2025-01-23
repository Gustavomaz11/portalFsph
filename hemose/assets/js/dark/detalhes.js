// Seletores gerais
let body = document.querySelector('body');
let darkAtivo = localStorage.getItem('dark') === 'true';
let headerContatos = document.querySelector('.header-top');
let darkBtn = document.querySelector('#toggle');
let menuArea = document.querySelector('.menu-area');
let menu = document.querySelectorAll('.main-menu ul li a');
let logo = document.querySelector('.header-logo a img');
let listaLogo = [
  'assets/img/logo_hemose.png',
  'assets/img/logo FSPH hemoseBranco.png',
];

// Função para ativar o modo escuro
const ativarModoEscuro = () => {
  console.log('Ativando modo escuro');
  localStorage.setItem('dark', 'true');
  body.style.setProperty(
    'background',
    'linear-gradient(125deg, #3b0d0d 0%, #4a1010 20%, #2d0808 40%, #1f0505 60%, #170303 80%, #000000 100%)',
    'important',
  );
  menu?.forEach((m) => m?.classList.add('fontInDark'));
  headerContatos?.classList.add('darkAbsolute');
  menuArea?.classList.add('dark');
  sizeToggle?.classList.add('fontInDark');

  logo.src = listaLogo[1];
};

// Função para desativar o modo escuro
const desativarModoEscuro = () => {
  console.log('Desativando modo escuro');
  localStorage.setItem('dark', 'false');
  body.style.setProperty('background', '#f5f5f5', 'important');
  menu?.forEach((m) => m?.classList.remove('fontInDark'));
  headerContatos?.classList.remove('darkAbsolute');
  menuArea?.classList.remove('dark');
  sizeToggle?.classList.remove('fontInDark');

  logo.src = listaLogo[0];
};

// Verificar o estado do modo escuro ao carregar a página
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
