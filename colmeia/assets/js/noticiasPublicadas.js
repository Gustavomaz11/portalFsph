const publicacoesNoticias = new Vue({
  el: '#noticiasPublicadas',
  data: {
    usuario: 'Gustavo',
    data: '2025-04-04',
    selectNoticia: {},
    filterAtivado: false,
    noticiasFiltradas: [],
    todasNoticias: [],
    ativarDrop: false,
    texto: '',
    arrFilterAtive:[],
    arrFilterUnidade:[],
    carregando:false,
    publicacao: {
      id_noticia: '',
      dt_publicacao: '',
      autor_noticia: '',
      id_unidade: '',
      fotoCapa: '',
      fotoMateria: '',
      fotoMateria2: '',
      titulo: '',
      texto: '',
      ativo: '',
    },
    crop: false,
  },
  methods: {
    async changeStatus(id_noticia,ativo){
      try {
        const resJson = await fetch('http://172.23.42.17:3002/apinoticias/alterarstatus',
        {
          method:'PATCH',
          headers:{
            'Content-Type':"application/json"
          },
          body:JSON.stringify({
            id_noticia,
            atualStatus:ativo
          })
        })
        
        if(resJson.status == 200){
          const res = await resJson.json()
          if(!this.filterAtivado){
            this.todasNoticias = res.data
          }else{
            this.todasNoticias = res.data
            this.noticiasFiltradas = res.data
          }
        }

      } catch (error) {
        alert(error.message)
      }
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

              if (bodyElement.children) {
                let arr = [];
                for (const child of bodyElement.children) {
                  arr.push(child.outerHTML);
                }
                this.publicacao.texto = arr.join('');
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
    base64ToFile(base64String, fileName) {
      const mimeType = base64String.split('/:|;/')[1];
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
    async handleEditNoticia() {
      const data = new FormData();
      const date = new Date();
      const fullDate = `${date.getFullYear()}-${
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : '0' + date.getMonth() + 1
      }-${date.getDate()}`;
      data.append('id_unidade', this.publicacao.id_unidade);
      data.append('dt_noticia', this.publicacao.dt_publicacao.split('T')[0]);
      data.append('autor_noticia', 'Autor');
      data.append('titulo', this.publicacao.titulo);
      data.append('texto', this.publicacao.texto);
      data.append('ativo', this.publicacao.ativo);
      data.append('id_noticia', this.publicacao.id_noticia);

      // Converte Base64 para arquivo
      if (this.publicacao.fotoCapa) {
        data.append(
          'imagemCapa',
          this.base64ToFile(this.publicacao.fotoCapa, date.getMilliseconds()),
        );
      }
      if (this.publicacao.fotoMateria) {
        data.append(
          'corpo_1',
          this.base64ToFile(
            this.publicacao.fotoMateria,
            date.getMilliseconds(),
          ),
        );
      }
      if (this.publicacao.fotoMateria2) {
        data.append(
          'corpo_2',
          this.base64ToFile(
            this.publicacao.fotoMateria2,
            date.getMilliseconds(),
          ),
        );
      }

      try {
        const resJson = await fetch(
          `http://172.23.42.17:3002/apinoticias/atualizar`, // Corrigido "atulizar" para "atualizar"
          {
            method: 'POST',
            body: data,
          },
        );

        if (resJson.status == '200') {
          const res = await resJson.json();
          this.todasNoticias = res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async handleGetNew(id_noticia) {
      try {
        const resJson = await fetch(
          `http://172.23.42.17:3002/apinoticias/editar/${id_noticia}`,
        );
        const res = await resJson.json();

        this.publicacao.autor_noticia = res.data.autor_noticia;
        this.publicacao.dt_publicacao = res.data.dt_noticia;
        this.publicacao.titulo = res.data.titulo;
        this.publicacao.id_unidade = res.data.id_unidade_fk;
        this.publicacao.fotoCapa = res.data.foto_capa;
        this.publicacao.fotoMateria = res.data.foto_i;
        this.publicacao.fotoMateria2 = res.data.foto_ii;
        this.publicacao.texto = res.data.texto;
        this.publicacao.id_noticia = res.data.id_noticia;
        this.publicacao.ativo = res.data.ativo;

        const iframe = document.querySelector('#elm1_ifr');

        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;
        const bodyElement = iframeDocument.querySelector('#tinymce');
        bodyElement.innerHTML = this.publicacao.texto;

        const img1 = document.querySelector('#img-1');
        const img2 = document.querySelector('#img-2');
        const img3 = document.querySelector('#img-3');

        img1.src = this.publicacao.fotoCapa;
        img1.classList.add('usedPreview');

        img2.src = this.publicacao.fotoMateria;
        img2.classList.add('usedPreview');

        img3.src = this.publicacao.fotoMateria2;
        img3.classList.add('usedPreview');
      } catch (error) {
        console.error(error.message);
      }
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

      this.publicacao.fotoCapa = img1.src;
      this.publicacao.fotoMateria = img2.src;
      setTimeout(() => {
        this.publicacao.fotoMateria2 = img3.src;
      }, 1000);
    },

    handleFileChange(event) {
      const fileInput = event.target;
      const fileName = fileInput.name;
      this.publicacao[fileName] = fileInput.files[0];
    },

    handleAddFilter(evt){
      let valueFilter = evt.target.value.split('-')
      if(evt.target.checked){
        this.filterAtivado = true
        if(valueFilter[0] == 'unidade'){
          this.arrFilterUnidade.push(valueFilter[1])
        }else{
          this.arrFilterAtive.push(valueFilter[1])
        }

        console.log(this.arrFilterAtive)
      }else{
        if(valueFilter[0] == 'unidade'){
          this.arrFilterUnidade = this.arrFilterUnidade.filter(current =>current != valueFilter[1])
        }else{
          this.arrFilterAtive = this.arrFilterAtive.filter(current =>current != valueFilter[1])
        }
      }
      this.handleFilter()
    },

    async handleFilter (){
      const divAnimation = document.querySelector('#animationSandbox')
      let interval = null
      let interval2 = null
      try {

        if(this.arrFilterAtive.length == 0 && this.arrFilterUnidade.length == 0){
          this.noticiasFiltradas = []
          this.filterAtivado = false
          return
        }

          this.carregando = true

          divAnimation.classList.add('flip')
          divAnimation.classList.add('animated')
          

          interval2 = setInterval(()=>{
            divAnimation.classList.remove('flip')
            divAnimation.classList.remove('animated')
          },1000)

          interval = setInterval(()=>{
            divAnimation.classList.add('flip')
            divAnimation.classList.add('animated')
          },2000)

          this.arrFilterAtive = this.arrFilterAtive.sort((a,b)=> b-a)
          const resJson = await fetch(`http://172.23.42.17:3002/apinoticias/filtro/${this.arrFilterUnidade.toString() == ''?'1,2,3,4':this.arrFilterUnidade.toString()}/${this.arrFilterAtive.toString() == ''?1:this.arrFilterAtive.toString()}`)
            
            const res = await resJson.json()
            if(res.status == 200){
              this.noticiasFiltradas = res.data
            }


        } catch (error) {
          console.log(error.message)
        }
        
        clearInterval(interval)
        clearInterval(interval2)
        divAnimation.classList.remove('flip')
        divAnimation.classList.remove('animated')
        this.carregando = false
    },

    async puxarNoticiasPublicadas() {
      try {
        const resposta = await fetch(
          'http://172.23.42.17:3002/apinoticias/listar/0',
        );
        const json = await resposta.json();
        if (Array.isArray(json.data)) {
          this.todasNoticias = json.data; // Certifique-se de que json é um array
        } else {
          console.error('Os dados recebidos não são um array:', json);
          this.todasNoticias = []; // Reverte para array vazio se o formato estiver errado
        }
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        this.todasNoticias = [];
      }
    },
  },

  mounted() {
    this.puxarNoticiasPublicadas();
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector('#elm1_ifr');
      if (iframe) {
        observer.disconnect();
        this.initializeIframeSync();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },

  computed: {
    noticiasFiltradas() {
      if (!Array.isArray(this.todasNoticias)) {
        return []; // Retorna array vazio se não for um array
      }

      return this.todasNoticias.filter((noticia) => {
        const ativoMatch =
          this.seAtivado.length === 0 ||
          (this.seAtivado.includes('ativo') && noticia.ativo) ||
          (this.seAtivado.includes('desativo') && !noticia.ativo);

        const unidadeMatch =
          this.idDaUnidade.length === 0 ||
          this.idDaUnidade.includes(String(noticia.id_unidade_fk));

        return ativoMatch && unidadeMatch;
      });
    },
  },
});
