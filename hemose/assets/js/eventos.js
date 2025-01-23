const agendaEventos = new Vue({
  el: '#eventos',
  data: {
    verDetalhes:false,
    eventosPublicados: {},
    eventosDetalhados:{}
  },
  methods: {
    async puxarEventos() {
      try {
        const resposta = await fetch('http://172.23.42.17:3002/apiagendamentoevento/pegar/2');
        const json = await resposta.json();

        this.eventosPublicados = json.data  
        
      
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
    },

    async verMais (id_unidade_fk,id_aux_evento){
      try {
        const resJson = await fetch(`http://172.23.42.17:3002/apiagendamentoevento/pegardetalhado/${id_unidade_fk}/${id_aux_evento}`)

        const res = await resJson.json()

        this.eventosDetalhados = res.data

        console.log(this.eventosDetalhados)

        this.verDetalhes = true
      } catch (error) {
        
      }


    }
  },
  mounted() {
    this.puxarEventos();
  }
});
