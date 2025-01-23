// Variáveis da página HTML da FSPH
let fotoCapaNotificaFsph = document.querySelector('#fotoCapaNotificaFsph'); // aqui tem que ser inserido uma tag img para a foto da capa
let autorMateria = document.querySelector('#autorMateria'); // aqui vai a pessoa que estiver logada fazendo a matéria
let dataMateriaFsph = document.querySelector('#dataMateriaFsph'); // data atual da matéria
let tituloMateriaFsph = document.querySelector('#tituloMateriaFsph'); // campo referente ao titulo da matéria da fsph em questão
let primeiroParagrafoMateria = document.querySelector(
  '#primeiroParagrafoMateria',
); // campo referente ao primeiro paragrafo da materia
let segundoParagrafoMateria = document.querySelector(
  '#segundoParagrafoMateria',
); // campo referente ao segundo paragrafo da materia
let parecerColaborador = document.querySelector('#parecerColaborador p'); // campo referente ao comentario do colaborador sobre a materia
let colaboradorCitado = document.querySelector('#parecerColaborador cite'); // campo para o colaborador citado
let terceiroParagrafoMateria = document.querySelector(
  '#terceiroParagrafoMateria',
); // terceiro paragrafo da materia
let quartoParagrafoMateria = document.querySelector('#quartoParagrafoMateria'); // quarto paragrafo da materia
let primeiraImagemMateria = document.querySelector('#primeiraImagemMateria'); // campo referente a primeira imagem da materia, precisa inserir tag img
let segundaImagemMateria = document.querySelector('#segundaImagemMateria'); // campo referente a segunda imagem da materia, precisa inserir tag img
let subtituloMateria = document.querySelector('#subtituloMateria'); // subtitulo
let primeiroParagrafoSubtituloMateria = document.querySelector(
  '#primeiroParagrafoSubtituloMateria',
);
let segundoParagrafoSubtituloMateria = document.querySelector(
  '#segundoParagrafoSubtituloMateria',
);

const vm = new Vue({
  el: '#areaNoticia',
  data: {
    noticias: [],
    noticiaAtual: null,
    noticiasMaisRecentes: [],
    modoDark: false, // Estado do modo escuro
  },
  methods: {
    async myFetch() {
      try {
        const resposta = await fetch(
          'http://172.23.42.17:3002/apinoticias/listar/0',
        );
        const json = await resposta.json();
        this.noticias = json;
        this.noticiasMaisRecentes.push(json.data[0]);
        this.noticiasMaisRecentes.push(json.data[1]);
        this.noticiasMaisRecentes.push(json.data[2]);
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    },
    verNoticia(idNoticia) {
      this.noticiaAtual = idNoticia;
      window.location.href = `blog-details.html?id=${idNoticia}`;
    },
    darkPage() {
      // Recupera o estado do modo escuro do localStorage
      const darkMode = localStorage.getItem('dark') === 'true';
      this.modoDark = darkMode;
      this.applyDarkMode(darkMode);
    },
    applyDarkMode(isDark) {
      // Atualiza as classes de acordo com o modo escuro
      if (isDark) {
        document.body.classList.add('darkAbsolute');
        document.body.classList.remove('light');
        // Aplica as classes para outros elementos
        document.querySelector('#headerContatos')?.classList.add('dark');
        document.querySelector('#menuArea')?.classList.add('darkAbsolute');
        document.querySelector('#linksUteisDark')?.classList.add('btnInDark');
        document
          .querySelector('.breadcumb-wrapper')
          ?.style.setProperty('background-color', '#555');
        document.querySelector('#footerDark')?.classList.add('darkAbsolute');
        document.querySelector('#littleFooter')?.classList.add('dark');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('darkAbsolute');
        // Reverte as classes para os outros elementos
        document.querySelector('#headerContatos')?.classList.remove('dark');
        document.querySelector('#menuArea')?.classList.remove('darkAbsolute');
        document
          .querySelector('#linksUteisDark')
          ?.classList.remove('btnInDark');
        document
          .querySelector('.breadcumb-wrapper')
          ?.style.setProperty('background-color', '#0a3c79');
        document.querySelector('#footerDark')?.classList.remove('darkAbsolute');
        document.querySelector('#littleFooter')?.classList.remove('dark');
      }
    },
    toggleDarkMode() {
      // Alterna o modo escuro
      this.modoDark = !this.modoDark;
      localStorage.setItem('dark', this.modoDark ? 'true' : 'false');
      this.applyDarkMode(this.modoDark); // Aplica a alteração do modo escuro
    },
  },
  mounted() {
    this.myFetch();
    this.darkPage(); // Verifica o modo escuro na inicialização
  },
});
