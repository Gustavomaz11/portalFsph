const agendamento = new Vue({
  el: '#agendamento-doacao',
  data: {
    exibirDoacaoIndividual: true,
    imagemAtual: 'assets/img/gallery/womanDonate.svg',
    alterarPosicaoImagem: false,
    agendamentoIndividual: {
      primeiraVez:'',
      peso:'',
      tatuPiercing:'',
      doenca:'',
      droga:'',
      relacaoSexual:'',
      sexo:'',
      gestacaoAmamentacao:'',
      nomeCompletoIndividual: '',
      emailIndividual: '',
      telIndividual: '',
      cpfIndividual: '',
      data: '',
      hora: '',
      dt_nascimento: '',
      menorIdade: false,
      arquivoAutorizacao:null
    },
    agendamentoCampanha: {
      nomeResponsavel: '',
      emailResponsavel: '',
      telResponsavel: '',
      qtdPessoas: 1,
      data: '',
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
    handleFileChange(event) {
      const fileInput = event.target;
      this.agendamentoIndividual.arquivoAutorizacao = fileInput.files[0];
    },

    async handlePostDoacaoCam (){
      const {agendamentoCampanha} = this

      let dataAtual = new Date();
      let dia = String(dataAtual.getDate()).padStart(2, '0') 
      let mes = String(dataAtual.getMonth() + 1).padStart(2, '0')
      let ano = dataAtual.getFullYear()
      let dataForm = `${dia}/${mes}/${ano}`

      if(Number(dataForm.split('/').reverse().join('')) - Number(agendamentoCampanha.data.split('/').reverse().join('')) > 0){
        document.querySelector('#dataCampanha').setCustomValidity('Data invalida')
      }else {
        document.querySelector('#dataCampanha').setCustomValidity('')
      }

      const dados = {
        nome:agendamentoCampanha.nomeResponsavel,
        email:agendamentoCampanha.emailResponsavel,
        contato: agendamentoCampanha.telResponsavel,
        turno: agendamentoCampanha.turno,
        qt_pessoas: agendamentoCampanha.qtdPessoas,
        dt_agenda: agendamentoCampanha.data.split('/').reverse().join('-'),
        tp_agenda: 'CAM'
      }

      try {
        const form = document.querySelector("#agendamentoCampanha")

        if(!form.checkValidity()){
          form.reportValidity()
          return
        }

        const url = new URL('http://172.23.42.17:3002/apiagendamento/adicionar');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dados),
        });
    
        const resultado = await response.json();
        if (response.ok) {
          alert('Agendamento realizado com sucesso');
        } else {
          alert(`Erro: ${resultado.message}`);
        }
      } catch (error) {
        alert(`Erro: ${err.message}`);
      }

    },

    async handlePostDoacaoUni (){
      const {agendamentoIndividual} = this
      const form = document.querySelector('#agendamentoDoacaoIndividual')
      let dataAtual = new Date();
      let dia = String(dataAtual.getDate()).padStart(2, '0') 
      let mes = String(dataAtual.getMonth() + 1).padStart(2, '0')
      let ano = dataAtual.getFullYear()
      let dataForm = `${dia}/${mes}/${ano}`
      let idade
      if(agendamentoIndividual.primeiraVez == '1'){
        
        if(ano - Number(dataForm.split('/')[2]) <= 10){
          console.log('aqui')
          idade = String(Number(dataForm.split('/').reverse().join('')) - Number(agendamentoIndividual.dt_nascimento.split('/').reverse().join(''))).substring(0,1)
        } else {
          idade = String(Number(dataForm.split('/').reverse().join('')) - Number(agendamentoIndividual.dt_nascimento.split('/').reverse().join(''))).substring(0,2)
        }

        if(Number(idade) >= 60){
          document.querySelector('#dateNascimento').setCustomValidity('Infelizmente você não pode doar, a idade máxima para a primeira doação é 60 anos')
        }else{
          agendamentoIndividual.arquivoAutorizacao = 
          document.querySelector('#dateNascimento').setCustomValidity('')
        }
      }

      const screenError = document.querySelector('.screenError')

      if(agendamentoIndividual.menorIdade && agendamentoIndividual.arquivoAutorizacao == null){
        screenError.innerText = "É obrigatorio mandar a autorização assinada"
        return
      }else{
        if(document.querySelector('.screenError') != null){
          screenError.innerText = ""
        }
      }
      
      if(!form.checkValidity()){
        form.reportValidity()
        return
      }
      

      try {
        const dados = new FormData()
        dados.append('nome',agendamentoIndividual.nomeCompletoIndividual)
        dados.append('email',agendamentoIndividual.emailIndividual)
        dados.append('contato',agendamentoIndividual.telIndividual)
        dados.append('cpf',agendamentoIndividual.cpfIndividual.replace(/(\.|-)/g,''))
        dados.append('dt_agenda',agendamentoIndividual.data.split('/').reverse().join('-'))
        dados.append('hr_agenda',agendamentoIndividual.hora)
        dados.append('tp_agenda','UNI')
        dados.append('arquivo_autorizacao',agendamentoIndividual.arquivoAutorizacao)


        const url = new URL('http://172.23.42.17:3002/apiagendamento/adicionar');
        const response = await fetch(url, {
          method: 'POST',
          body: dados,
        });
    
        const resultado = await response.json();
        console.log(resultado)
        if (response.ok) {
          alert('Agendamento realizado com sucesso');
        } else {
          alert(`Erro: ${resultado.msg}`);
        }
      } catch (err) {
        alert(`Erro: ${err.message}`);
      }
    },

    nextForm (evt){
      const form = document.querySelector('#preTriagem')

      if(this.agendamentoIndividual.peso == '0'){
        document.querySelector('#peso').setCustomValidity('Infelizmente você não pode doar, é preciso pesar mais de 50Kg')
      }else{
        document.querySelector('#peso').setCustomValidity('')
      }

      if(this.agendamentoIndividual.tatuPiercing == '1'){
        document.querySelector('#temTatu').setCustomValidity('Infelizmente você não pode doar')
      }else {
        document.querySelector('#temTatu').setCustomValidity('')
      }

      if(this.agendamentoIndividual.doenca == '1'){
        document.querySelector('#doencaTransmissivel').setCustomValidity('Infelizmente você não pode doar')
      }else {
        document.querySelector('#doencaTransmissivel').setCustomValidity('')
      }

      if(this.agendamentoIndividual.droga == '1'){
        document.querySelector('#usuarioDroga').setCustomValidity('Infelizmente você não pode doar')
      }else {
        document.querySelector('#usuarioDroga').setCustomValidity('')
      }

      if(this.agendamentoIndividual.relacaoSexual == '1'){
        document.querySelector('#sexoUltimoAno').setCustomValidity('Infelizmente você não pode doar')
      }else {
        document.querySelector('#sexoUltimoAno').setCustomValidity('')
      }

      if(this.agendamentoIndividual.gestacaoAmamentacao == '1'){
        document.querySelector('#gestacaoOuAmamentacao').setCustomValidity('Infelizmente você não pode doar')
      }else {
        document.querySelector('#gestacaoOuAmamentacao')?.setCustomValidity('')
      }

      if(!form.checkValidity()){
        form.reportValidity()
        return
      }

      const itens = document.querySelectorAll('.itemCarrosselAgendamento')
      itens.forEach((item)=>{
        item.style = `transform: translateX(-100%);`
      })
    },

    prevForm (){
      const itens = document.querySelectorAll('.itemCarrosselAgendamento')
      itens.forEach((item)=>{
        item.style = ''
      })
    },

    transicao() {
      this.alterarPosicaoImagem = !this.alterarPosicaoImagem;
      this.exibirDoacaoIndividual = !this.exibirDoacaoIndividual;
      this.imagemAtual = this.exibirDoacaoIndividual
        ? 'assets/img/gallery/womanDonate.svg'
        : 'assets/img/gallery/1.svg';

      const divImg = document.querySelector('.form-shape')
      if(!this.exibirDoacaoIndividual) {
        divImg.classList.remove('divImgRight')
        divImg.classList.add('leftImg')
      }else {
        // form.classList.remove('formRight')
        divImg.classList.add('divImgRight')
        divImg.classList.remove('leftImg')
      }
    },

    maskForDate (evt){
      let data = evt.target.value
      data = data.replace(/\D/g, "")

      if (data.length > 8) {
          data = data.substring(0, 8)
      }

      if (data.length <=4){
        data = data.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }else {
        data = data.replace(/(\d{2})(\d{2})(\d{1,4})$/, "$1/$2/$3");
      }

      let arrName = evt.target.name.split('-')

      console.log(arrName)
      console.log(data)

      if(arrName[0] == 'dt_nascimento' && data.length == 10){
        let dataAtual = new Date();
        let dia = String(dataAtual.getDate()).padStart(2, '0') 
        let mes = String(dataAtual.getMonth() + 1).padStart(2, '0')
        let ano = dataAtual.getFullYear()
        let dataForm = `${dia}/${mes}/${ano}`
        
        let idade
        if(ano - Number(data.split('/')[2]) <= 10){
          console.log('aqui')
          idade = String(Number(dataForm.split('/').reverse().join('')) - Number(data.split('/').reverse().join(''))).substring(0,1)
        } else {
          idade = String(Number(dataForm.split('/').reverse().join('')) - Number(data.split('/').reverse().join(''))).substring(0,2)
        }

        if(Number(idade) < 18){
          this.agendamentoIndividual.menorIdade = true
        }else {
          this.agendamentoIndividual.menorIdade = false
        }
      }

      if(arrName[1] == 'uni'){
        this.agendamentoIndividual[arrName[0]] = data
      }else{
        console.log(this.agendamentoCampanha[arrName[0]])
        this.agendamentoCampanha[arrName[0]] = data
      }

    },

    maskForCpf (evt){
      let cpf = evt.target.value
      cpf = cpf.replace(/\D/g, "")

      if(cpf.length > 11){
        cpf = cpf.substring(0, 11)
      }

      if(cpf.length <= 6){
        cpf = cpf.replace(/(\d{3})(\d{3})/, "$1.$2")
      }else if(cpf.length <= 9){
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3")
      } else{
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
      }

      this.agendamentoIndividual.cpfIndividual = cpf
    },

    maskForHora (evt){
      let hora = evt.target.value

      hora = hora.replace(/\D/g, "")

      if(hora.length > 4){
        hora = hora.substring(0,4)
      }

      if(hora.length == 2){
        hora = hora + '00'
      }

      if(hora.length == 3){
        hora = hora + '0'
      }

      hora = hora.replace(/(\d{2})(\d{2})/, "$1:$2")

      this.agendamentoIndividual.hora = hora
    }
  },
});
