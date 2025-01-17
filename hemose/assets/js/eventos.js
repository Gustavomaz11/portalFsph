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

        // Processa os dados para formatar as datas
        this.eventosPublicados = {
          ...json,
          data: json.data.map(evento => ({
            ...evento,
            dt_evento: this.formatarData(evento.dt_evento) // Formata a data
          }))
        };
        console.log(this.eventosPublicados);
      } catch (erro) {
        console.error('Erro ao puxar eventos:', erro);
      }
    },
    formatarData(dataISO) {
      // Converte a data ISO para o formato brasileiro
      const data = new Date(dataISO);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
  },
  mounted() {
    this.puxarEventos();
  }
});
