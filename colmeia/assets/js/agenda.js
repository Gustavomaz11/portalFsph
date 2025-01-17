const vm3 = new Vue({
  el: '#eventos',
  data: {
    dados: {
      evento: null,
      ids_unidades_fk: [],
      dt_evento: null,
    },
    depoimentos: {
      nome: '',
      depoimento: '',
      foto: null,
      nota:'',
      ocupacao:''
    },
    funcionamento: {
      domingo: {
        dia: 'Domingo',
        horaInicio: '',
        horaFim: ''
      },
      segunda: {
        dia: 'Segunda-Feira',
        horaInicio: '',
        horaFim: ''
      },
      terca: {
        dia: 'Terça-Feira',
        horaInicio: '',
        horaFim: ''
      },
      quarta: {
        dia: 'Quarta-Feira',
        horaInicio: '',
        horaFim: ''
      },
      quinta: {
        dia: 'Quinta-Feira',
        horaInicio: '',
        horaFim: ''
      },
      sexta: {
        dia: 'Sexta-Feira',
        horaInicio: '',
        horaFim: ''
      },
      sabado: {
        dia: 'Sábado',
        horaInicio: '',
        horaFim: ''
      },

    }
  },
  methods: {
    async publicarEvento() {
      try {
        alert('Enviando dados...');
        const resposta = await fetch(
          'http://172.23.42.17:3002/apiagendamentoevento/adicionar',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dt_evento: this.dados.dt_evento,
              ids_unidades_fk: this.dados.ids_unidades_fk,
              evento: this.dados.evento,
            }),
          },
        );
        // alert(`Status: ${resposta.status}`);
        const result = await resposta.json();
        console.log(result);
      } catch (err) {
        alert(`Erro: ${err.message}`);
      }
    },
    async publicarDepoimento() {
      const dados = new FormData();
      dados.append('nome_criador', this.depoimentos.nome);
      dados.append('texto_depoimento', this.depoimentos.depoimento);
      dados.append('nota_depoimento', this.depoimentos.nota)
      dados.append('foto_criador', this.depoimentos.foto);
      dados.append('ocupacao_criador', this.depoimentos.ocupacao)

      try {
        alert('aa');
        const resposta = await fetch(
          'http://172.23.42.17:3002/apidepoimento/criar',
          {
            method: 'POST',
            body: dados,
          },
        );
        alert(resposta.status);
        const result = await resposta.json();
        console.log(result);

        const form = document.querySelector('#formCreate')
        form.reset()

      } catch (err) {
        alert(err);
      }
    },
    handleFileChange(event) {
      const fileInput = event.target;
      const fileName = fileInput.name;
      this.depoimentos['foto'] = fileInput.files[0];
    },
  },
});
