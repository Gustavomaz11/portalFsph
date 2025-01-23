const vm = new Vue({
  el: '#agendamentos',
  data: {
    viewModal:false,
    texto: '',
    publicacao: [],
    currentPubli: {
      dt_publicacao: '',
      autor_noticia: '',
      id_unidade: '',
      fotoCapa: '',
      fotoMateria: '',
      fotoMateria2: '',
      titulo: '',
      texto: '',
    },
    titulos: [
      'Tipo',
      'Nome',
      'Contato',
      'Email',
      'Quantidade',
      'Data',
      'Hora/Turno',
      'Funcionalidades'
    ],
    currentAgendamento:{
      contato:'',
      cpf:'',
      dt_agenda:'',
      email:'',
      hr_agenda:'',
      id_agenda:'',
      nome:'',
      qt_pessoas:'',
      tp_agenda:'',
      turno:''
    },
    publicar: false,
    agendamentos: true,
    crop: false,
  },
  methods: {
    async handleDeleteAgendamento (id_agenda){
      try {
        console.log(id_agenda)

        const resJson = await fetch(`http://172.23.42.17:3002/apiagendamento/deletar/${id_agenda}`,{
          method:'DELETE'
        })
  
        const res = await resJson.json()
        
        console.log(res)

        this.publicacao = res
      } catch (error) {
        console.log(error)
      }
    },

    handleCloseModal (evt){
      this.viewModal = false
      document.body.classList.remove('modal-open')
    },

    async handleEditAgendamento (){
      try {
        if(this.currentAgendamento.dt_agenda.includes('/')){
          this.currentAgendamento.dt_agenda = this.currentAgendamento.dt_agenda.split('/').reverse().join('-')
        }
        const resJson = await fetch("http://172.23.42.17:3002/apiagendamento/editar",{
          method:"PATCH",
          headers:{
            'Content-Type':"application/json"
          },
          body:JSON.stringify({
            id_agenda:this.currentAgendamento.id_agenda,
            dt_agenda:this.currentAgendamento.dt_agenda,
            hr_agenda:this.currentAgendamento.hr_agenda,
            tp_agenda:this.currentAgendamento.tp_agenda,
            turno:this.currentAgendamento.turno,
            qt_pessoas:this.currentAgendamento.qt_pessoas
          })
        })

        console.log(resJson)

        if(resJson.status == 200){
          const res = await resJson.json()
          console.log(res)
          this.publicacao = res
        }

        this.viewModal = false
      } catch (error) {
        console.log(error)
      }
    },

    async handleGetById (id_agenda){
      try {
        const resJson = await fetch(`http://172.23.42.17:3002/apiagendamento/pegar/${id_agenda}`)

        if(resJson.status == 200){
          const {data} = await resJson.json()

          console.log(data)
          this.viewModal = true
          document.querySelector('body').classList.add('modal-open')
          this.currentAgendamento.contato=data.contato,
          this.currentAgendamento.cpf=data.cpf,
          this.currentAgendamento.dt_agenda=data.dt_agenda.split('T')[0],
          this.currentAgendamento.email=data.email,
          this.currentAgendamento.hr_agenda=data.hr_agenda,
          this.currentAgendamento.id_agenda=data.id_agenda,
          this.currentAgendamento.nome=data.nome,
          this.currentAgendamento.qt_pessoas=data.qt_pessoas,
          this.currentAgendamento.dp_agenda=data.tp_agenda,
          this.currentAgendamento.turno=data.turno
        }
      } catch (error) {
        
      }
    },

    showModal(){
      this.showmodal = true
      document.querySelector('body').style='heigth:100vh;overflow:hidden;'
    },
    initializeIframeSync() {
      // Wait for iframe to load
      const iframe = document.querySelector('#elm1_ifr');
      if (!iframe) {
        console.error('Iframe not found');
        return;
      }

      iframe.addEventListener('load', () => {
        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;

        // Setup MutationObserver to watch for content changes
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'characterData' ||
              mutation.type === 'childList'
            ) {
              const bodyElement = iframeDocument.querySelector('#tinymce');
              const pElement = iframeDocument.querySelector(
                '.mce-content-body p',
              );

              if (bodyElement.children) {
                let arr = [];
                for (const child of bodyElement.children) {
                  arr.push(child.outerHTML);
                }
                this.texto = arr.join('');
              }
            }
          });
        });

        // Start observing the content
        const contentBody = iframeDocument.querySelector('.mce-content-body');
        if (contentBody) {
          observer.observe(contentBody, {
            characterData: true,
            childList: true,
            subtree: true,
          });
        }

        // Also handle initial content
        const pElement = iframeDocument.querySelector('.mce-content-body p');
        if (pElement) {
          // this.currentPubli.texto = pElement.innerText;
        }
      });
    },

    async myFetch() {
      try {
        const response = await fetch(
          'http://172.23.42.17:3002/apiagendamento/pegar',
        );
        if (!response.ok) {
          throw new Error(`Erro: ${response.statusText}`);
        }
        const json = await response.json();
        this.publicacao = json;
        console.log(json);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    },
    base64ToFile(base64String, fileName) {
      let regex = new RegExp(':|;','g')
      const mimeType = base64String.split(regex)[1];

      // Remove o prefixo "data:image/png;base64," da string Base64, se presente
      const base64Data = base64String.split(',')[1];

      // Converte a Base64 em binário (ArrayBuffer)
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mimeType });

      // Cria o objeto File
      const file = new File([blob], fileName, { type: mimeType });

      return file;
    },
    async publicarNoticia() {
      const dados = new FormData();
      const date = new Date();
      const fullDate = `${date.getFullYear()}-${
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : '0' + date.getMonth() + 1
      }-${date.getDate()}`;
      dados.append('dt_noticia', fullDate);
      dados.append('autor_noticia', 'Rosângela Cruz'); //this.currentPubli.autor_noticia
      dados.append('id_unidade', this.currentPubli.id_unidade);
      dados.append(
        'imagemCapa',
        this.base64ToFile(this.currentPubli.fotoCapa, date.getMilliseconds()),
      );
      dados.append(
        'corpo_1',
        this.base64ToFile(
          this.currentPubli.fotoMateria,
          date.getMilliseconds(),
        ),
      );
      dados.append(
        'corpo_2',
        this.base64ToFile(
          this.currentPubli.fotoMateria2,
          date.getMilliseconds(),
        ),
      );
      dados.append('titulo', this.currentPubli.titulo);
      dados.append('texto', this.texto);
      console.log(this.currentPubli);
      console.log(this.base64ToFile(this.currentPubli.fotoCapa, date.getMilliseconds()))
      try {

        alert('aa');
        const resposta = await fetch(
          'http://172.23.42.17:3002/apinoticias/inserir',
          {
            method: 'POST',
            body: dados,
          },
        );
        alert(resposta.status);
        const result = await resposta.json();
        console.log(result);
      } catch (err) {
        alert(err);
      }
    },
    handleFileChange(event) {
      const fileInput = event.target;
      const fileName = fileInput.name;
      this.publicacao[fileName] = fileInput.files[0];
    },
    handleCut() {
      const img1 = document.querySelector('#img-1');
      const img2 = document.querySelector('#img-2');
      const img3 = document.querySelector('#img-3');

      if (
        !img1.className.includes('usedPreview') ||
        !img2.className.includes('usedPreview')
      ) {
        return;
      }

      this.currentPubli.fotoCapa = img1.src;
      this.currentPubli.fotoMateria = img2.src;
      setTimeout(() => {
        this.currentPubli.fotoMateria2 = img3.src;
      }, 1000);
    },
  },
  created() {
    this.myFetch();
  },
  watch: {
    usuario(newValue, oldValue) {
      console.log(
        `Usuário mudou de ${oldValue} para ${newValue}. Buscando dados...`,
      );
      this.myFetch();
    },
    'currentPubli.texto': function (newValue) {
      const iframe = document.querySelector('#elm1_ifr');
      if (!iframe) return;

      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;
      const pElement = iframeDocument.querySelector('.mce-content-body p');

      if (pElement && pElement.innerText !== newValue) {
        pElement.innerText = newValue;
      }
    },
  },
  mounted() {
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector('#elm1_ifr');
      if (iframe) {
        observer.disconnect();
        this.initializeIframeSync();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    this.currentPubli.autor_noticia = localStorage.getItem('fullName')
  },
});
