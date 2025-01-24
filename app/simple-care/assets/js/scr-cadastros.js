let cadastrosBuff = [];
let procedimentos = [];
let procListados = [];

/************************************************************************
| Tipos de Atendimentos
*************************************************************************/
function TiposAtendimentosCarregar(nome = '*') {

    cadastrosBuff = [];
    
    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/tipo-atend/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res.dados;

        TiposAtendimentosListar();

    });    

}

function TiposAtendimentosAdicionar() {

    let modal = document.getElementById('modal-padrao');

    openModal(modal)

    document.getElementById('tit-modal').innerText = 'Adicionar Tipo Atendimento';

    card.style.width = '35vw';
    card.style.marginTop = '12em';
    
    elem('txt-id').value = '0';
    elem('txt-nome').value = null;

}

function PesquisarTiposAtendimentos(nome = '') {
    
    cadastrosBuff = cadastrosBuff.filter((list) => {
        return list.nome === nome
    });

    if (cadastrosBuff.length == 0) {
        TiposAtendimentosCarregar();
    } else {
        TiposAtendimentosListar();
    }
    
}

function TiposAtendimentosListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.length) x = cadastrosBuff.length;
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff[i].id}'>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff[i].id}</td>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff[i].nome}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${cadastrosBuff[i].id})'>
                    <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${cadastrosBuff[i].id})'>
                </td>`;
        
        i++;

    }

    Editar = (id) => {

        SendDataController(`/cadastros/tipo-atend/editar/${id}`,{},'GET', (res) => {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Tipo Atendimento';

            let card = document.getElementById('card');
                                                
            card.style.width = '35vw';
            card.style.marginTop = '12em';

            elem('txt-id').value = res.dados.id;
            elem('txt-nome').value = res.dados.nome;
            elem('chk-ativo').checked = res.dados.ativo == 0 ? true : false;

        });

    }

    Excluir = (id) => {

        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/tipo-atend/excluir/${id}`,{}, 'GET', (res) => {

                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                closeModal('modal-confirm');
    
                Mens(res.msg);
    
                let i = 0;

                cadastrosBuff.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.splice(i);
                    }
                    i++;
                });

                TiposAtendimentosListar()
                
            });

        });
       
    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;
   
}

function TiposAtendimentosSalvar() {

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do tipo de atendimento obrigatorio!');
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-nome').value,
        ativo: ativo
    }    
    
    SendDataController('/cadastros/tipo-atend/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        let tr = '';

        tr += `<tr id='${res.dados.id}'>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.id}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.nome.toUpperCase()}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${res.dados.id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${res.dados.id})'></td>`;

        if (elem('txt-id').value == res.dados.id) {
            document.getElementById(res.dados.id).innerHTML = tr;
        } else {
            cadastrosBuff.push(res.dados);
            TiposAtendimentosListar();
        }

        Mens(res.msg);
        
    });  

}

/************************************************************************
| Conselhos Reginais
*************************************************************************/
function ConselhosAdicionar() {

    let modal = document.getElementById('modal-padrao');

    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Entidade de Negocio';

    let card = document.getElementById('card');
                                            
    card.style.width = '35vw';
    card.style.marginTop = '15em';

    elem('txt-id').value = '0';
    elem('txt-nome').value = null;
    elem('txt-sigla').value = null;

}

function ConselhosCarregar(nome = '*') {

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';

    cadastrosBuff = [];
    
    SendDataController(`/cadastros/conselhos/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res.dados;

        ConselhosListar(1);

    });    

}

function ConselhosListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = ''

    if (x > cadastrosBuff.length) x = cadastrosBuff.length;
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff[i].id}'>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff[i].id}</td>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff[i].nm_classe}</td>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff[i].sigla}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${cadastrosBuff[i].id})'>
                   <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${cadastrosBuff[i].id})'>
                </td>`;
    
        i++;
    }

    Editar = (id) => {

        SendDataController(`/cadastros/conselhos/editar/${id}`,{},'GET', (res)=> {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Conselho';

            let card = document.getElementById('card');
                                                
            card.style.width = '35vw';
            card.style.marginTop = '15em';

            elem('txt-id').value = res.dados.id;
            elem('txt-nome').value = res.dados.nm_classe;
            elem('txt-sigla').value = res.dados.sigla;
            elem('chk-ativo').checked = res.dados.ativo == 0 ? true : false;

        });

    }

    Excluir = (id) => {

        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/conselhos/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');

                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;
    
                cadastrosBuff.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.splice(i);
                        ConselhosListar()
                    }
                    i++;
                });
    
                Mens(res.msg);
    
            });

        });

    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.length / porPagina);

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

function ConselhosSalvar() {

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do nome do conselho obrigatorio!');
        return
    }

    if (elem('txt-sigla').value == '') {
        Mens('Preenchimento da sigla obrigatorio!');
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nm_classe: elem('txt-nome').value,
        sigla: elem('txt-sigla').value,
        ativo: ativo
    }

    let tr = '';
    
    SendDataController('/cadastros/conselhos/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        tr += `<tr id='${res.dados.id}'>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.id}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.nm_classe}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.sigla}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${res.dados.id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${res.dados.id})'></td>`;
    
        if (elem('txt-id').value == res.dados.id) {
            document.getElementById(res.dados.id).innerHTML = tr;
        } else {
            cadastrosBuff.push(res.dados);
            ConselhosListar();
        }

        Mens(res.msg);
        
    });

}

/************************************************************************
| Enfermarias
*************************************************************************/
function EnfermariasAdicionar() {

    let modal = document.getElementById('modal-padrao');

    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Enfermaria';

    let card = document.getElementById('card');
                                            
    card.style.width = '35vw';
    card.style.marginTop = '15em';

    elem('txt-id').value = '0';
    elem('txt-nome').value = null;
    elem('txt-qtde').value = null;

}

function EnfermariasCarregar(nome = '*') {
    
    cadastrosBuff = [];

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/enfermarias/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res.dados;

        EnfermariasListar(1);

    });

}

function EnfermariasListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.length) x = cadastrosBuff.length; 
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {
        
        tr += `<tr id='${cadastrosBuff[i].id}'>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff[i].id}</td>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff[i].nome}</td>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff[i].qt_leitos}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${cadastrosBuff[i].id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${cadastrosBuff[i].id})'></td>`;
      
        i++;

    }

    Editar = (id) => {

        SendDataController(`/cadastros/enfermarias/editar/${id}`,{},'GET', (res) => {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Enfermaria';

            let card = document.getElementById('card');
                                                
            card.style.width = '35vw';
            card.style.marginTop = '15em';

            elem('txt-id').value = res.dados.id;
            elem('txt-nome').value = res.dados.nome;
            elem('txt-qtde').value = res.dados.qt_leitos;

        });

    }

    Excluir = (id) => {

        Confirmar('Deseja Excluir esse registro agora ?',() => {
            
            SendDataController(`/cadastros/enfermarias/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');

                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;

                cadastrosBuff.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.splice(i);
                    }
                    i++;
                });
    
                EnfermariasListar();
    
                Mens(res.msg);
    
            });
    
        });

    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;

}

function EnfermariasSalvar() {

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do nome da enfermaria obrigatorio!');
        return
    }

    if (elem('txt-qtde').value == '') {
        Mens('Preenchimento da qtde de leitos obrigatorio!');
        return
    }

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-nome').value,
        qt_leitos: elem('txt-qtde').value   
    }
    
    SendDataController('/cadastros/enfermarias/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        let tr = '';

        tr += `<tr id='${res.dados.id}'>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.id}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.nome}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.qt_leitos}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Enfermarias.Editar(${res.dados.id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Enfermarias.Excluir(${res.dados.id})'></td>`;
        
        if (elem('txt-id').value == res.dados.id) {
            document.getElementById(res.dados.id).innerHTML = tr;                
        } else {
            cadastrosBuff.push(res.dados);
            EnfermariasListar();
        }

        Mens(res.msg);
        
    });

}

/************************************************************************
| Leitos
*************************************************************************/
function LeitosAdicionar() {

    SendDataController(`/cadastros/enfermarias/listar/${'*'}`,{},'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        document.getElementById('sel-enf').innerHTML = null;

        document.getElementById('sel-enf').removeAttribute('disabled');

        let i = 0;
        let option = `<option value='0'></option>`; // document.createElement('option');

        while (i < res.dados.length) {
            option += `<option value='${res.dados[i].id}'>${res.dados[i].nome}</option>`
            i++;
        }

        document.getElementById('sel-enf').innerHTML = option;

        let modal = document.getElementById('modal-padrao');

        openModal(modal);

        document.getElementById('tit-modal').innerText = 'Adicionar Eleito';

        let card = document.getElementById('card');
                                                
        card.style.width = '35vw';
        card.style.marginTop = '15em';

        elem('txt-id').value = '0';
        elem('txt-nome').value = null;
        elem('sel-enf').value = 0;

    });

}

function LeitosCarregar(nome = '*') {

    cadastrosBuff = [];
        
    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';

    SendDataController(`/cadastros/leitos/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        LeitosListar(1);

    });   

}

function LeitosListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';
    
    if (x > cadastrosBuff.dados.leitos.length) {x = cadastrosBuff.dados.leitos.length}

    while (i < x) {

        tr += `<tr id='${cadastrosBuff.dados.leitos[i].enfermaria_id + '' + cadastrosBuff.dados.leitos[i].id}'>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff.dados.leitos[i].id}</td>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff.dados.leitos[i].nome}</td>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff.dados.leitos[i].enfermaria}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${cadastrosBuff.dados.leitos[i].enfermaria_id},${cadastrosBuff.dados.leitos[i].id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${cadastrosBuff.dados.leitos[i].enfermaria_id},${cadastrosBuff.dados.leitos[i].id})'></td>`;

        i++;
    }
    
    Editar = (enf_id,id) => {

        SendDataController(`/cadastros/leitos/editar/${id}-${enf_id}`,{},'GET',(res) => {

            document.getElementById('sel-enf').innerHTML = null;

            let option = `<option value='0'></option>`;
            let i = 0;
            
            while (i < res.dados.enfermarias.length) {

                option += `<option value='${res.dados.enfermarias[i].id}'>${res.dados.enfermarias[i].nome}</option>`;

                i++;

            }
            
            document.getElementById('sel-enf').innerHTML = option;

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Leito';

            let card = document.getElementById('card');
                                                
            card.style.width = '35vw';
            card.style.marginTop = '15em';

            elem('txt-id').value = res.dados.leitos.id;
            elem('txt-nome').value = res.dados.leitos.nome;
            elem('sel-enf').value = res.dados.leitos.enfermaria_id;
            elem('chk-ativo').checked = res.dados.leitos.ativo == 0 ? true : false

            document.getElementById('sel-enf').setAttribute('disabled','disabled');

        });

    }

    Excluir = (enf_id,id) => {

        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/leitos/excluir/${id}-${enf_id}`,{}, 'GET', async (res) => {

                closeModal('modal-confirm');

                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }

                let i = 0;

                await cadastrosBuff.dados.leitos.map((ind) => {
                    
                    if (ind.enfermaria_id == enf_id && ind.id == id) {
                        cadastrosBuff.dados.leitos.splice(i);
                        cadastrosBuff.dados.leitos.sort();
                    }
                    
                    i++;

                });
    
                LeitosListar()
    
                Mens(res.msg);
    
            });
            
        });

    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.leitos.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;

}

function LeitosSalvar() {

    if (opt('sel-enf').value == "0") {
        Mens('Selecione uma enfermaria para o leito.')
        return
    }

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do nome do leito obrigatorio!');
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-nome').value,
        enfermaria_id: opt('sel-enf').value,
        ativo: ativo
    }    
    
    SendDataController('/cadastros/leitos/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        let tr = '';



        tr += `<tr id='${res.dados.leitos.enfermaria_id + '' + res.dados.leitos.id}'>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.leitos.id}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.leitos.nome}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.leitos.enfermaria}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${res.dados.leitos.enfermaria_id},${res.dados.leitos.id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${res.dados.leitos.enfermaria_id},${res.dados.leitos.id})'></td>`;

        if (elem('txt-id').value == res.dados.leitos.id && opt('sel-enf').value == res.dados.leitos.enfermaria_id) {
            document.getElementById(res.dados.leitos.enfermaria_id +''+ res.dados.leitos.id).innerHTML = tr;
        } else {
            cadastrosBuff.dados.leitos.push(res.dados.leitos);
            cadastrosBuff.dados.leitos.sort();
            LeitosListar()
        }

        Mens(res.msg);
        
    });

}

/************************************************************************
| Profissionais
*************************************************************************/
function ProfissionaisAdicionar() {

    SendDataController(`/cadastros/profissionais/editar/${0}`,{},'GET', async (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        /************************************************************* */
        document.getElementById('sel-cons').innerHTML = null;

        let option = `<option value="0" disabled selected hidden>...</option>`;

        await res.dados.conselhos.map( (conselho) => {
            option += `<option value="${conselho.id}">${conselho.sigla}</option> `;
        });

        document.getElementById('sel-cons').innerHTML = option;

        /************************************************************* */
        document.getElementById('sel-esp').innerHTML = null;

        option = `<option value="0" disabled selected hidden>...</option> `;

        await res.dados.especialidades.map( (especialidade) => {
            option += `<option value="${especialidade.id}">${especialidade.nome}</option> `;
        });

        document.getElementById('sel-esp').innerHTML = option;

        /************************************************************* */
        document.getElementById('sel-vin').innerHTML = null;

        option = `<option value="0" disabled selected hidden'>...</option> `;
        
        await res.dados.vinculos.map( (vinculo) => {
            option += `<option value="${vinculo.id}">${vinculo.nome}</option> `;
        });

        document.getElementById('sel-vin').innerHTML = option;

        /************************************************************* */
        let modal = document.getElementById('modal-padrao');

        openModal(modal);

        document.getElementById('tit-modal').innerText = 'Adicionar Profissional';

        let card = document.getElementById('card');
                                                
        card.style.width = '45vw';
        card.style.marginTop = '10em';

        elem('txt-id').value = '0';
        elem('txt-nome').value = null;
        elem('sel-cons').value = 0;
        elem('txt-registro').value = null;
        elem('sel-esp').value = 0;

    }); 

}

function ProfissionaisCarregar(nome = '*') {
  
    cadastrosBuff = [];

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/profissionais/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        ProfissionaisListar(1);

    }); 
    
}

function ProfissionaisListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.profissionais.length) x = cadastrosBuff.dados.profissionais.length;

    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff.dados.profissionais[i].id}'>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.profissionais[i].id}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.profissionais[i].nome}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.profissionais[i].sigla}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.profissionais[i].conselho_registro}</td>`;
        tr += `<td class='text-left align-middle'>
        <img src='/img/edit.svg' height='18' width='18' onClick='Editar(${cadastrosBuff.dados.profissionais[i].id})'>
        <img src='/img/trash.svg' height='18' width='18' onClick='Excluir(${cadastrosBuff.dados.profissionais[i].id})'></td>`;
        tr += `</tr>`;

        i++;
    }

    Editar = (id) => {

        SendDataController(`/cadastros/profissionais/editar/${id}`,{},'GET', async (res) => {

            if(res.err > 0) {
                Mens(res.msg);
                return
            }

            /************************************************************* */
            document.getElementById('sel-cons').innerHTML = null;

            let option = `<option value="0"></option>`;

            await res.dados.conselhos.map( (conselho) => {
                option += `<option value="${conselho.id}">${conselho.sigla}</option>`;
            });

            document.getElementById('sel-cons').innerHTML = option;

            /************************************************************* */
            document.getElementById('sel-esp').innerHTML = null;

            option = `<option value="0"></option>`;

            await res.dados.especialidades.map( (especialidade) => {
                option += `<option value="${especialidade.id}">${especialidade.nome}</option>`;    
            });

            document.getElementById('sel-esp').innerHTML = option;

            /************************************************************* */
            document.getElementById('sel-vin').innerHTML = null;

            option = `<option value="0"></option>`;

            await res.dados.vinculos.map((vinculo) => {
                option += `<option value="${vinculo.id}">${vinculo.nome}</option>`;        
            });

            document.getElementById('sel-vin').innerHTML = option;

            /************************************************************* */
            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Profissional';

            let card = document.getElementById('card');
                                                    
            card.style.width = '45vw';
            card.style.marginTop = '10em';

            elem('txt-id').value = res.dados.profissionais.id;
            elem('txt-nome').value = res.dados.profissionais.nome;
            elem('sel-cons').value = res.dados.profissionais.conselho_id;
            elem('txt-registro').value = res.dados.profissionais.conselho_registro;
            elem('sel-esp').value = res.dados.profissionais.especialidade_id;
            elem('sel-vin').value = res.dados.profissionais.vinculo_id;
            elem('chk-ativo').checked = res.dados.profissionais.ativo == 1 ? false : true;

        });

    }

    Excluir = (id) => {

        Confirmar('Deseja Excluir esse registro agora ?',() => {

            SendDataController(`/cadastros/profissionais/excluir/${id}`,{}, 'POST', (res) => {

                closeModal('modal-confirm');

                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;

                cadastrosBuff.profissionais.map((ind) => {                                
                    if (ind.id == id) cadastrosBuff.profissionais.splice(i)
                    i++
                });
    
                ProfissionaisListar();

                Mens(res.msg);
    
            });
    
            
        });

    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.profissionais.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;    

}

function ProfissionaisSalvar() {

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do nome do profissional obrigatorio!');
        return
    }

    if (opt('sel-cons').value == "0") {
        Mens('Selecione um conselho para o profissional.')
        return
    }

    if (elem('txt-registro').value == '') {
        Mens('Preenchimento do registro do conselho obrigatorio!');
        return
    }

    if ((!elem('txt-cpf').value || !ValidarCPF(elem('txt-cpf').value))) {
        Mens('CPF invalido!');
        return
    }

    if (!elem('txt-uf').value) {
        Mens('UF do registro de classe obrigatorio.');
        return
    }

    if (opt('sel-esp').value == '0') {
        Mens('Selecione uma especialidade do profissional!');
        return
    }

    if (opt('sel-vin').value == '0') {
        Mens('Selecione o vinculo do profissional!');
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-nome').value,
        cpf: elem('txt-cpf').value,
        conselho_id: opt('sel-cons').value,
        conselho_registro: elem('txt-registro').value,
        uf: elem('txt-uf').value,
        especialidade_id: opt('sel-esp').value,
        vinculo_id: opt('sel-vin').value,
        ativo: ativo
    }
    
    SendDataController('/cadastros/profissionais/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }
     
        let tr = '';

        tr += `<tr id='${res.dados.id}'>`;
        tr += `<td class='text-left align-middle'>${res.dados.id}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.nome}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.sigla}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.conselho_registro}</td>`;
        tr += `<td class='text-left align-middle'>
        <img src='/img/edit.svg' height='18' width='18' onClick='Profissionais.Editar(${res.dados.id})'>
        <img src='/img/trash.svg' height='18' width='18' onClick='Profissionais.Excluir(${res.dados.id})'></td>`;
        tr += `</tr>`;
        
        if (elem('txt-id').value == res.dados.id) {
            document.getElementById(res.dados.id).innerHTML = tr;
        } else {
            cadastrosBuff.profissionais.push(res.dados);
            Profissionais.Listar();
        }

        Mens(res.msg);
        
    });

}

/************************************************************************
| Motivo Encerramento
************************************************************************/
function MotivoEncerraAdicionar() {
   
    let modal = document.getElementById('modal-padrao');

    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Motivo';

    let card = document.getElementById('card');
                                            
    card.style.width = '35vw';
    card.style.marginTop = '15em';

    elem('txt-id').value = '0';
    elem('txt-nome').value = null;

}

function MotivoEncerraCarregar(nome = '*') {

    nome =  nome == '' ? '*' : nome

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/motivo_encerra/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        let i = 0
    
        let tr = '';
    
        document.getElementById('tbody').innerHTML = null;
    
        while (i < res.dados.motivos.length) {
    
            tr += `<tr id='${res.dados.motivos[i].id}'>`;
            tr += `<td class='text-left 'align-middle'>${res.dados.motivos[i].id}</td>`;
            tr += `<td class='text-left 'align-middle'>${res.dados.motivos[i].nome}</td>`;
            tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${res.dados.motivos[i].id})'>
            <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${res.dados.motivos[i].id})'></td>`;
          
            i++;
    
        }
    
    
        Editar = (id) => {
    
            SendDataController(`/cadastros/motivo_encerra/editar/${id}`,{},'GET', (res) => {
    
                let modal = document.getElementById('modal-padrao');
    
                openModal(modal);
    
                document.getElementById('tit-modal').innerText = 'Editar Motivo Encerramento';
    
                let card = document.getElementById('card');
                                                    
                card.style.width = '35vw';
                card.style.marginTop = '15em';
    
                elem('txt-id').value = res.dados.motivos.id;
                elem('txt-nome').value = res.dados.motivos.nome;
                elem('chk-ativo').checked = res.dados.motivos.ativo == 0 ? true : false;
    
            });
            
    
        }
    
        Excluir = (id) => {
    
            Confirmar('Deseja Excluir esse registro agora ?',() =>{
                
                SendDataController(`/cadastros/motivo_encerra/excluir/${id}`,{}, 'GET', (res) => {
    
                    closeModal('modal-confirm');
        
                    MotivoEncerraCarregar();

                    Mens(res.msg);
    
                });
    
            });
    
        }
    
        document.getElementById('tbody').innerHTML = tr;
    
    });    

}

function MotivoEncerraSalvar() {

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do tipo de atendimento obrigatorio!');
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-nome').value,
        ativo: ativo
    };
    
    SendDataController('/cadastros/motivo_encerra/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        let tr = '';
        
        tr += `<tr id='${res.dados.motivos.id}'>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.motivos.id}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.motivos.nome}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${res.dados.motivos.id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${res.dados.motivos.id})'></td>`;
      
        if (elem('txt-id').value == res.dados.motivos.id) {
            document.getElementById(res.dados.motivos.id).innerHTML = tr;
        } else {
            cadastrosBuff.dados.motivos.push(res.dados.motivos);
            MotivoEncerraListar();
        }

        Mens(res.msg);
        
    });

}

/************************************************************************
| Regime Atendimento
*************************************************************************/
function RegimeAtendimentosAdicionar() {
  
    let modal = document.getElementById('modal-padrao');

    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Regime';

    let card = document.getElementById('card');
                                            
    card.style.width = '35vw';
    card.style.marginTop = '15em';

    elem('txt-id').value = '0';
    elem('txt-nome').value = null;
}

function RegimeAtendimentosCarregar(nome = '*') {

    cadastrosBuff = [];

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/regime_atend/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        RegimeAtendimentosListar(1);

    });    

}

function RegimeAtendimentosListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.regime_atend.length) x = cadastrosBuff.dados.regime_atend.length;
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff.dados.regime_atend[i].id}'>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff.dados.regime_atend[i].id}</td>`;
        tr += `<td class='text-left 'align-middle'>${cadastrosBuff.dados.regime_atend[i].nome}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar("${cadastrosBuff.dados.regime_atend[i].id}")'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${cadastrosBuff.dados.regime_atend[i].id}")'></td>`;
      
        i++;
    }

    Editar = (id) => {

        SendDataController('/cadastros/regime_atend/editar',{id},'GET', (res) => {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Regime';

            let card = document.getElementById('card');
                                                
            card.style.width = '35vw';
            card.style.marginTop = '15em';

            elem('txt-id').value = res.dados.regime_atend.id;
            elem('txt-nome').value = res.dados.regime_atend.nome;
            elem('chk-ativo').checked = res.dados.regime_atend.ativo == 0 ? true : false;

        });
    }

    Excluir = (id) => {
        
        Confirmar('Deseja Excluir esse registro agora ?',() => {

            SendDataController(`/cadastros/regime_atend/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');
    
                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;
    
                cadastrosBuff.dados.regime_atend.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.dados.regime_atend.splice(i);
                        RegimeAtendimentosListar();
                    }
                    i++;
                });
    
                Mens(res.msg);
    
            });
            
        });
    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;

}

function RegimeAtendimentosSalvar() {

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do regime de atendimento obrigatorio!');
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-nome').value,
        ativo: ativo
    }
    
    SendDataController('/cadastros/regime_atend/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        let tr = '';
        
        tr += `<tr id='${res.dados.regime_atend.id}'>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.regime_atend.id}</td>`;
        tr += `<td class='text-left 'align-middle'>${res.dados.regime_atend.nome}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${res.dados.regime_atend.id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${res.dados.regime_atend.id})'></td>`;

        if (elem('txt-id').value == res.dados.regime_atend.id) {
            document.getElementById(res.dados.regime_atend.id).innerHTML = tr;
        } else {
            cadastrosBuff.dados.regime_atend.push(res.dados.regime_atend);
            RegimeAtendimentosListar();
        }

        Mens(res.msg);
        
    })

}

/************************************************************************
| Especialidade Atendimento
*************************************************************************/
function EspecialidadesAdicionar() {

    let modal = document.getElementById('modal-padrao');

    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Especialidade Atendimento';

    let card = document.getElementById('card');
                                            
    card.style.width = '50vw';
    card.style.marginTop = '6em';
    card.style.height = '75vh'

    elem('txt-id').value = '0';
    elem('txt-nome').value = null;
    elem('sel-pres').value = '0'

    procListados = [];

    document.getElementById('tbody-cadastro-procedimentos').innerHTML = null;

    SendDataController('/cadastros/especialidades/aux_especialidade',{},'GET', async (res) => {

        let option = '<option value="0"></option>';

        await res.dados.map((tipo) => {
            option += `<option value="${tipo.codigo}">${tipo.descricao}</option>`;
        });

        document.getElementById('sel-pres').innerHTML = option;

    });

}

function EspecialidadesCarregar(nome = '*') {

    cadastrosBuff = [];
    procListados = [];

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/especialidades/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        EspecialidadesListar(1);

    });    

}

function EspecialidadesListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.especialidades.length) x = cadastrosBuff.dados.especialidades.length;
   
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        let posicao = i;

        tr += `<tr id='${cadastrosBuff.dados.especialidades[i].id}'>`;
        tr += `<td class="text-left align-middle">${cadastrosBuff.dados.especialidades[i].id}</td>`;
        tr += `<td class="text-left align-middle">${cadastrosBuff.dados.especialidades[i].nome}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar(${cadastrosBuff.dados.especialidades[i].id})'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir(${cadastrosBuff.dados.especialidades[i].id},${posicao})'></td>`;
        tr += `</tr>`

        i++;    

    }
    
    Editar = (id) => {

        SendDataController(`/cadastros/especialidades/editar/${id}`,{},'GET', async (res) => {

            procListados = [];

            document.getElementById('tbody-cadastro-procedimentos').innerHTML = null;

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Especialidade Atendimento';

            let card = document.getElementById('card');
                                                
            card.style.width = '50vw';
            card.style.marginTop = '6em';
            card.style.height = '75vh'

            elem('txt-id').value = res.dados.especialidades.id;
            elem('txt-nome').value = res.dados.especialidades.nome;
            elem('chk-ativo').checked = res.dados.especialidades.ativo == 0 ? true : false;

            let option = '<option value="0"></option>';

            await res.dados.tipo_prescricoes.map( (tipo) => {
                option += `<option value="${tipo.codigo}">${tipo.descricao}</option>`;
            });

            document.getElementById('sel-pres').innerHTML = option;

            elem('sel-pres').value = res.dados.especialidades.prescreve_em;

            procListados = res.dados.espprocedimentos;

            ListarProcedimentosSelecionados();

        });
    }

    Excluir = (id,pos) => {
        
        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/especialidades/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');

                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;
    
                cadastrosBuff.dados.especialidades.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.dados.especialidades.splice(pos,1);
                        EspecialidadesListar();
                    }
                    i++;
                });

                Mens(res.msg);
    
            });

        });
    
    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.especialidades.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;

}

function EspecialidadesSalvar() {

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do Nome da Especialidade obrigatorio!');
        return
    }

    if (elem('sel-pres').value == '0') {
        Mens('Selecione onde o profissional irá prescrever.');
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: parseInt(elem('txt-id').value),
        nome: elem('txt-nome').value,
        prescreve_em: elem('sel-pres').value,
        ativo: ativo,
        procedimentos: procListados
    }

    SendDataController('/cadastros/especialidades/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        EspecialidadesCarregar();

        procListados = res.procedimentos;

        //ListarProcedimentosSelecionados()

        Mens(res.msg);
        
    });

}

/************************************************************************
| Turnos de Trabalho
*************************************************************************/
function TurnosAdicionar() {

    let modal = document.getElementById('modal-padrao');
    
    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Turno de Trabalho';

    let card = document.getElementById('card');
                                            
    card.style.width = '35em';
    card.style.marginTop = '9em';
   
    elem('txt-id').value = 0;
    elem('txt-nome').value = null;
    elem('txt-hr-ini').value = '00:00';
    elem('txt-hr-fin').value = '00:00';

}

function TurnosCarregar(nome = '*') {
   
    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';

    cadastrosBuff = [];
    
    SendDataController(`/cadastros/turnos/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        TurnosListar(1);

    });    

}

function TurnosListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.turnos.length) x = cadastrosBuff.dados.turnos.length;
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff.dados.turnos[i].id}'>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.turnos[i].id}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.turnos[i].nome}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.turnos[i].hr_ini}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.turnos[i].hr_fin}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar("${cadastrosBuff.dados.turnos[i].id}")'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${cadastrosBuff.dados.turnos[i].id}")'></td>`;
        tr += `</tr>`

        i++;

    }

    Editar = (id) => {

        SendDataController(`/cadastros/turnos/editar/${id}`,{},'GET', (res) => {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Turno de trabalho';

            let card = document.getElementById('card');
                                                
            card.style.width = '35em';
            card.style.marginTop = '9em';

            elem('txt-id').value = res.dados.turnos.id;
            elem('txt-nome').value = res.dados.turnos.nome;
            elem('txt-hr-ini').value = res.dados.turnos.hr_ini;
            elem('txt-hr-fin').value = res.dados.turnos.hr_fin;
            elem('chk-ativo').checked = res.dados.turnos.ativo == 1 ? false : true;;
            
        });
    }

    Excluir = (id) => {
        
        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/turnos/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');

                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;
    
                cadastrosBuff.dados.turnos.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.dados.turnos.splice(i);
                        TurnosListar();
                    }
                    i++;
                });

                Mens(res.msg);
    
            });

        });
    }
       
    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;

}

function TurnosSalvar() {
   
    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do Nome do turno obrigatorio!');
        return
    }

    if (elem('txt-hr-ini').value.length == 0) {
        Mens("Digite o horario inicial.");
        return
    }

    if (elem('txt-hr-fin').value.length == 0) {
        Mens("Digite o horario final.");
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-nome').value.toUpperCase(),
        hr_ini:  elem('txt-hr-ini').value,
        hr_fin: elem('txt-hr-fin').value,
        ativo: ativo
    }
    
    SendDataController('/cadastros/turnos/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        let tr = '';

        tr += `<tr id='${res.dados.turnos.id}'>`;
        tr += `<td class='text-left align-middle'>${res.dados.turnos.id}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.turnos.nome}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.turnos.hr_ini}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.turnos.hr_fin}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Turnos.Editar("${res.dados.turnos.id}")'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Turnos.Excluir("${res.dados.turnos.id}")'></td>`;
        tr += `</tr>`;

        if (elem('txt-id').value == res.dados.turnos.id) {
            document.getElementById(res.dados.turnos.id).innerHTML = tr;
        } else {
            cadastrosBuff.dados.turnos.push(res.dados.turnos);
            TurnosListar();
        }
       
        Mens(res.msg);
        
    });
    
}

/************************************************************************
| Vinculos Empregaticio
*************************************************************************/
function VinculosAdicionar() {
   
    let modal = document.getElementById('modal-padrao');
    
    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Vinculos';

    let card = document.getElementById('card');
                                            
    card.style.width = '35vw';
    card.style.marginTop = '9em';
   
    elem('txt-id').value = 0;
    elem('txt-nome').value = null;
    elem('txt-cg-horaria').value = 0;

}

function VinculosCarregar(nome = '*') {

    cadastrosBuff = [];

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/vinculos/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        VinculosListar(1);

    });

}

function VinculosListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.vinculos.length) x = cadastrosBuff.dados.vinculos.length;
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff.dados.vinculos[i].id}'>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.vinculos[i].id}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.vinculos[i].nome}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.vinculos[i].carga_horaria}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar("${cadastrosBuff.dados.vinculos[i].id}")'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${cadastrosBuff.dados.vinculos[i].id}")'></td>`;
        tr += `</tr>`

        i++;

    }

    Editar = (id) => {

        SendDataController(`/cadastros/vinculos/editar/${id}`,{},'GET', (res) => {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Vinculo';

            let card = document.getElementById('card');
                                                
            card.style.width = '35vw';
            card.style.marginTop = '9em';

            elem('txt-id').value = res.dados.id;
            elem('txt-nome').value = res.dados.nome;
            elem('txt-cg-horaria').value = res.dados.carga_horaria;
            elem('chk-ativo').checked = res.dados.ativo == 0 ? true : false;

        });

    }

    Excluir = (id) => {
        
        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/vinculos/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');
    
                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;
    
                cadastrosBuff.dados.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.dados.splice(i);
                        VinculosListar();
                    }
                    i++;
                });

                Mens(res.msg);
    
            });

        });
    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;
 
}

function VinculosSalvar() {

    if (elem('txt-nome').value == '') {
        Mens('Preenchimento do Nome do turno obrigatorio!');
        return
    }

    if (elem('txt-cg-horaria').value.length == 0 || elem('txt-cg-horaria').value == 0) {
        Mens("Digite a carga horaria do vinculo.");
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-nome').value,
        carga_horaria: elem('txt-cg-horaria').value,
        ativo: ativo
    };

    SendDataController('/cadastros/vinculos/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }
    
        let tr = '' 
        
        tr += `<tr id='${res.dados.id}'>`;
        tr += `<td class='text-left align-middle'>${res.dados.id}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.nome}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.carga_horaria}</td>`;
        tr += `<td>
                    <img src='/img/edit.svg' height='18' width='18' onClick='Editar("${res.dados.id}")'>
                    <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${res.dados.id}")'>
                </td>`;
        tr += `</tr>`
    
        if (elem('txt-id').value == res.dados.id) {
            document.getElementById(res.dados.id).innerHTML = tr;
        } else {
            cadastrosBuff.dados.push(res.dados);
            VinculosListar();
        }
    });

}

/************************************************************************
| Tipos de Procedimentos
*************************************************************************/
function TiposProcedimentosAdicionar() {
   
    let modal = document.getElementById('modal-padrao');
    
    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Tipo de Procedimentos';

    let card = document.getElementById('card');
                                            
    card.style.width = '45rem';
    card.style.marginTop = '10rem';
   
    elem('txt-id').value = 0;
    elem('txt-descr').value = null;
    elem('txt-cod').value = 0;

}

function TiposProcedimentosCarregar(nome = '*') {

    cadastrosBuff = [];

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/tipos_procedimentos/listar/${nome}`,{}, 'POST', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        TiposProcedimentosListar(1);

    });

}

function TiposProcedimentosListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.tipo_procedimento.length) x = cadastrosBuff.dados.tipo_procedimento.length;
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff.dados.tipo_procedimento[i].id}'>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.tipo_procedimento[i].id}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.tipo_procedimento[i].descricao}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.tipo_procedimento[i].codigo}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar("${cadastrosBuff.dados.tipo_procedimento[i].id}")'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${cadastrosBuff.dados.tipo_procedimento[i].id}")'></td>`;
        tr += `</tr>`

        i++;

    }

    Editar = (id) => {

        SendDataController(`/cadastros/tipos_procedimentos/editar/${id}`,{},'GET', (res) => {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Vinculo';

            let card = document.getElementById('card');
                                                
            card.style.width = '45rem';
            card.style.marginTop = '10rem';

            elem('txt-id').value = res.dados.tipo_procedimento.id;
            elem('txt-descr').value = res.dados.tipo_procedimento.descricao;
            elem('txt-cod').value = res.dados.tipo_procedimento.codigo;
            elem('chk-ativo').checked = res.dados.tipo_procedimento.ativo == 0 ? true : false;

        });

    }

    Excluir = (id) => {
        
        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/tipos_procedimentos/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');
    
                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;
    
                cadastrosBuff.dados.tipo_procedimento.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.dados.tipo_procedimento.splice(i);
                        TiposProcedimentosListar();
                    }
                    i++;
                });

                Mens(res.msg);
    
            });

        });
    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;
 
}

function TiposProcedimentosSalvar() {

    if (elem('txt-descr').value == '') {
        Mens('Preenchimento do Nome do procedimento obrigatorio!');
        return
    }

    if (elem('txt-cod').value.length == 0 || elem('txt-cod').value == 0) {
        Mens("Digite o codigo.");
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        descricao: elem('txt-descr').value,
        codigo: elem('txt-cod').value,
        ativo: ativo
    };

    SendDataController('/cadastros/tipos_procedimentos/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }
    
        let tr = '' 
        
        tr += `<tr id='${res.dados.tipo_procedimento.id}'>`;
        tr += `<td class='text-left align-middle'>${res.dados.tipo_procedimento.id}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.tipo_procedimento.descricao}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.tipo_procedimento.codigo}</td>`;
        tr += `<td>
                    <img src='/img/edit.svg' height='18' width='18' onClick='Editar("${res.dados.tipo_procedimento.id}")'>
                    <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${res.dados.tipo_procedimento.id}")'>
                </td>`;
        tr += `</tr>`
    
        if (elem('txt-id').value == res.dados.tipo_procedimento.id) {
            document.getElementById(res.dados.tipo_procedimento.id).innerHTML = tr;
        } else {
            cadastrosBuff.dados.tipo_procedimento.push(res.dados.tipo_procedimento);
            TiposProcedimentosListar();
        }

        Mens(res.msg);

    });

}

/************************************************************************
| Procedimentos
*************************************************************************/
function ProcedimentosAdicionar() {
   
    let modal = document.getElementById('modal-padrao');
    
    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Procedimentos';

    let card = document.getElementById('card');
                                            
    card.style.width = '45rem';
    card.style.marginTop = '10rem';
   
    elem('txt-id').value = 0;
    elem('txt-proc').value = null;
    elem('txt-bpa-cod').value = null;
    elem('sel-tipo').value = 0;
    elem('sel-encam').value = 'X';

}

function ProcedimentosCarregar(nome = '*') {

    cadastrosBuff = [];

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/procedimentos/listar/${nome}`,{}, 'GET', async (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        let opt = `<option disabled hidden value='0'></option>`;

        await res.dados.tipo_procedimento.map((tipo) => {

            if (tipo.ativo == 0) {
                opt += `<option value='${tipo.codigo}'>${tipo.descricao}</option>`;
            }

        });

        elem('sel-tipo').innerHTML = opt;

        ProcedimentosListar(1);

    });

}

function ProcedimentosListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.procedimentos.length) x = cadastrosBuff.dados.procedimentos.length;
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff.dados.procedimentos[i].id}'>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.procedimentos[i].id}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.procedimentos[i].procedimento}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar("${cadastrosBuff.dados.procedimentos[i].id}")'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${cadastrosBuff.dados.procedimentos[i].id}")'></td>`;
        tr += `</tr>`

        i++;

    }

    Editar = (id) => {

        SendDataController(`/cadastros/procedimentos/editar/${id}`,{},'GET', (res) => {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Procedimento';

            let card = document.getElementById('card');
                                                
            card.style.width = '45rem';
            card.style.marginTop = '10rem';

            elem('txt-id').value = res.dados.procedimentos.id;
            elem('txt-proc').value = res.dados.procedimentos.procedimento;
            elem('txt-bpa-cod').value = res.dados.procedimentos.bpa_cod;
            elem('sel-tipo').value = res.dados.procedimentos.tipo;
            elem('sel-encam').value = res.dados.procedimentos.encaminha_enf;
            elem('chk-ativo').checked = res.dados.procedimentos.ativo == 0 ? true : false;

        });

    }

    Excluir = (id) => {
        
        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/procedimentos/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');
    
                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;
    
                cadastrosBuff.dados.procedimentos.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.dados.procedimentos.splice(i);
                        ProcedimentosListar();
                    }
                    i++;
                });

                Mens(res.msg);
    
            });

        });
    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;
 
}

function ProcedimentosSalvar() {

    if (elem('txt-proc').value == '') {
        Mens('Preenchimento do Nome do procedimento obrigatorio!');
        return
    }

    if (elem('txt-bpa-cod').value.length == 0 || elem('txt-bpa-cod').value == 0) {
        Mens("Digite o codigo BPA.");
        return
    }

    if(elem('sel-tipo').value == '0') {
        Mens('Selecione um tipo de procedimento.');
        return
    }

    if(elem('sel-encam').value == 'X') {
        Mens('Verifique opção de encaminhamento.');
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        nome: elem('txt-proc').value,
        bpa_cod: elem('txt-bpa-cod').value,
        tipo: elem('sel-tipo').value,
        encaminha_enf: elem('sel-encam').value,
        ativo: ativo
    };

    SendDataController('/cadastros/procedimentos/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }
    
        let tr = '' 
        
        tr += `<tr id='${res.dados.procedimentos.id}'>`;
        tr += `<td class='text-left align-middle'>${res.dados.procedimentos.id}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.procedimentos.procedimento}</td>`;
        tr += `<td>
                    <img src='/img/edit.svg' height='18' width='18' onClick='Editar("${res.dados.procedimentos.id}")'>
                    <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${res.dados.procedimentos.id}")'>
                </td>`;
        tr += `</tr>`
    
        if (elem('txt-id').value == res.dados.procedimentos.id) {
            document.getElementById(res.dados.procedimentos.id).innerHTML = tr;
        } else {
            cadastrosBuff.dados.procedimentos.push(res.dados.procedimentos);
            ProcedimentosListar();
        }

        Mens(res.msg)
    });

}

/************************************************************************
| Tipos de Prescricoes
*************************************************************************/
function TiposPrescricoesAdicionar() {
   
    let modal = document.getElementById('modal-padrao');
    
    openModal(modal);

    document.getElementById('tit-modal').innerText = 'Adicionar Tipo de Prescrição';

    let card = document.getElementById('card');
                                            
    card.style.width = '35rem';
    card.style.marginTop = '9rem';
   
    elem('txt-id').value = 0;
    elem('txt-descr').value = null;
    elem('txt-cod').value = 0;

}

function TiposPrescricoesCarregar(nome = '*') {

    cadastrosBuff = [];

    document.getElementById('tbody').innerHTML = '<span class="sub-tit ms-2 mt-2">aguarde, carregando os dados...</span>';
    
    SendDataController(`/cadastros/tipos_prescricoes/listar/${nome}`,{}, 'GET', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        cadastrosBuff = res;

        TiposPrescricoesListar(1);

    });

}

function TiposPrescricoesListar(pagina = 1) {

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > cadastrosBuff.dados.tipo_prescricoes.length) x = cadastrosBuff.dados.tipo_prescricoes.length;
    
    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        tr += `<tr id='${cadastrosBuff.dados.tipo_prescricoes[i].id}'>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.tipo_prescricoes[i].id}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.tipo_prescricoes[i].descricao}</td>`;
        tr += `<td class='text-left align-middle'>${cadastrosBuff.dados.tipo_prescricoes[i].codigo}</td>`;
        tr += `<td><img src='/img/edit.svg' height='18' width='18' onClick='Editar("${cadastrosBuff.dados.tipo_prescricoes[i].id}")'>
        <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${cadastrosBuff.dados.tipo_prescricoes[i].id}")'></td>`;
        tr += `</tr>`

        i++;

    }

    Editar = (id) => {

        SendDataController(`/cadastros/tipos_prescricoes/editar/${id}`,{},'GET', (res) => {

            let modal = document.getElementById('modal-padrao');

            openModal(modal);

            document.getElementById('tit-modal').innerText = 'Editar Vinculo';

            let card = document.getElementById('card');
                                                
            card.style.width = '35rem';
            card.style.marginTop = '9rem';

            elem('txt-id').value = res.dados.tipo_prescricoes.id;
            elem('txt-descr').value = res.dados.tipo_prescricoes.descricao;
            elem('txt-cod').value = res.dados.tipo_prescricoes.codigo;
            elem('chk-ativo').checked = res.dados.tipo_prescricoes.ativo == 0 ? true : false;

        });

    }

    Excluir = (id) => {
        
        Confirmar('Deseja Excluir esse registro agora ?',() =>{
            
            SendDataController(`/cadastros/tipos_prescricoes/excluir/${id}`,{}, 'GET', (res) => {

                closeModal('modal-confirm');
    
                if(res.err > 0) {
                    Mens(res.msg);
                    return
                }
    
                let i = 0;
    
                cadastrosBuff.dados.tipo_prescricoes.map( (ind) => {
                    if (ind.id == id) {
                        cadastrosBuff.dados.tipo_prescricoes.splice(i);
                        TiposPrescricoesListar();
                    }
                    i++;
                });

                Mens(res.msg);
    
            });

        });
    }

    document.getElementById('tbody').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(cadastrosBuff.dados.tipo_prescricoes.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao').innerHTML = opt;
    document.getElementById('sel-paginacao').value = pagina;
 
}

function TiposPrescricoesSalvar() {

    if (elem('txt-descr').value == '') {
        Mens('Preenchimento do Nome do procedimento obrigatorio!');
        return
    }

    if (elem('txt-cod').value.length == 0 || elem('txt-cod').value == 0) {
        Mens("Digite o codigo.");
        return
    }

    let ativo = elem('chk-ativo').checked ? 0 : 1;

    let dados = {
        id: elem('txt-id').value,
        descricao: elem('txt-descr').value,
        codigo: elem('txt-cod').value,
        ativo: ativo
    };

    SendDataController('/cadastros/tipos_prescricoes/salvar',dados, 'POST', (res) => {

        closeModal('modal-padrao');

        if(res.err > 0) {
            Mens(res.msg);
            return
        }
    
        let tr = '' 
        
        tr += `<tr id='${res.dados.id}'>`;
        tr += `<td class='text-left align-middle'>${res.dados.id}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.descricao}</td>`;
        tr += `<td class='text-left align-middle'>${res.dados.codigo}</td>`;
        tr += `<td>
                    <img src='/img/edit.svg' height='18' width='18' onClick='Editar("${res.dados.id}")'>
                    <img class='ms-1' src='/img/trash.svg' height='18' width='18' onClick='Excluir("${res.dados.id}")'>
                </td>`;
        tr += `</tr>`
    
        if (elem('txt-id').value == res.dados.id) {
            document.getElementById(res.dados.id).innerHTML = tr;
        } else {
            cadastrosBuff.dados.push(res.dados);
            TiposPrescricoesListar();
        }

        Mens(res.msg)

    });

}

/************************************************************************
| Modal Pesquisa Procedimentos (Especialidade)
*************************************************************************/
function AbirModalPesqProcedimento() {

    procedimentos = [];
       
    let nome = !document.getElementById('txt-pesq-proc').value ? '*' : document.getElementById('txt-pesq-proc').value ;

    SendDataController(`/cadastros/procedimentos/listar/${nome}`,{}, 'GET', async (res) => {

        let modal = document.getElementById('modal-pesq-procedimento');
        
        openModal(modal);

        document.getElementById('tit-modal-pesq').innerText = 'Pesquisar Procedimento';

        let card = document.getElementById('card-pesq-proc');
                                                
        card.style.width = '45vw';
        card.style.marginTop = '9em';
        card.style.height = '480px'

        procedimentos = res.dados.procedimentos;

        ListarProcEspecialidade()

    });

}

function ListarProcEspecialidade(pagina = 1) {

    let porPagina = 11; //cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;
    let tr = '';

    if (x > procedimentos.length) x = procedimentos.length;
    
    document.getElementById('tbody-proc').innerHTML = null;

    while (i < x) {

        let posicao = i;

        if (procedimentos[i].ativo == 0) {

            tr += `<tr id='${procedimentos[i].id}'>`;
            tr += `<td class='text-left align-middle'>${procedimentos[i].id}</td>`;
            tr += `<td class='text-left align-middle'>${procedimentos[i].procedimento}</td>`;
            tr += `<td><img src='/img/select.svg' height='18' width='18' onClick='Selecionar(${posicao})'>`;
            tr += `</tr>`

        }

        i++;

    }

    Selecionar = (pos) => {

        const dados =  {
            especialidade_id: parseFloat(document.getElementById('txt-id').value),
            proc_id: procedimentos[pos].id,
            bpa_cod: procedimentos[pos].bpa_cod,
            procedimento: procedimentos[pos].procedimento
        }

        procListados.push(dados);

        ListarProcedimentosSelecionados();

    }

    document.getElementById('tbody-proc').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao-proc').innerHTML = null;

    let qtdepaginas = Math.ceil(procedimentos.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao-proc').innerHTML = opt;
    document.getElementById('sel-paginacao-proc').value = pagina;
 
}

function ListarProcedimentosSelecionados(pagina = 1) {

    document.getElementById('tbody-cadastro-procedimentos').innerHTML = null;

    let tr = '';
    let porPagina = cfgResolucao() - 9;
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;

    if (x > procListados.length) x = procListados.length;

    while (i < procListados.length) {

        let posicao = i;

        tr += `<tr>`;
        tr += `<td>${procListados[i].proc_id}</td>`;
        tr += `<td>${procListados[i].procedimento}</td>`;
        tr += `<td>${procListados[i].bpa_cod}</td>`;
        tr += `<td><img src='img/trash.svg' height='18' width='18' onClick='Excluir(${procListados[i].proc_id},${posicao})'></td>`;
        tr += `</tr>`;

        i++;

    }

    Excluir = (id,pos) => {
        
        const dados =  {
            especialidade_id: document.getElementById('txt-id').value,
            proc_id: id
        }

        SendDataController(`/cadastros/esp_procedimentos/excluir/${dados.especialidade_id}-${dados.proc_id}`,{},'GET', (res) => {

            procListados.splice(pos,1);

            ListarProcedimentosSelecionados()

        });
       
    }

    document.getElementById('tbody-cadastro-procedimentos').innerHTML = tr;

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao-procedimentos').innerHTML = null;

    let qtdepaginas = Math.ceil(procListados.length / porPagina);

    let opt = '<option value="1">1/1</option>';

    if (qtdepaginas > 1) {

        opt = '';

        for (i=1; i <= qtdepaginas; i++) {
            opt += `<option value="${i}">${i} / ${qtdepaginas}</option>`;
        }
        
    }

    document.getElementById('sel-paginacao-procedimentos').innerHTML = opt;
    document.getElementById('sel-paginacao-procedimentos').value = pagina;

    closeModal('modal-pesq-procedimento');

}

