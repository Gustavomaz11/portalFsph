const agendamento = new Vue({
  el: '#agendamento-doacao',
  data: {
    exibirDoacaoIndividual: true,
    imagemAtual: 'assets/img/gallery/womanDonate.svg',
    alterarPosicaoImagem: false,
    agendamentoIndividual: {
      nomeCompletoIndividual: '',
      emailIndividual: '',
      telIndividual: '',
      cpfIndividual: '',
      data: '',
      hora: '',
      dt_nascimento: '',
      menorIdade: '',
    },
    agendamentoCampanha: {
      nomeResponsavel: '',
      emailResponsavel: '',
      telResponsavel: '',
      qtdPessoas: '',
      dataCampanha: '',
      turno: '',
    },
  },
  computed: {
    imagemClass() {
      return this.alterarPosicaoImagem
        ? 'alterarPosicaoImagem'
        : 'voltarPosicaoImagem';
    },
  },
  methods: {
    transicao() {
      // this.imagemClass()
      this.alterarPosicaoImagem = !this.alterarPosicaoImagem;
      this.exibirDoacaoIndividual = !this.exibirDoacaoIndividual;
      this.imagemAtual = this.exibirDoacaoIndividual
        ? 'assets/img/gallery/womanDonate.svg'
        : 'assets/img/gallery/1.svg';
      this.alterarPosicaoImagem
        ? 'alterarPosicaoImagem'
        : 'voltarPosicaoImagem';
    },
  },
});
