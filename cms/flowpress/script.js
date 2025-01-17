const vm = new Vue({
  el: '#app',
  data: {
    usuario: 'Gustavo',
    data: '2025-04-04',
    publicacao: {
      dt_publicacao: this.data,
      autor: 'Gustavo',
      id_unidade: null,
      fotoCapa: null,
      fotoMateria: null,
      fotoMateria2: null,
      titulo: '',
      paragrafo1: '',
      paragrafo2: '',
      paragrafo3: '',
      paragrafo4: '',
      subtitulo: '',
      sub1: '',
      sub2: '',
      citacao: '',
      pessoaCitada: ''
    },
    titulos: ['Tipo', 'Nome', 'CPF', 'Contato', 'Email', 'Quantidade', 'Data', 'Hora/Turno'],
    publicar: false,
    agendamentos: true
    
  },
  methods: {
    async myFetch() {
      try {
        const response = await fetch('http://172.23.42.17:3002/apiagendamento/');
        if (!response.ok) {
          throw new Error(`Erro: ${response.statusText}`);
        }
        const json = await response.json();
        this.publicacao = json;
        console.log(json)
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    },
    async publicarNoticia() {
      const dados = new FormData()
      dados.append('dt_noticia', '2025-04-04')
      dados.append('autor_noticia', 'Gustavo Machado')
      dados.append('id_unidade', this.publicacao.id_unidade)
      dados.append('imagemCapa', this.publicacao.fotoCapa)
      dados.append('corpo_1', this.publicacao.fotoMateria)
      dados.append('corpo_2', this.publicacao.fotoMateria2)
      dados.append('titulo', this.publicacao.titulo)
      dados.append('titulo_pri_paragrafo', this.publicacao.paragrafo1)
      dados.append('titulo_seg_paragrafo', this.publicacao.paragrafo2)
      dados.append('titulo_ter_paragrafo', this.publicacao.paragrafo3)
      dados.append('titulo_qua_paragrafo', this.publicacao.paragrafo4)
      dados.append('subtitulo', this.publicacao.subtitulo)
      dados.append('subtitulo_pri_paragrafo', this.publicacao.sub1)
      dados.append('subtitulo_seg_paragrafo', this.publicacao.sub2)
      dados.append('comentario', this.publicacao.citacao)
      dados.append('colaborador', this.publicacao.pessoaCitada)

      try {
        alert('aa')
        const resposta = await fetch('http://172.23.42.17:3002/apinoticias/inserir', {
          method: 'POST',
          body: dados,
        });
        alert(resposta.status)
        const result = await resposta.json();
        console.log(result)
      } catch (err) {
        alert(err)
      }
    },
    handleFileChange(event) {
      const fileInput = event.target;
      const fileName = fileInput.name;
      this.publicacao[fileName] = fileInput.files[0];
    },
    

  },
  watch: {
    usuario(newValue, oldValue) {
      console.log(`Usuário mudou de ${oldValue} para ${newValue}. Buscando dados...`);
      this.myFetch();
    }
  },
  created() {
    this.myFetch();
  }
});
