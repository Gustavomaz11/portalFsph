const vm2 = new Vue({
  el: '#detalheNoticia',
  data: {
    noticias: [],
    noticiaAtual: ''
  },
  methods: {
    async myFetch() {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        const resposta = await fetch(`http://172.23.42.17:3002/apinoticias/editar/${id}}`);
        console.log(this.noticiaAtual)
        const json = await resposta.json();
        this.noticias = json.data || []; 
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    },
    verNoticia(idNoticia) {
      this.noticiaAtual = Number(idNoticia)
      window.location.href = `blog-details.html?id=${idNoticia}`;
    }
  },
  mounted() {
    this.myFetch(); 
  }
});

const agendaEventos = new Vue({
  el: '#eventos',
  data: {
    eventosPublicados: {}
  },
  methods: {
    async puxarEventos() {
      try {
        const resposta = await fetch('http://172.23.42.17:3002/apiagendamentoevento/pegar');
        const json = await resposta.json();
        this.eventosPublicados = {
          ...json,
          data: json.data.map(evento => ({
            ...evento,
            dt_evento: this.formatarData(evento.dt_evento) 
          }))
        };
        console.log(this.eventosPublicados);
      } catch (erro) {
        console.error('Erro ao puxar eventos:', erro);
      }
    },
    formatarData(dataISO) {
      console.log(dataISO)
      const data = new Date(dataISO);
      const dia = (data.getDate() +1 ).toString()
      const mes = (data.getMonth() + 1).toString()
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
  },
  mounted() {
    this.puxarEventos();
  }
});