const mainPage = new Vue({
  el: '#mainPage',
  data: {
    credenciais: [],
    dadosAutenticados: null,
    tokenAutenticacao: '',
    dominioAtual: '',
  },
  methods: {
    async puxarAutenticacao() {
      const tokenCredenciais = sessionStorage.getItem('authToken');
      const dominioAutorizado = sessionStorage.getItem('domain');

      if (!this.validarToken(tokenCredenciais)) {
        window.location.href = 'auth-500.html';
      }

      if (!tokenCredenciais) {
        throw new Error('Erro: Token de autenticação ausente.');
      }

      if (!dominioAutorizado) {
        throw new Error('Erro: Domínio autorizado ausente.');
      }

      this.dominioAtual = dominioAutorizado;
      this.tokenAutenticacao = tokenCredenciais;

      try {
        const response = await fetch(
          `http://172.23.42.17:3003/apiauth/obtercredenciais/${this.dominioAtual}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokenCredenciais}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        this.dadosAutenticados = data;
        console.log(this.dadosAutenticados);
        localStorage.setItem('fullName',data.data.user.fullname)
      } catch (error) {
        console.error('Erro ao obter dados de autenticação:', error);
        alert('Falha ao obter dados de autenticação. Verifique seu token.');
      }
    },
    validarToken(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const agora = Math.floor(Date.now() / 1000);
        return payload.exp > agora;
      } catch (error) {
        console.error('Erro ao validar o token:', error);
        return false;
      }
    },
  },
  computed: {
    primeiroENomeFinal() {
      if (
        !this.dadosAutenticados ||
        !this.dadosAutenticados.data ||
        !this.dadosAutenticados.data.user ||
        !this.dadosAutenticados.data.user.fullname
      ) {
        return '';
      }

      const fullname = this.dadosAutenticados.data.user.fullname;
      const names = fullname.split(' ');
      if (names.length > 1) {
        return `${names[0]} ${names[names.length - 1]}`; 
      }
      return names[0]; 
    },
  },

  created() {
    this.puxarAutenticacao();
  },
});
