const global = new Vue({
  el: '#app',
  data: {
    usuario: '',
    senha: '',
    token: '',
    dominioEscolhido: '',
    dadosAutenticados: [],
    dominiosDisponiveis: []
  },
  methods: {
    async acessarColmeia() {
      try {
        const response = await fetch(
          'http://172.23.42.17:3003/apiauth/autenticar',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: this.usuario,
              password: this.senha,
              domain: this.dominioEscolhido
            }),
          },
        );
        console.log(this.dominioEscolhido)

        // Verifica se a resposta é bem-sucedida
        if (!response.ok) {
          throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        // Processa a resposta JSON
        const data = await response.json();

        // Salva o token no estado
        this.token = data.data.token;
        sessionStorage.setItem('authToken', this.token)
        sessionStorage.setItem('domain', this.dominioEscolhido)
        console.log(this.dominioEscolhido)
        window.location.href = 'mainPage.html'
        
      } catch (error) {
        console.error('Erro ao acessar Colmeia:', error.message);
        alert(
          'Falha ao realizar login. Verifique suas credenciais e tente novamente.',
        );
      }
    },
    async pegarDominio() {
      const respostaDominio = await fetch(`http://172.23.42.17:3003/apiauth/obterdominios`)
      const jsonDominios = await respostaDominio.json()
      this.dominiosDisponiveis = jsonDominios
      console.log(jsonDominios)
      return jsonDominios
    },
    limparStorage() {
      sessionStorage.clear();
      console.log('Storage Limpo')
    }
  },
  mounted() {
    this.pegarDominio()
    this.limparStorage()
  }
});
