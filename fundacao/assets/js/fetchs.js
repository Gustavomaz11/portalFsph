async function handleGetNoticias () {
    try {
      const resposta = await fetch('http://172.23.42.17:3002/apinoticias/listar/4');
      const json = await resposta.json();
      return json.data
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    }
}

addEventListener('DOMContentLoaded',async ()=>{
    const noticias =  await handleGetNoticias()
    
    const textFsph = document.querySelector('#text-fsph')
    const img_fsph = document.querySelector('#img_fsph')

    const textHemose = document.querySelector('#text-hemose')
    const img_hemose = document.querySelector('#img_hemose')

    const textSvo = document.querySelector('#text-SVO')
    const img_svo = document.querySelector('#img_svo')

    const textLacen = document.querySelector('#text-lacen')
    const img_lacen = document.querySelector('#img_lacen')

    noticias.map((noticia,index)=>{
        
        if(noticia.id_unidade_fk == 1){
            textFsph.innerHTML = noticia.titulo_pri_paragrafo
            img_fsph.src = noticia.foto_capa
        }
        
        else if(noticia.id_unidade_fk == 2){
            textHemose.innerHTML = noticia.titulo_pri_paragrafo
            img_hemose.src = noticia.foto_capa
        }

        else if (noticia.id_unidade_fk == 3){
            textLacen.innerHTML = noticia.titulo_pri_paragrafo
            img_lacen.src = noticia.foto_capa
        }

        else if (noticia.id_unidade_fk == 4){
            textSvo.innerHTML = noticia.titulo_pri_paragrafo
            img_svo.src = noticia.foto_capa
        }
    })
})


