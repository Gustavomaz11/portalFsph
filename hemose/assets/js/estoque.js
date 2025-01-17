const estoque = new Vue({
  el: '#estoqueResponsivo',
  data: {
    estoque: []
  },
  methods: {
    async puxarEstoque() {
      console.log('entrou')
      try {
        const resposta = await fetch('http://172.23.42.17:3002/apiinterface/estoque')
        const json = await resposta.json()
        this.estoque = json
        console.log(this.estoque)
      } catch (err) {
        console.error(`Erro: ${err}`)
      }
    },
    
  },
  mounted() {
    this.puxarEstoque()
  }
})