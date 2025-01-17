const email = new Vue({
  el: '#emailExpresso',
  data: {
    emails: {}
  },
  methods: {
    async emailExpresso() {
      const resposta = await fetch('http://172.23.42.17:3002/apiemail/listar')
      const json = await resposta.json()
      this.emails = json
      console.log(json)
      return json
    }
  },
  mounted() {
    this.emailExpresso()
  }
})