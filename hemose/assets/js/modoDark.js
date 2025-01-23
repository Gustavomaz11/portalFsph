document.addEventListener('DOMContentLoaded', () => {
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

  let listaHero = [
    'assets/img/bg/bg_hero_hm.jpg',
    'assets/img/bg/modoDarkHemoseHero.png',
  ];

  let listaBanner = [
    'assets/img/imgFundo/bannerLight.png',
    'assets/img/imgFundo/bannerDark.png',
  ];

  let sizeToggle = document.querySelector('#sizeToggle')
  let hero = document.querySelector('.hero-1');
  let tituloHero = document.querySelectorAll('.hero-title');
  let heroHeading = document.querySelectorAll('.hero-heading');
  let banner = document.querySelector('.banner');
  let fsph = document.querySelectorAll('.stepsDonation .title-area .sub-title');
  let paragrafo = document.querySelectorAll(
    '.stepsDonation .title-area .sec-text',
  );
  let span = document.querySelector(
    '.stepsDonation .title-area .sec-text span',
  );
  let how = document.querySelectorAll('.stepsDonation h3');
  let sub = document.querySelectorAll(
    '.stepsDonation .contact-process-wrap .media-body h3',
  );
  let subparagrafo = document.querySelectorAll(
    '.stepsDonation .contact-process-wrap .media-body box-text',
  );

  // Função para ativar modo escuro
  const activateDarkMode = () => {
    localStorage.setItem('dark', 'true');
    headerContatos?.classList.add('darkAbsolute');
    menuArea?.classList.add('dark');
    sizeToggle?.classList.add('fontInDark')

    logo.src = listaLogo[1];
    hero.style.setProperty(
      'background-image',
      `url(${listaHero[1]})`,
      'important',
    );
    menu?.forEach((m) => m?.classList.add('fontInDark'));
    tituloHero?.forEach((t) => t?.classList.add('contornoHero'));
    heroHeading?.forEach((h) => h?.classList.add('contornoHero'));
    banner.style.setProperty(
      'background-image',
      `url(${listaBanner[1]})`,
      'important',
    );

    fsph?.forEach((company) => company?.classList.add('fontInDark'));
    paragrafo?.forEach((p) => p?.classList.add('fontInDark'));
    how?.forEach((h) => h?.classList.add('fontInDark'));
    sub?.forEach((s) => s?.classList.add('fontInDark'));
    subparagrafo?.forEach((sp) => sp?.classList.add('fontInDark'));
    body.style.setProperty(
      'background',
      'linear-gradient(125deg, #3b0d0d 0%, #4a1010 20%, #2d0808 40%, #1f0505 60%, #170303 80%, #000000 100%)',
      'important',
    );
  };

  // Função para desativar modo escuro
  const deactivateDarkMode = () => {
    localStorage.setItem('dark', 'false');
    headerContatos?.classList.remove('darkAbsolute');
    menuArea?.classList.remove('dark');
    logo.src = listaLogo[0];
    hero.style.setProperty(
      'background-image',
      `url(${listaHero[0]})`,
      'important',
    );
    tituloHero?.forEach((t) => t?.classList.remove('contornoHero'));
    heroHeading?.forEach((h) => h?.classList.remove('contornoHero'));

    banner.style.setProperty(
      'background-image',
      `url(${listaBanner[0]})`,
      'important',
    );

    fsph?.forEach((company) => company?.classList.remove('fontInDark'));
    paragrafo?.forEach((p) => p?.classList.remove('fontInDark'));
    how?.forEach((h) => h?.classList.remove('fontInDark'));
    sub?.forEach((s) => s?.classList.remove('fontInDark'));
    subparagrafo?.forEach((sp) => sp?.classList.remove('fontInDark'));

    menu?.forEach((m) => m?.classList.remove('fontInDark'));
    body.style.setProperty('background', '#f5f5f5', 'important');
    sizeToggle?.classList.remove('fontInDark')
  };
  // Alternar entre modos claro e escuro
  if (darkAtivo) {
    activateDarkMode();
  }

  darkBtn?.addEventListener('click', (e) => {
    location.reload()
    e.preventDefault();

    darkAtivo = !darkAtivo;
    if (darkAtivo) {
      activateDarkMode();
    } else {
      deactivateDarkMode();
    }
  });
});
