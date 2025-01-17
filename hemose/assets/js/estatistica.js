document.addEventListener('DOMContentLoaded', () => {
  const estatistica = new Vue({
    el: '#estatistica',
    data: {
      doacoes: 0,
      transfusoes: 0,
      externas: 0,
      atendimento: 0,
      animDoacoes: 0,
      animTransfusoes: 0,
      animExternas: 0,
      animAtendimento: 0,
      animado: false, // Flag para verificar se a animação já ocorreu
    },
    methods: {
      async puxarEstatisticas() {
        const response = await fetch(
          'http://172.23.42.17:3002/apiinterface/estatistica',
        );
        const json = await response.json();

        this.doacoes = json.data.qtd_doacoes;
        this.transfusoes = json.data.qtd_transfusoes;
        this.externas = json.data.qtd_doacoes_ext;
        this.atendimento = json.data.qtd_atendimentos;

        return json;
      },
      animarContador(campo, valorFinal, duracao = 1000) {
        const inicio = 0;
        const incremento = valorFinal / (duracao / 16); //  ~60fps

        const animar = () => {
          if (this[campo] < valorFinal) {
            this[campo] = Math.min(this[campo] + incremento, valorFinal);
            requestAnimationFrame(animar);
          }
        };

        this[campo] = inicio;
        animar();
      },
      iniciarAnimacao() {
        if (!this.animado) {
          this.animarContador('animDoacoes', this.doacoes);
          this.animarContador('animTransfusoes', this.transfusoes);
          this.animarContador('animExternas', this.externas);
          this.animarContador('animAtendimento', this.atendimento);
          this.animado = true; 
        }
      },
      formatarNumero(valor) {
        if (valor >= 10000) {
          return (valor / 1000).toFixed(1) + 'k';
        } else if (valor >= 1000) {
          return Math.floor(valor / 1000) + 'k';
        }
        return valor;
      },
    },
    mounted() {
      this.puxarEstatisticas().then(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.iniciarAnimacao(); 
              observer.unobserve(entry.target); 
            }
          });
        });

        // Observa a seção de estatísticas
        const target = document.querySelector('#estatistica');
        if (target) {
          observer.observe(target);
        }
      });
    },
  });
});
