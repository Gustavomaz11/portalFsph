const vm2 = new Vue({
  el: '#detalheNoticia',
  data: {
    noticias: [],
    noticiaAtual: '',
    estado: false
  },
  methods: {
    async myFetch() {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        const resposta = await fetch(`http://172.23.42.17:3002/apinoticias/editar/${id}`);
        console.log(this.noticiaAtual)
        const json = await resposta.json();
        this.noticias = json.data || []; 
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    },
    verNoticia(idNoticia) {
      this.noticiaAtual = Number(idNoticia)
      window.location.href = `blogDetailsHemose.html?id=${idNoticia}`;
    },
    puxarStorage() {
      let estadoAtual = (localStorage.getItem('dark') === 'true')
      this.estado = estadoAtual
    }
  },
  mounted() {
    this.myFetch(); 
    this.puxarStorage()
  }
});

