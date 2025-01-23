const estoque = new Vue({
  el: '#estoqueResponsivo',
  data: {
    estoque: [],
    dark: false
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
    modoDark() {
      this.dark = (localStorage.getItem('dark') === 'true' || false)
    }
    
  },
  mounted() {
    this.puxarEstoque()
    this.modoDark()
  }
})