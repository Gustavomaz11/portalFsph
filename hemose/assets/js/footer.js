const footer = new Vue({
  el: '.footer-layout1',
  data: {
    noticiasMaisRecente: null,
    segundaNoticiaMaisRecente: null
  },
  methods: {
    async noticiasFooter() {
      try {
        const response = await fetch('http://172.23.42.17:3002/apinoticias/listar/3');
        const json = await response.json();
        console.log(json)

        if (json.data && json.data.length >= 3) {
          const data = json.data;
          this.noticiasMaisRecente = data[0]; 
          this.segundaNoticiaMaisRecente = data[1]; 
        } else {
          console.error('Dados insuficientes retornados pela API');
        }
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    }
  },
  mounted() {
    this.noticiasFooter()
  }
})