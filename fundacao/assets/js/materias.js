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
    noticiasMaisRecentes: []
  },
  methods: {
    async myFetch() {
      try {
        const resposta = await fetch('http://172.23.42.17:3002/apinoticias/listar/0');
        const json = await resposta.json();
        this.noticias = json; 
        this.noticiasMaisRecentes.push(json.data[0])
        this.noticiasMaisRecentes.push(json.data[1])
        this.noticiasMaisRecentes.push(json.data[2])
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    },
    verNoticia(idNoticia) {
      this.noticiaAtual = idNoticia
      window.location.href = `blog-details.html?id=${idNoticia}`;
      
    }
  },
  mounted() {
    this.myFetch(); 
  }
});


