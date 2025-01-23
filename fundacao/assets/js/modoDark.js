document.addEventListener('DOMContentLoaded', () => {
  
  let body = document.querySelector('body');
  // Seletores do Header
  const headerContatos = document.querySelector('#headerContatos');
  const menuArea = document.querySelector('#menuArea');
  const darkBtn = document.querySelector('#toggle');
  const linksUteisDark = document.querySelector('#linksUteisDark');

  // Seletores do Hero
  const heroDarkMode = document.querySelector('#heroDarkMode');
  const hemoseBtn = document.querySelector('.hemose-btn');
  const lacenBtn = document.querySelector('.lacen-btn');
  const svoBtn = document.querySelector('.svo-btn');

  // Variáveis de Fontes no Header e Hero
  const fsphDark = document.querySelector('#fsphDark');
  const title1 = document.querySelector('.title1');
  const title2 = document.querySelector('.title2');
  const heroText = document.querySelector('#textoHero');
  const linha = document.querySelector('.line-text');

  // About area
  const subTitle = document.querySelectorAll('.sub-title');
  const secTitle = document.querySelectorAll('.sec-title');
  const secText = document.querySelectorAll('.sec-text');
  const continueLendoBtn = document.querySelectorAll('.continueLendoBtn');
  const checklist = document.querySelectorAll('.checklist ul li');
  const icone = document.querySelectorAll('.checklist ul li i');

  const foot = document.querySelector('#footerDark');
  const littleFooter = document.querySelector('#littleFooter');

  let darkAtivo = localStorage.getItem('dark') === 'true';

  // Função para ativar modo escuro
  const activateDarkMode = () => {
    localStorage.setItem('dark', 'true');

    headerContatos?.classList.add('dark');
    menuArea?.classList.add('darkAbsolute');
    linksUteisDark?.classList.add('btnInDark');
    heroDarkMode?.classList.add('heroDark');
    fsphDark?.classList.add('fontInDark');
    title1?.classList.add('fontInDark');
    title2?.classList.add('fontInDark');
    heroText?.classList.add('fontInDark');
    hemoseBtn?.classList.add('btnInDark');
    lacenBtn?.classList.add('btnInDark');
    svoBtn?.classList.add('btnInDark');
    linha?.classList.remove('line-text');
    body?.classList.add('darkAbsolute');
    foot?.classList.add('darkAbsolute');
    littleFooter?.classList.add('dark');

    continueLendoBtn.forEach((btn) => btn?.classList.add('btnInDark'));
    subTitle.forEach((el) => el?.classList.add('fontInDark'));
    secTitle.forEach((el) => el?.classList.add('fontInDark'));
    secText.forEach((el) => el?.classList.add('fontInDark'));
    checklist.forEach((chk) => chk?.classList.add('fontInDark'));
    icone.forEach((i) => i?.classList.add('fontInDark'));
  };

  // Função para desativar modo escuro
  const deactivateDarkMode = () => {
    localStorage.setItem('dark', 'false');

    headerContatos?.classList.remove('dark');
    menuArea?.classList.remove('darkAbsolute');
    linksUteisDark?.classList.remove('btnInDark');
    heroDarkMode?.classList.remove('heroDark');
    fsphDark?.classList.remove('fontInDark');
    title1?.classList.remove('fontInDark');
    title2?.classList.remove('fontInDark');
    heroText?.classList.remove('fontInDark');
    hemoseBtn?.classList.remove('btnInDark');
    lacenBtn?.classList.remove('btnInDark');
    svoBtn?.classList.remove('btnInDark');
    linha?.classList.add('line-text');
    body?.classList.remove('darkAbsolute');
    foot?.classList.remove('darkAbsolute');
    littleFooter?.classList.remove('dark');

    continueLendoBtn.forEach((btn) => btn?.classList.remove('btnInDark'));
    subTitle.forEach((el) => el?.classList.remove('fontInDark'));
    secTitle.forEach((el) => el?.classList.remove('fontInDark'));
    secText.forEach((el) => el?.classList.remove('fontInDark'));
    checklist.forEach((chk) => chk?.classList.remove('fontInDark'));
    icone.forEach((i) => i?.classList.remove('fontInDark'));
  };

  // Alternar entre modos claro e escuro
  if (darkAtivo) {
    activateDarkMode();
  }

  darkBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    darkAtivo = !darkAtivo;
    if (darkAtivo) {
      activateDarkMode();
    } else {
      deactivateDarkMode();
    }
  });
});
