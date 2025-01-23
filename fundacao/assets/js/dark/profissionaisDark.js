// Recupera o estado do modo escuro do localStorage
let seAtivo = localStorage.getItem('dark') === 'true';

// Seletores gerais
const body = document.querySelector('body');
const headerContatos = document.querySelector('#headerContatos');
const menuArea = document.querySelector('#menuArea');
const darkBtn = document.querySelector('#toggle');
const linksUteisDark = document.querySelector('#linksUteisDark');
const breadcumbWrapper = document.querySelector('#bread');
const subTitle = document.querySelector('.sub-title');
const secTitle = document.querySelector('.sec-title');
const boxTitle = document.querySelectorAll('.box-title');
const teamDesig = document.querySelectorAll('.team-desig');
const foot = document.querySelector('#footerDark');
const littleFooter = document.querySelector('#littleFooter');
const space = document.querySelector('.space')

// Função para ativar o modo escuro
const ativarModoEscuro = () => {
  localStorage.setItem('dark', 'true');
  seAtivo = true;

  headerContatos?.classList.add('dark');
  menuArea?.classList.add('darkAbsolute');
  linksUteisDark?.classList.add('btnInDark');
  body.style.backgroundColor = '#000 !important';
  
  space?.classList.add('darkAbsolute')
  subTitle?.classList.add('fontInDark');
  secTitle?.classList.add('fontInDark');
  foot?.classList.add('darkAbsolute');
  littleFooter?.classList.add('dark');

  boxTitle.forEach((nome) => nome?.classList.add('fontInDark'));
  teamDesig.forEach((cargo) => cargo?.classList.add('fontInDark'));
};

// Função para desativar o modo escuro
const desativarModoEscuro = () => {
  localStorage.setItem('dark', 'false');
  seAtivo = false;

  headerContatos?.classList.remove('dark');
  menuArea?.classList.remove('darkAbsolute');
  linksUteisDark?.classList.remove('btnInDark');
  body.style.backgroundColor = '#fff !important';
  subTitle?.classList.remove('fontInDark');
  secTitle?.classList.remove('fontInDark');
  foot?.classList.remove('darkAbsolute');
  littleFooter?.classList.remove('dark');

  boxTitle.forEach((nome) => nome?.classList.remove('fontInDark'));
  teamDesig.forEach((cargo) => cargo?.classList.remove('fontInDark'));
};

// Inicializa o estado com base no valor armazenado
if (seAtivo) {
  ativarModoEscuro();
}

// Adiciona evento para alternar o modo
darkBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  if (seAtivo) {
    desativarModoEscuro();
  } else {
    ativarModoEscuro();
  }
});
