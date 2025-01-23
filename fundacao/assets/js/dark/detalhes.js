// Recupera o estado do modo escuro do localStorage
let seAtivo = localStorage.getItem('dark') === 'true';

// Seletores gerais
const body = document.querySelector('body');
const headerContatos = document.querySelector('#headerContatos');
const menuArea = document.querySelector('#menuArea');
const darkBtn = document.querySelector('#toggle');
const linksUteisDark = document.querySelector('#linksUteisDark');
const breadcumbWrapper = document.querySelector('.breadcumb-wrapper');
const foot = document.querySelector('#footerDark');
const littleFooter = document.querySelector('#littleFooter');

// Seletores da página de notícias
const widgets = document.querySelectorAll('.widget');
const widgetTitulos = document.querySelectorAll('.widget_title');
const titulosRecentes = document.querySelectorAll('.tituloRecente a');
const datasRecentes = document.querySelectorAll('.dataNoticiaRecente a');
const paragrafos = document.querySelectorAll('.paragrafo');
const autores = document.querySelectorAll('.autorNoticia');
const datasNoticias = document.querySelectorAll('.dataNoticia');
const botoesContinuar = document.querySelectorAll('.continueLendoBtn');
const info = document.querySelectorAll('.share-links-title')

// Função para ativar o modo escuro
const ativarModoEscuro = () => {
  localStorage.setItem('dark', 'true');
  seAtivo = true;

  // Gerais
  headerContatos?.classList.add('dark');
  menuArea?.classList.add('darkAbsolute');
  linksUteisDark?.classList.add('btnInDark');
  body?.style.setProperty('background-color', '#000');
  foot?.classList.add('darkAbsolute');
  littleFooter?.classList.add('dark');

  // Página de notícias
  widgets.forEach((widget) => widget.classList.add('dark'));
  widgetTitulos.forEach((titulo) => titulo.classList.add('fontInDark'));
  titulosRecentes.forEach((titulo) => titulo.classList.add('fontInDark'));
  datasRecentes.forEach((data) => data.classList.add('fontInDark'));
  paragrafos.forEach((paragrafo) => paragrafo.classList.add('fontInDark'));
  autores.forEach((autor) => autor.classList.add('fontInDark'));
  datasNoticias.forEach((data) => data.classList.add('fontInDark'));
  botoesContinuar.forEach((btn) => btn.classList.add('fontInDark'));
  info.forEach((inf) => inf.classList.add('fontInDark'))
};

// Função para desativar o modo escuro
const desativarModoEscuro = () => {
  localStorage.setItem('dark', 'false');
  seAtivo = false;

  // Gerais
  headerContatos?.classList.remove('dark');
  menuArea?.classList.remove('darkAbsolute');
  linksUteisDark?.classList.remove('btnInDark');
  body?.style.setProperty('background-color', '#fff');
  foot?.classList.remove('darkAbsolute');
  littleFooter?.classList.remove('dark');

  // Página de notícias
  widgets.forEach((widget) => widget.classList.remove('dark'));
  widgetTitulos.forEach((titulo) => titulo.classList.remove('fontInDark'));
  titulosRecentes.forEach((titulo) => titulo.classList.remove('fontInDark'));
  datasRecentes.forEach((data) => data.classList.remove('fontInDark'));
  paragrafos.forEach((paragrafo) => paragrafo.classList.remove('fontInDark'));
  autores.forEach((autor) => autor.classList.remove('fontInDark'));
  datasNoticias.forEach((data) => data.classList.remove('fontInDark'));
  botoesContinuar.forEach((btn) => btn.classList.remove('fontInDark'));
};

// Inicializa o estado com base no valor armazenado
if (seAtivo) ativarModoEscuro();

// Adiciona evento para alternar o modo
darkBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  seAtivo ? desativarModoEscuro() : ativarModoEscuro();
});
