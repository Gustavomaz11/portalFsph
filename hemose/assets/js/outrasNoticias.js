const outrasNoticias = new Vue({
  el: '.outrasNoticias',
  data: {
    primeiraNoticia: {},
    segundaNoticia: {},
    terceiraNoticia: {}
  },
  methods: {
    async outrasNoticias() {
      try {
        const response = await fetch('http://172.23.42.17:3002/apinoticias/listar/3');
        const json = await response.json();

        if (json.data && json.data.length >= 3) {
          const data = json.data;
          this.primeiraNoticia = data[0];
          this.segundaNoticia = data[1];
          this.terceiraNoticia = data[2];
          console.log(this.primeiraNoticia)
          console.log('Notícias carregadas:', data);
        } else {
          console.error('Dados insuficientes retornados pela API:', json.data);
        }
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    }
  },
  mounted() {
    this.outrasNoticias();
  }
});
