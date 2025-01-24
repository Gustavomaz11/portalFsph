let prescricoes = [];
let receitas = [];
let novoExame = [];
let hemocomponentes = [];

/***********************************************
 * Listar Pacientes Consultorios
 ***********************************************/
function ListarConsultorioCliico() {

    const fields = {
        nome: elem('txt-pesq').value,
        situacao: 1
    }

    ConsultorioCarregar(fields);

}

function ListarConsultorioHematologista() {

    const fields = {
        nome: elem('txt-pesq').value,
        situacao: 2
    }

    ConsultorioCarregar(fields);

}

function ConsultorioCarregar(dados) {

    cadastrosBuff = [];

    SendDataController('/ambulatorio/consultorio/listar/',dados,'POST',(res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        ConsultorioListar();

    });

}

function ConsultorioListar(pagina = 1) {

    document.getElementById('tbody').innerHTML = null;

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;

    x > cadastrosBuff.dados.atendimentos.length ? x = cadastrosBuff.dados.atendimentos.length : x = x

    let option = '';

    while (i < x) {

        let data = cadastrosBuff.dados.atendimentos[i].data.substr(0,10).split('-');
        data = data[2] + '-' + data[1] + '-' + data[0];

        option = `<tr data-sit='11'>`;
        option += `<td width="90px">${cadastrosBuff.dados.atendimentos[i].id}</td>`;
        option += `<td width="120px">${data + ' ' + cadastrosBuff.dados.atendimentos[i].data.substr(11,8)} </td>`;
        option += `<td width="240px">${cadastrosBuff.dados.atendimentos[i].nome}</td>`;
        option += `<td width="240px">${cadastrosBuff.dados.atendimentos[i].nm_mae}</td>`;
        option += `<td width="200px">${cadastrosBuff.dados.atendimentos[i].nm_situacao}</td>`;
        option += `<td width="180px"><img src='/img/edit.svg' height="18" width="18" onclick="Editar(${cadastrosBuff.dados.atendimentos[i].id},${cadastrosBuff.dados.atendimentos[i].paciente_id})"></td>`;
        option += `</tr>`;

        document.getElementById('tbody').innerHTML += option;

        i++;

    }

    Editar = (atend_id,paciente_id) => {

        const dados = {
            atend_id: atend_id,
            paciente_id: paciente_id
        }

        SendDataController('/ambulatorio/consultorio/medico/atendimento',dados,'POST', async (res) => {

            document.getElementById('ploter').innerHTML = res.dados.html;

            let data = res.dados.pacientes.dt_nasc.substr(0,10).split('-');
            data = data[0] + '-' + data[1] + '-' + data[2];

            elem('txt-atend-id').value = atend_id;
            elem('txt-prontuario').value = res.dados.pacientes.id;
            elem('txt-nome').value = res.dados.pacientes.nome;
            elem('txt-dt-nasc').value = data;

            let opt = `<option value='0'></option>`

            await res.dados.espprocedimentos.map( (procedimento) => {

                opt += `<option value=${procedimento.especialidade_id}>${procedimento.procedimento}</option>`

            });

            document.getElementById('sel-proc-atend').innerHTML = opt;

            let tr = '';

            await res.dados.exames.map((exame) => {

                let data = exame.dt_inclusao.substr(0,10).split('-');

                data = data[2] + '-' + data[1] + '-' + data[0];
    
                data += ' ' + exame.dt_inclusao.substr(11,8);

                tr += `<tr>`;
                tr += `<td width='50px'>${exame.id}</td>`;
                tr += `<td width='200px'>${data}</td>`;
                tr += `<td width='250px'>${exame.nm_exame}</td>`;
                tr += `<td width='100px'><img src='img/view.svg' height='20' width='28' onClick='VerExame(${paciente_id},${exame.id})' ></td>`;
                tr += `</tr>`;

            });

            document.getElementById('tbody-exames-resultados').innerHTML = tr;
                                     
        });

    }

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.atendimentos.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas} </option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;

}

function VerExame(paciente_id,id) {

    const dados = {
        paciente_id,
        id
    }

    SendDataController('/ambulatorio/consultorio/ver_exame',dados,'POST', (res) => {

        let modal = document.getElementById('modal-impressao');

        openModal(modal);

        document.getElementById('card-impressao').style.width = '60rem'
        document.getElementById('card-impressao').style.marginTop = '1rem'
        document.getElementById('imagem').src = res.dados.imagem;

    });
    
}

function PesquisarCIDs() {
    
    let modal = document.getElementById("modal-cid");
    
    openModal(modal)
    
    document.getElementById("tit-modal").innerHTML = "Pesquisar CIDs"
    document.getElementById("card").style.marginTop = "8em"
    document.getElementById("card").style.width = "50em"

    document.getElementById('txt-doenca').value = null
    document.getElementById('tbody-cid').innerHTML = null
}

function CarregarCids(descricao = "") {

    if(!descricao) {
        Mens("Digite uma doença")
        return
    } 

    cadastrosBuff = [];
    
    document.getElementById('tbody-cid').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';

    SendDataController("/ambulatorio/consultorio/pesquisardoenca", {descricao},"POST", (res) => {
        
        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        document.getElementById('btn-novo-cid').removeAttribute('disabled')

        cadastrosBuff = res;

        CidsListar()
  
    })
}

function CidsListar(pagina = 1) {

    let porPagina = cfgResolucao() - 8;
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.cids.length) x = cadastrosBuff.dados.cids.length;
    
    document.getElementById('tbody-cid').innerHTML = null;

    while (i < x) {
      
        tr += `<tr id='${cadastrosBuff.dados.cids[i].id}'>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.cids[i].id}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.cids[i].descricao}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.cids[i].codigo}</td>`;
        tr += `<td><img src='/img/select.svg' height='18' width='18' onClick='Selecionar("${cadastrosBuff.dados.cids[i].codigo}")'></td>`;
        
        i++;

    }

    Selecionar = (codigo) => {

        SendDataController('/ambulatorio/consultorio/selecionarcodigo', {codigo},'POST', (res) => {
            
            document.getElementById('txt-cid').value = res.dados.cids.codigo;
            document.getElementById('txt-descr-cid').value = res.dados.cids.descricao;
            
            closeModal('modal-cid');

        });
        
    }

    document.getElementById('tbody-cid').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao-cid').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.cids.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao-cid').innerHTML = opt;
    document.getElementById('sel-paginacao-cid').value = pagina;
   
}

function NovaPrescricao() {
    
    let modal = document.getElementById("modal-nova-prescr");
    
    openModal(modal)
    
    document.getElementById("tit-modal-prescr").innerHTML = "Nova Prescrição"
    document.getElementById("card-prescr").style.marginTop = "8em"
    document.getElementById("card-prescr").style.width = "50em"

    document.getElementById('txt-dt-nova-prescr').value = DataHora()

    document.getElementById('modal-nova-prescr') = ''
}

function NovoCid() {
    
    let modal = document.getElementById("modal-novo-cid");
    
    openModal(modal)
    
    document.getElementById("tit-modal-novo-cid").innerHTML = "Novo CID"
    document.getElementById("card-novo-cid").style.marginTop = "15em"
    document.getElementById("card-novo-cid").style.width = "48em"

}

function SalvarCids() {

    if (elem('txt-descricao').value == '') {
        Mens('Preenchimento da descrição obrigatória!');
        return
    }

    if (elem('txt-codigo').value == '') {
        Mens('Preenchimento do código obrigatória!');
        return
    }

    let dados = {
        id: elem('txt-id').value,
        descricao: elem('txt-descricao').value,
        codigo: elem('txt-codigo').value
    }

    let tr = '';

    SendDataController('/ambulatorio/consultorio/salvarcid', dados, 'POST', (res) => {
        
        closeModal('modal-novo-cid');

        if(res.err > 0) {
            Mens(res.msg)
            return
        }

        tr += `<tr id='${res.dados.cids.id}'>`;
        tr += `<td class='text-left align-middle'>${res.dados.cids.id}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.cids.descricao}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.cids.codigo}</td>`;
        tr += `<td><img src='/img/select.svg' height='18' width='18' onClick='Selecionar(${res.dados.cids.id})'></td>`;

        document.getElementById('tbody-cid').innerHTML = tr;

    });
    
}

function SelecionarCodigoCid(codigo) {

    SendDataController('/ambulatorio/consultorio/selecionarcodigo', {codigo},'POST', (res) => {
        
        if (res.dados.id == 0) {
            Mens('CID não encontrado!')
            return
        }

        document.getElementById('txt-cid').value = res.dados.cids.codigo
        document.getElementById('txt-descr-cid').value = res.dados.cids.descricao
    
    })

}

function AdicionarPrescricao() {

    dados = {
        data: DataHora(), 
        medico: 'Alan Dave',
        prescricao: document.getElementById('txt-texto').value
    }

    let str = '-'
    let cabecalho = `${dados.medico} em ${dados.data}\n`
    let linha = str.repeat(cabecalho.length+15) 
    let texto = `\n${dados.prescricao}\n\n`

    document.getElementById('txt-prescricao').value += cabecalho + linha + texto
    document.getElementById('txt-texto').value = null;

}

function AdicionarReceita() {

    dados = {
        data: DataHora(),
        medico: 'Alan Dave',
        prescricao: document.getElementById('txt-receita-nova').value
    }

    let i = receitas.length + 1

    let tr = `<tr id="${i}" data-pos="${i-1}" >`;
    tr += `<td width = '2vw'>${i}</td>`
    tr += `<td width = '20vw'>${dados.prescricao}</td>`
    tr += `<td width = '5vw'><img class='ms-1' src ='img/trash.svg' width = '16' height = '16' onclick="Excluir(${i})"></td>`
    tr += `</tr>`;

    Excluir = (id) => {
        if (receitas.length > 0) {
            document.getElementById(id).innerHTML = null
            receitas.splice(document.getElementById(id).data-pos)            
        }
    }

    receitas.push({tr, prescricao:dados.prescricao})

    document.getElementById('tbody-receita').innerHTML += receitas[i-1].tr
    document.getElementById('txt-receita-nova').value = null

}

// Modal Receituario //
function ModalReceituario() {

    SendDataController('/ambulatorio/consultorio/receituario',{nome: elem('txt-nome').value},'POST', async (res) => {

        let modal = document.getElementById("modal-receituario");
   
        openModal(modal)
    
        document.getElementById("tit-modal-receituario").innerHTML = "Receituario"
        document.getElementById('txt-medico-receita').value = res.dados.nome_profissional;
        document.getElementById('txt-datahora-receita').value = res.dados.dt_receituario;

        document.getElementById('card-receituario').style.width = '55rem'
        document.getElementById('card-receituario').style.marginTop = '8em'
    
    });

}

function limparTexto() {
    document.getElementById("txt-receita").value = "";
    document.getElementById('txt-prescricao').value = "";
}

// Modal Atestado //
function ModalAtestado() {

    dados = {
        data: DataHora(),
        medico: 'Alan Dave',
    }

    let modal = document.getElementById('modal-atestado');

    openModal(modal)

    document.getElementById('tit-modal-atestado').innerHTML = 'Novo Atestado'
    document.getElementById('txt-medico-atestado').value = dados.medico
    document.getElementById('txt-datahora-atestado').value = dados.data

    document.getElementById('card-atestado').style.width = '45vw'
    document.getElementById('card-atestado').style.marginTop = '10em'
}


function ModalPrescricaoAnterior() {

    dados = {
        data: DataHora(),
        medico: 'Alan Dave',
        numeroAtendimento: '1'
    }

    let modal = document.getElementById('modal-prescricao-anterior');

    openModal(modal)

    document.getElementById('tit-modal-prescricao-anterior').innerHTML = 'Prescrições Anteriores'
    document.getElementById('txt-medico-prescricao-anterior').value = dados.medico
    document.getElementById('txt-datahora-prescricao-anterior').value = dados.data
    document.getElementById('txt-atendimento-prescricao-anterior').value = dados.numeroAtendimento

    document.getElementById('card-prescricao-anterior').style.width = '45vw'
    document.getElementById('card-prescricao-anterior').style.marginTop = '10em'
}

function PreviaImpressao() {

    const dados = {
        nome_paciente: 'OVIDIO BATISTA',
        prescricoes: receitas
    }

    SendDataController('/ambulatorio/consultorio/impressaoprescricao/',dados,'POST', (res) => {

        let modal = document.getElementById('modal-impressao');

        openModal(modal)
    
        document.getElementById('tit-modal-impressao').innerHTML = 'Visualização'
        document.getElementById('card-impressao').style.width = '60rem'
        document.getElementById('card-impressao').style.marginTop = '1rem'
        document.getElementById('imagem').src = res.imagem;

    });

}

// Modal Exames //
function ModalExames() {

    dados = {
        data: DataHora(),
        medico: 'Allan Daves',
        exame: ''
    }

    let modal = document.getElementById("modal-exames");

    openModal(modal)

    document.getElementById("tit-modal-exames").innerHTML = "Exames"
    //document.getElementById('txt-medico-exames').value = res.dados.nome_profissional;
    //document.getElementById('txt-datahora-exames').value = res.dados.dt_receituario;

    document.getElementById('card-exames').style.width = '50em'
    document.getElementById('card-exames').style.marginTop = '8em'
    
}

function NovoExame() {

    if (!document.getElementById('txt-novo-exame').value) {
        Mens('Preenchimento obrigatorio.');
        return
    }

    dados = {
        data: DataHora(),
        medico: 'Alan Dave',
        exame: document.getElementById('txt-novo-exame').value
    }

    let i = novoExame.length + 1

    let tr = `<tr id="${i}" data-pos="${i-1}" >`;
    tr += `<td width = '2vw'>${i}</td>`
    tr += `<td width = 120px>${dados.data}</td>`
    tr += `<td width = 80px>${dados.medico}</td>`
    tr += `<td width = '300px'>${dados.exame}</td>`
    tr += `<td width = '5vw'><img class='ms-1' src ='img/trash.svg' width = '16' height = '16' onclick="Excluir(${i})"></td>`
    tr += `</tr>`;

    Excluir = (id) => {
        if (novoExame.length > 0) {
            document.getElementById(id).innerHTML = null
            novoExame.splice(document.getElementById(id).data-pos)            
        }
    }

    novoExame.push({tr, novoExame:dados.exame})

    document.getElementById('tbody-exames').innerHTML += novoExame[i-1].tr
    document.getElementById('txt-novo-exame').value = null

}

function Snh() {

    dados = {
        data: DataHora(),
        medico: 'Alan Dave',
        id: '001'
    }

    let modal = document.getElementById('modal-snh');

    openModal(modal);

    document.getElementById('tit-modal-snh').innerHTML = 'Solicitação Nominal de Hemocomponentes - SNH'
    document.getElementById('txt-codigo-snh').value = dados.id
    document.getElementById('txt-medico-snh').value = dados.medico
    document.getElementById('txt-datahora-snh').value = dados.data
    
    document.getElementById('card-snh').style.width = '100rem'
    document.getElementById('card-snh').style.marginTop = '4em'
    document.getElementById('card-snh').style.height = '43rem'
}

function CarregarHemocomponentes(descricao = "") {

    if(!descricao) {
        Mens("Digite um Hemocomponente")
        return
    } 

    hemocomponentesBuff = [];
    
    document.getElementById('tbody-snh').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';

    SendDataController("/ambulatorio/consultorio/pesquisarhemocomponentes", {descricao},"POST", (res) => {
        
        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res.dados;

        CidsListar()
  
    })
}

function ListarHemocomponentes() {
 
    let tr = '';

    if (x > hemocomponentesBuff.length) x = hemocomponentesBuff.length;
    
    document.getElementById('tbody-snh').innerHTML = null;

    while (i < x) {

      
        tr += `<tr id='${hemocomponentesBuff[i].id}'>`;
        tr += `<td class='text-left align-middle'>${hemocomponentesBuff[i].id}</td>`;
        tr += `<td class='text-left align-middle'><input class="form-control form-control-sm ms-1 h-0" type="text" placeholder="Numero?" style="width: 6vw;"></td>`;
        tr += `<td class='text-left align-middle'><input class="form-control form-control-sm ms-1 h-0" type="text" placeholder="Numero?" style="width: 6vw;"></td>`;
        tr += `<td class='text-left align-middle'><input class="form-control form-control-sm ms-1 h-0" type="text" placeholder="Numero?" style="width: 6vw;"></td>`;
        
        i++;

    }

    Selecionar = (id) => {

        SendDataController('/ambulatorio/consultorio/selecionarhemocomponentes', {id},'POST', (res) => {
            
            document.getElementById('txt-snh').value = res.dados.codigo
            document.getElementById('txt-descr-snh').value = res.dados.descricao
            
            closeModal('modal-snh');

        });
        
    }

    document.getElementById('tbody-snh').innerHTML = tr;

   
}

function NovoHemocomponente() {
    
    let modal = document.getElementById("modal-novo-hemo");
    
    openModal(modal)
    
    document.getElementById("tit-modal-hemo").innerHTML = "Novo Hemocomponente"
    document.getElementById("card-novo-hemo").style.marginTop = "8em"
    document.getElementById("card-novo-hemo").style.width = "48em"
    document.getElementById('card-novo-hemo').style.height = "30em"

}