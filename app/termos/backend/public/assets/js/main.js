window.addEventListener('load', function() {
  
  const descr = this.document.getElementById('descr').value;
  const status = this.document.getElementById('sel-status').value;

  PesquisarDados(descr,status)
  
});

function PesquisarDados(descr,status) {

  const tboby = this.document.getElementById('tbody')

  tboby.innerHTML = null

  SendDataController('/load-main',{descr,status},'POST', (res) => {

    res.data.map((obj) => {

      const valor = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.val_medio);
      const data = new Date(obj.dt_processo).toJSON().substring(0,10)
      
      const tr = `<tr>
        <td>${obj.id_objeto}</td>
        <td>${obj.num_processo}</td>
        <td>${data}</td>
        <td>${obj.objeto}</td>
        <td>${valor}</td>
        <td>
          <img src="assets/img/edit.svg" height="18" onClick="EditarTermo(${obj.id_objeto})">
          <img class="ms-2" src="assets/img/attachment.svg" height="18" onClick="ListarAnexos(${obj.id_objeto})">
          <img class="ms-2" src="assets/img/upload.svg" height="20" onClick="AnexarArquivo(${obj.id_objeto})">
        </td>
      </tr>`

      tboby.innerHTML += tr

    });

  });


}

function NovoTermo() {

  document.getElementById('nr-processo-ins').value = null;
  document.getElementById('objeto-ins').value = null;
  document.getElementById('dt-processo-ins').value = new Date().toJSON().substring(0,10)
  document.getElementById('val-medio-ins').value = 0;
  document.getElementById('sel-status-ins').value = '0';

  AbrirModal('modal-termo-ins')

}

function InserirTermo() {

  try {

    if (!document.getElementById('nr-processo-ins').value) {
      document.getElementById('nr-processo-ins').focus()
      throw new Error('Digite o numero do processo.')
    }  

    if (!document.getElementById('objeto-ins').value) {
      document.getElementById('objeto-ins').focus()
      throw new Error('Digite a descrição do onjeto.')
    }

    if (document.getElementById('sel-status-ins').value == '0') {
      document.getElementById('sel-status-ins').focus()
      throw new Error('Selecione um status.')
    }

    const dados = {
      nr_processo: document.getElementById('nr-processo-ins').value,
      dt_processo: document.getElementById('dt-processo-ins').value,
      objeto: document.getElementById('objeto-ins').value,
      val_medio: document.getElementById('val-medio-ins').value,
      status: opt('sel-status-ins').value
    }
  
    SendDataController('/termo/inserir',dados,'POST', (res) => {
  
      alert(res.msg)
  
      document.getElementById('close-modal').click();
  
    });
  
  } 
  catch(error) {
    alert(error.message)
  }

}

function EditarTermo(id) {

  SendDataController(`/termo/edit/${id}`,{},'GET', (res) => {

    res.data.map( (value) => {

      const data = new Date(value.dt_processo).toJSON().substring(0,10)

      document.getElementById('id-objeto').value = value.id_objeto;
      document.getElementById('nr-processo-upt').value = value.num_processo;
      document.getElementById('dt-processo-upt').value = data;
      document.getElementById('objeto-upt').value = value.objeto;
      document.getElementById('val-medio-upt').value = value.val_medio;
      document.getElementById('sel-status-upt').value = value.status;

    });

    AbrirModal('modal-termo-upt')

  });

}

function AnexarArquivo(id) {

  
  AbrirModal('modal-upload')

  document.getElementById('id-objeto-up').value = id

}

function Upload() {

  let arquivo = document.getElementById('arquivo').files[0];
  let id_objeto = document.getElementById('id-objeto-up').value;
  let nm_anexo = document.getElementById('txt-nm-anexo').value;

  try {

    if (!arquivo) {
      throw new Error('Selecione um arquivo para Upload.')
    }
    
    if (!nm_anexo) {
      throw new Error('Digite o nome do anexo.')
    }
    
    const arquivos_permitidos = ['image/jpeg','image/png','application/pdf'];
    const arquivo_tamanho_permitido = (1024 * 1024) * 5.0

    if (!arquivos_permitidos.includes(arquivo.type)) {
      throw new Error('Tipo de arquivo não permitido.');
    }

    if (arquivo.size > arquivo_tamanho_permitido) {
      throw new Error('Tamanho do arquivo não permitido.');
    }

    const nm_arquivo = arquivo.name;
 
    const dados = new FormData();

    dados.append('arquivo', arquivo, nm_arquivo);
    dados.append('id_objeto', id_objeto);
    dados.append('nm_anexo',nm_anexo);

    UploadFiles('/termo/anexar',dados, (res) => {
      
      alert(res.msg)

      document.getElementById('arquivo').value = null;
      document.getElementById('id-objeto-up').value = null;
      document.getElementById('txt-nm-anexo').value = null;
      document.getElementById('txt-arquivo').value = null;

    });

  } 
  catch(error) {
    alert(error.message)
  }  
  
}

function AtualizarTermo() {

  try {

    if (!document.getElementById('nr-processo-upt').value) {
      document.getElementById('nr-processo-upt').focus()
      throw new Error('Digite o numero do processo.')
    }  

    if (!document.getElementById('objeto-upt').value) {
      document.getElementById('objeto-ins').focus()
      throw new Error('Digite a descrição do onjeto.')
    }

    if (document.getElementById('sel-status-upt').value == '0') {
      document.getElementById('sel-status-upt').focus()
      throw new Error('Selecione um status.')
    }

    const dados = {
      id_objeto: document.getElementById('id-objeto').value,
      nr_processo: document.getElementById('nr-processo-upt').value,
      dt_processo: document.getElementById('dt-processo-upt').value,
      objeto: document.getElementById('objeto-upt').value,
      val_medio: document.getElementById('val-medio-upt').value,
      status: opt('sel-status-upt').value
    }
  
    SendDataController('/termo/atualizar',dados,'post', (res) => {
      window.location.reload(false);
    });
 
    
  } catch (error) {
    alert(error.message)
  }

}

function ListarAnexos(id_objeto) {
                      
  SendDataController(`/termo/listar-anexos/${id_objeto}`,{},'GET', (res) => {

    const tboby = document.getElementById('tbody-anexos')

    tboby.innerHTML = null

    res.data.map((anexo) => {

      const tr = `<tr>
        <td>${anexo.id_anexo}</td>
        <td>${anexo.nm_anexo}</td>
        <td><a href="" onClick="javascript:window.open('uploads/${anexo.nm_arquivo}','Anexo','width=800, height=600, top=250, left=250, scrollbars=no');">${anexo.nm_arquivo}</a></td>
        <td>
          <img class="ms-1" src="assets/img/trash.svg" height='17'" onClick="ExcluirAnexo(${anexo.id_objeto_fk},${anexo.id_anexo})">
        </td>
      </tr>`

      tboby.innerHTML += tr;

    });

    AbrirModal('modal-listar-anexos')

  });

}


function ExcluirAnexo(id_objeto,id_anexo) {

  SendDataController(`/termo/excluir-anexo/${id_objeto}-${id_anexo}`,{},'GET', (res) => {

    ListarAnexos(id_objeto)

    alert(res.msg)

  });

}