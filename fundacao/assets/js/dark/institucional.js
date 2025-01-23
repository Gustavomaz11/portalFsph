// Recupera o estado do modo escuro do localStorage
let seAtivo = localStorage.getItem('dark') === 'true';

// Seletores gerais
const body = document.querySelector('body');
const headerContatos = document.querySelector('#headerContatos');
const menuArea = document.querySelector('#menuArea');
const darkBtn = document.querySelector('#toggle');
const linksUteisDark = document.querySelector('#linksUteisDark');
const breadcumbWrapper = document.querySelector('.breadcumb-wrapper');

// Institucional
const blogTitle = document.querySelectorAll('.blog-title')
const author = document.querySelectorAll('.author')
const darkTitle = document.querySelector('#darkTitle')
const icone = document.querySelectorAll('.checklist ul li i')
const list = document.querySelectorAll('.checklist ul li')
const informacoes = document.querySelector('.share-links-title')
const titudoLeis = document.querySelector('#tituloLeis')
const palavrasChave = document.querySelectorAll('.modoDark')
const tituloPalavraChave = document.querySelectorAll('.tituloPalavraChave')

const textInherit = document.querySelectorAll('.text-inherit')
const recentPostMeta = document.querySelectorAll('.recent-post-meta a')
const recentPostMetaIcon = document.querySelectorAll('.recent-post-meta a i')
const texto = document.querySelectorAll('.texto')

const foot = document.querySelector('#footerDark');
const littleFooter = document.querySelector('#littleFooter');

// Função para ativar o modo escuro
const ativarModoEscuro = () => {
  localStorage.setItem('dark', 'true');
  seAtivo = true;
  headerContatos?.classList.add('dark');
  menuArea?.classList.add('darkAbsolute');
  linksUteisDark?.classList.add('btnInDark');
  body.style.backgroundColor = '#000';
  foot?.classList.add('darkAbsolute');
  littleFooter?.classList.add('dark');

  blogTitle?.forEach((titulos) => {titulos?.classList.add('fontInDark')})
  author?.forEach((autor) => {autor?.classList.add('fontInDark')})
  textInherit?.forEach((text) => {text?.classList.add('fontInDark')})
  recentPostMeta?.forEach((text) => {text?.classList.add('fontInDark')})
  recentPostMetaIcon?.forEach((i) => {i?.classList.add('fontInDark')})
  texto?.forEach((paragrafo) => {paragrafo?.classList.add('fontInDark')})
  darkTitle?.classList.add('fontInDark')
  informacoes?.classList.add('fontInDark')
  titudoLeis?.classList.add('fontInDark')

  icone?.forEach((i) => {i?.classList.add('fontInDark')})
  list?.forEach((l) => {l?.classList.add('fontInDark')})
  palavrasChave?.forEach((p) => {p?.classList.add('dark')})
  tituloPalavraChave?.forEach((t) => {t?.classList.add('fontInDark')})
 
  
};

// Função para desativar o modo escuro
const desativarModoEscuro = () => {
  localStorage.setItem('dark', 'false');
  seAtivo = false;

  headerContatos?.classList.remove('dark');
  menuArea?.classList.remove('darkAbsolute');
  linksUteisDark?.classList.remove('btnInDark');
  body.style.backgroundColor = '#fff';

  blogTitle?.forEach((titulos) => {titulos?.classList.remove('fontInDark')})
  author?.forEach((autor) => {autor?.classList.remove('fontInDark')})
  textInherit?.forEach((text) => {text?.classList.remove('fontInDark')})
  recentPostMeta?.forEach((text) => {text?.classList.remove('fontInDark')})
  recentPostMetaIcon?.forEach((i) => {i?.classList.remove('fontInDark')})
  texto?.forEach((paragrafo) => {paragrafo?.classList.remove('fontInDark')})
  darkTitle?.classList.remove('fontInDark')
  informacoes?.classList.remove('fontInDark')
  titudoLeis?.classList.remove('fontInDark')
  icone?.forEach((i) => {i?.classList.remove('fontInDark')})
  list?.forEach((l) => {l?.classList.remove('fontInDark')})
  palavrasChave?.forEach((p) => {p?.classList.remove('dark')})
  tituloPalavraChave?.forEach((t) => {t?.classList.remove('fontInDark')})
  
  foot?.classList.remove('darkAbsolute');
  littleFooter?.classList.remove('dark');

 
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
