let buffDados = [];
let buffArquivos = [];

/*************************************************************************/
AbrirBuscaCEP = (cep,ender,bai,cid,uf) => {

    let modal = document.getElementById('modal-sel-cep');

    openModal(modal);

    document.getElementById('tit-modal-cep').innerText = "Pesquisar CEP's";

    let card = document.getElementById('card-cep');
                                            
    card.style.width = '45em';
    card.style.marginTop = '5em';
   
    elem('txt-uf-cep').value = null;
    elem('txt-cid').value = null;
    elem('txt-log').value = null;
    elem('sel-tp-log').value = "0";
    
    elem('tag-cep').value = cep;
    elem('tag-ender').value = ender;
    elem('tag-bai').value = bai;
    elem('tag-cid').value = cid;
    elem('tag-uf').value = uf;

    elem('tbody-cep').innerHTML = null;
    elem('sel-paginacao-cep').innerHTML = null;
};

BuscarCEP = async () => {

    if (opt('sel-tp-log').value == "0") {
        Mens("Selecione um tipo de logradouro.");
        return
    }

    if (elem('txt-log').value == "") {
        Mens("Digite um logradouro a ser pesquisado.");
        return
    }

    if (elem('txt-cid').value =="") {
        Mens("Digite a cidade do logradouro.");
        return
    }

    if (elem('txt-uf-cep').value == "") {
        Mens("Digite a UF do logradouro.");
        return
    }

    let uf = elem('txt-uf-cep').value;
    let cidade = elem('txt-cid').value;
    let tipo = opt('sel-tp-log').value;
    let logra = elem('txt-log').value;

    elem('txt-uf-cep').value = uf.toUpperCase();
    elem('txt-cid').value = cidade.toUpperCase();
    elem('txt-log').value = logra.toUpperCase();
   
    logra = logra.toUpperCase()

    buffDados = [];

    let url = new URL("https://viacep.com.br/ws/"+ uf +"/" + cidade + "/" + tipo + "+" + logra + "/json/");

    try {

        const response = await fetch(url, {
            method: "GET",            
            headers: {
                'Access-Control-Allow-Origin':'*'
            }
        });

        if (response.status !== 200) {
            Mens(response.statusText);
            return
        }
    
        buffDados = await response.json();

        let i = 0;
    
        let frag = document.createDocumentFragment();
    
        while (i < buffDados.length) {
    
            let cep = document.createElement('td');
            cep.textContent = buffDados[i].cep;
    
            let logra = document.createElement('td');
            logra.textContent = buffDados[i].logradouro;
    
            let bairro = document.createElement('td');
            bairro.textContent = buffDados[i].bairro;
    
            let compl = document.createElement('td');
            compl.textContent = buffDados[i].complemento;
    
            let uf = document.createElement('td');
            uf.textContent = buffDados[i].uf;
    
            let img_sel = document.createElement('img');
            img_sel.src = '/img/select.svg';
            img_sel.height = '16';
            img_sel.width = '16';
    
            let tag_cep = buffDados[i].cep;
            let tag_ender = buffDados[i].logradouro;
            let tag_bai = buffDados[i].bairro;
            let tag_cid = buffDados[i].localidade;
            let tag_uf = buffDados[i].uf;
    
            img_sel.onclick = () => {                
    
               elem(elem('tag-cep').value).value = tag_cep;
    
               if (elem(elem('tag-ender').value).value == '') {
                   elem(elem('tag-ender').value).value = tag_ender;  
               }
    
               if (elem(elem('tag-bai').value).value == '') {
                   elem(elem('tag-bai').value).value = tag_bai;  
               }
    
               if (elem(elem('tag-cid').value).value == '') {
                   elem(elem('tag-cid').value).value = tag_cid;  
               }
    
               if (elem(elem('tag-uf').value).value == '') {
                   elem(elem('tag-uf').value).value = tag_uf;  
               }
    
               closeModal('modal-sel-cep');
    
            }
    
            acao = document.createElement('td');
    
            acao.appendChild(img_sel)
    
            let tr = document.createElement('tr');
    
            tr.appendChild(cep);
            tr.appendChild(logra);
            tr.appendChild(bairro);
            tr.appendChild(compl);
            tr.appendChild(uf);
            tr.appendChild(acao);
    
            frag.appendChild(tr);
    
            i++;
        }
        
        document.getElementById('tbody-cep').appendChild(frag)
    
    } 
    catch (error) {
      alert('Aviso : '+ error);
    }

}

/*************************************************************************/
PesquisarPaciente = () => {

    let modal =  document.getElementById('modal-sel-pac')
    
    openModal(modal)

    document.getElementById('tit-modal').innerHTML = 'Pesquisar Paciente'
    document.getElementById('tbody').innerHTML = null;
    document.getElementById('txt-nm-pac').value = null;
    document.getElementById('btn-novo-pac').setAttribute('disabled','disabled');
    document.getElementById('sel-paginacao').text = '...'

    let card = document.getElementById('card')

    card.style.width = '55vw';
    card.style.marginTop = '7em';
    
}

CarregarPacientes = () => {

    let nome = elem('txt-nm-pac').value; 
   
    if (nome.length < 10 ) {
        Mens('Digite pelo menos 12 caracteres para pesquisar um nome paciente.');
        return
    }

    let dados = { 
        nome: nome.toUpperCase(),
    };

    buffDados = [];

    document.getElementById('tbody').innerHTML = null;
    
    SendDataController('/recepcao/atendimentos/listar_pacientes',dados, 'POST', (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        document.getElementById('btn-novo-pac').removeAttribute('disabled');

        if (res.dados.length == 0 ) {
            Mens('Paciente não cadastrado.');
            return
        }

        buffDados = res;

        ListarPacientes(1);

    }); 

}

ListarPacientes = (pagina = 1) => {

    let frag = document.createDocumentFragment()
    let porPagina = 15;
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina;

    if (x > buffDados.dados.pacientes.length) {
        x = buffDados.dados.pacientes.length;
    }

    document.getElementById('tbody').innerHTML = null;

    while (i < x) {

        let z = i;

        let id = document.createElement('td');
        id.classList.add('text-left','align-middle');
        id.textContent = buffDados.dados.pacientes[i].id;

        let nome = document.createElement('td');
        nome.classList.add('text-left','align-middle');
        nome.textContent = buffDados.dados.pacientes[i].nome;

        let dt_nasc = document.createElement('td');
        dt_nasc.classList.add('text-left','align-middle');
        dt_nasc.textContent = FormatDateMySQL(buffDados.dados.pacientes[i].dt_nasc.substr(0,10));

        let nm_mae = document.createElement('td');
        nm_mae.classList.add('text-left','align-middle');
        nm_mae.textContent = buffDados.dados.pacientes[i].nm_mae;
        
        let acao = document.createElement('td')
        acao.classList.add('text-left','align-middle');

        let img_edit = document.createElement('img')
        img_edit.src = '/img/edit.svg';
        img_edit.width = '16';
        img_edit.height = '16';
        
        img_edit.onclick = () => {

            let dados = { id: buffDados.dados.pacientes[z].id }

            SendDataController('/recepcao/atendimentos/edit_paciente',dados, 'POST', async (res) => {

                let modal = document.getElementById('modal-cad-pac');

                openModal(modal);

                let card = document.getElementById('card-cad-pac');

                card.style.width = '65em';

                document.getElementById('tit-modal-cad-pac').textContent = 'Editar Paciente';

                document.getElementById('txt-id-pac').value = res.dados.pacientes.id;
                document.getElementById('txt-nome-pac').value = res.dados.pacientes.nome;
                document.getElementById('txt-dtnasc-pac').value = FormatDateMySQL(res.dados.pacientes.dt_nasc.substr(0,10));
                document.getElementById('txt-nm-mae-pac').value = res.dados.pacientes.nm_mae;
                document.getElementById('txt-nm-pai-pac').value = res.dados.pacientes.nm_pai;
                document.getElementById('txt-natur-pac').value = res.dados.pacientes.naturalidade;
                document.getElementById('txt-nacio-pac').value = res.dados.pacientes.nacionalidade;
                document.getElementById('txt-ender-pac').value = res.dados.pacientes.endereco;
                document.getElementById('txt-num-pac').value = res.dados.pacientes.numero;
                document.getElementById('txt-bairro-pac').value = res.dados.pacientes.bairro;
                document.getElementById('txt-cidade-pac').value = res.dados.pacientes.cidade;
                document.getElementById('txt-uf-pac').value = res.dados.pacientes.uf;
                document.getElementById('txt-cep-pac').value = res.dados.pacientes.cep;
                document.getElementById('txt-rg-pac').value = res.dados.pacientes.rg_num;
                document.getElementById('txt-org-pac').value = res.dados.pacientes.rg_org;
                document.getElementById('txt-cns-pac').value = res.dados.pacientes.cns;
                document.getElementById('txt-cpf-pac').value = formatar_cpf(res.dados.pacientes.cpf);
                document.getElementById('txt-cel-1-pac').value = res.dados.pacientes.celular_i;
                document.getElementById('txt-cel-2-pac').value = res.dados.pacientes.celular_ii;
                document.getElementById('txt-email-pac').value = res.dados.pacientes.email;

                document.getElementById('sel-sexo-pac').innerHTML = `<option value="0"></option>`;
                document.getElementById('sel-raca-pac').innerHTML = `<option value="0"></option>`;
                document.getElementById('sel-est-civil-pac').innerHTML = `<option value="0"></option>`;

                await res.dados.sexos.map( (sexo) => {
                    document.getElementById('sel-sexo-pac').innerHTML += `<option value="${sexo.id}">${sexo.nome}</option>`;
                });

                await res.dados.racas.map( (raca) => {
                    document.getElementById('sel-raca-pac').innerHTML += `<option value="${raca.id}">${raca.nome}</option>`;                    
                });

                await res.dados.estado_civis.map( (estado) => {
                    document.getElementById('sel-est-civil-pac').innerHTML += `<option value="${estado.id}">${estado.nome}</option>`;                    
                });

                document.getElementById('sel-raca-pac').value = res.dados.pacientes.raca_id;
                document.getElementById('sel-sexo-pac').value = res.dados.pacientes.sexo_id;
                document.getElementById('sel-est-civil-pac').value = res.dados.pacientes.estado_civil_id;
            
            });

        }

        let img_sel = document.createElement('img')
        img_sel.src = '/img/select.svg';
        img_sel.width = '18';
        img_sel.height = '18';
        img_sel.style.marginLeft = '8px';

        img_sel.onclick = () => {

            let dados = { id: buffDados.dados.pacientes[z].id }

            SendDataController('/recepcao/atendimentos/encontrar_paciente',dados, 'POST', (res) => {

                document.getElementById('txt-prontuario').value = res.dados.pacientes.id;
                document.getElementById('txt-nome').value = res.dados.pacientes.nome;
                document.getElementById('txt-dt-nasc').value = res.dados.pacientes.dt_nasc.substr(0,10);
                document.getElementById('txt-nm-pai').value = res.dados.pacientes.nm_pai;
                document.getElementById('txt-nm-mae').value = res.dados.pacientes.nm_mae;
                document.getElementById('txt-endereco').value = res.dados.pacientes.endereco;
                document.getElementById('txt-bairro').value = res.dados.pacientes.bairro;
                document.getElementById('txt-numero').value = res.dados.pacientes.numero;
                document.getElementById('txt-cidade').value = res.dados.pacientes.cidade;
                document.getElementById('txt-cep').value = res.dados.pacientes.cep;
                document.getElementById('txt-uf').value = res.dados.pacientes.uf;
                document.getElementById('txt-celular').value = res.dados.pacientes.celular_i;
                document.getElementById('txt-celular_ii').value = res.dados.pacientes.celular_ii;
                document.getElementById('txt-cpf').value = formatar_cpf(res.dados.pacientes.cpf);

                document.getElementById('txt-dt-atend').value = res.dados.dt_atend

                document.getElementById('sel-sexo').innerHTML = null;

                let frag = document.createDocumentFragment();

                let op_sexo = document.createElement('option');
    
                let i = 0;
    
                op_sexo.value = 0;
                op_sexo.textContent = '...';
    
                frag.appendChild(op_sexo);
    
                while (i < res.dados.sexos.length) {
    
                    let op_sexo = document.createElement('option');

                    let id = res.dados.sexos[i].id;
                    let nome = res.dados.sexos[i].nome;

                    op_sexo.value = id
                    op_sexo.textContent = nome;
    
                    frag.appendChild(op_sexo);
    
                    i++;
    
                }
    
                document.getElementById('sel-sexo').appendChild(frag);
                document.getElementById('sel-sexo').value = res.dados.pacientes.sexo_id;

                /*************************************************************************************** */
                i = 0;
                
                document.getElementById('sel-racas').innerHTML = null;

                frag = document.createDocumentFragment();

                let op_raca = document.createElement('option');

                op_raca.value = 0;
                op_raca.textContent = '...';
    
                frag.appendChild(op_raca);
    
                while (i < res.dados.racas.length) {
    
                    let op_raca = document.createElement('option');
                    let id = res.dados.racas[i].id;
                    let nome = res.dados.racas[i].nome;
    
                    op_raca.value = id;
                    op_raca.textContent = nome;
    
                    frag.appendChild(op_raca);
    
                    i++;
    
                }
    
                document.getElementById('sel-racas').appendChild(frag);
                document.getElementById('sel-racas').value = res.dados.pacientes.raca_id;

                /*************************************************************************************** */
                i = 0;
                
                document.getElementById('sel-est-civis').innerHTML = null;

                frag = document.createDocumentFragment();

                let op_est = document.createElement('option');
                let id = 0;
                let nome = '...';
    
                op_est.value = id;
                op_est.textContent = nome;
    
                frag.appendChild(op_est);
    
                while (i < res.dados.estado_civis.length) {
    
                    let op_est = document.createElement('option');
                    let id = res.dados.estado_civis[i].id;
                    let nome = res.dados.estado_civis[i].nome;
    
                    op_est.value = id;
                    op_est.textContent = nome;
    
                    frag.appendChild(op_est);
    
                    i++;
    
                }
    
                document.getElementById('sel-est-civis').appendChild(frag);
                document.getElementById('sel-est-civis').value = res.dados.pacientes.estado_civil_id;

                /*************************************************************************************** */
                i = 0;
                
                document.getElementById('sel-tp-atend').innerHTML = null;

                frag = document.createDocumentFragment();

                let op_tipo = document.createElement('option');
                
                op_tipo.value = 0;
                op_tipo.textContent = '...';
    
                frag.appendChild(op_tipo);
    
                while (i < res.dados.tipoatend.length) {
    
                    if (res.dados.tipoatend[i].ativo == 0) {

                        let op_tipo = document.createElement('option');
                        let id = res.dados.tipoatend[i].id;
                        let nome = res.dados.tipoatend[i].nome;
        
                        op_tipo.value = id;
                        op_tipo.textContent = nome;
        
                        frag.appendChild(op_tipo);

                    }
    
                    i++;
    
                }
    
                document.getElementById('sel-tp-atend').appendChild(frag);

                /*************************************************************************************** */
                i = 0;
                
                document.getElementById('sel-rg-atend').innerHTML = null;

                frag = document.createDocumentFragment();

                let op_reg = document.createElement('option');
                
                op_reg.value = 0;
                op_reg.textContent = '...';
    
                frag.appendChild(op_reg);
    
                while (i < res.dados.regimeatend.length) {
    
                    if (res.dados.regimeatend[i].ativo == 0) {

                        let op_reg = document.createElement('option');
                        let id = res.dados.regimeatend[i].id;
                        let nome = res.dados.regimeatend[i].nome;
        
                        op_reg.value = id;
                        op_reg.textContent = nome;
        
                        frag.appendChild(op_reg);

                    }
    
                    i++;
    
                }
    
                document.getElementById('sel-rg-atend').appendChild(frag);

                /*************************************************************************************** */
                i = 0;
                
                document.getElementById('sel-esp-atend').innerHTML = null;

                frag = document.createDocumentFragment();

                let op_esp = document.createElement('option');
                
                op_esp.value = 0;
                op_esp.textContent = '...';
    
                frag.appendChild(op_esp);
    
                while (i < res.dados.especialidades.length) {
    
                    if (res.dados.especialidades[i].ativo == 0) {

                        let op_esp = document.createElement('option');
                        let id = res.dados.especialidades[i].id;
                        let nome = res.dados.especialidades[i].nome;
        
                        op_esp.value = id;
                        op_esp.textContent = nome;
        
                        frag.appendChild(op_esp);

                    }
    
                    i++;
    
                }
    
                document.getElementById('sel-esp-atend').appendChild(frag);
                
                closeModal('modal-sel-pac')

            });

        }

        acao.appendChild(img_edit);
        acao.appendChild(img_sel);

        let tr = document.createElement('tr');

        tr.id = 'pac-' + buffDados.dados.pacientes[i].id;

        tr.appendChild(id);
        tr.appendChild(nome);
        tr.appendChild(dt_nasc);
        tr.appendChild(nm_mae);
        tr.appendChild(acao);

        frag.appendChild(tr)

        i++;

    }

    document.getElementById('tbody').appendChild(frag);

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(buffDados.dados.pacientes.length / porPagina);

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

AddArquivo = () => {

    let modal = document.getElementById('modal-upload');

    openModal(modal);

    document.getElementById('card-upload').style.marginTop = '10em'
    document.getElementById('card-upload').style.width = '35vw'

    document.getElementById('tit-modal-upload').innerText = "Adicionar Exames e Encaminhamento";
   
    elem('sel-tipo-arquivo').value = 0;
    elem('txt-nm-arq').value = null;

}

UpArquivo = () => {

    let arquivo = document.getElementById('arquivo').files[0];
    let tipo_arquivo = opt('sel-tipo-arquivo').value;
    let prontuario = document.getElementById('txt-prontuario').value;
    let nome_exame = document.getElementById('txt-nm-exame').value;

    try {

        if (prontuario == '0') {
            throw new Error('Selecione um Paciente antes de fazer um upload de um arquivo.');
        }

        if (!tipo_arquivo) {
            throw new Error('Selecione um tipo de arquivo.');
        }
        
        if (!arquivo) {
            throw new Error('Selecione um arquivo para Upload.')
        }

        let arquivos_permitidos = ['image/jpeg','image/png','application/pdf'];
        let arquivo_tamanho_permitido = (1024 * 1024) * 0.35

        if (!arquivos_permitidos.includes(arquivo.type)) {
            throw new Error('Tipo de arquivo não permitido.');
        }

        if (arquivo.size > arquivo_tamanho_permitido) {
            throw new Error('Tamanho do arquivo não permitido.');
        }

        if (tipo_arquivo == 'ENC' && nome_exame == '') {
            nome_exame = 'Encaminhamento';
        }
        else if(tipo_arquivo !== 'ENC' && nome_exame == '') {
            throw new Error('Digite o nome do exame.');
        }
        
    } catch (error) {

        document.getElementById('txt-nm-arq').value = null;
        document.getElementById('arquivo').value = null;

        Mens(error.message);

        return
        
    }

    const novo_arquivo = prontuario + '-' + tipo_arquivo + '-' + Date.now() + '.' + arquivo.name.split('.').pop();
 
    const dados = new FormData();

    dados.append('arquivo', arquivo, novo_arquivo);

    UploadFiles('/recepcao/atendimentos/upload',dados, (res) => {

        let arquivos = {
            nome_exame: nome_exame,
            nome_arquivo: arquivo.name,
            novo_arquivo: novo_arquivo,
            tipo_arquivo: tipo_arquivo,
            mimetype: arquivo.type
        }
    
        buffArquivos.push(arquivos);
        
        document.getElementById('tbody-exam').innerHTML = null;
    
        let i= 0;
        let tbody = '';
    
        while (i < buffArquivos.length) {
    
            tbody = `<tr>`;
            tbody += `<td> ${i + 1} </td>`;
            tbody += `<td> ${buffArquivos[i].nome_exame} </td>`;
            tbody += `<td> ${buffArquivos[i].nome_arquivo} </td>`;
            tbody += `<td><img src='/img/trash.svg' width='18' height='18' onclick='DelArquivo(${i},"${buffArquivos[i].novo_arquivo}")'></td>`;
            tbody += `</tr>`;
    
            document.getElementById('tbody-exam').innerHTML += tbody
    
            i++
    
        }

        document.getElementById('txt-nm-arq').value = null;
        document.getElementById('txt-nm-exame').value = null;
        document.getElementById('txt-nm-exame').setAttribute('disabled','disabled');
        document.getElementById('sel-tipo-arquivo').value = 0;
        document.getElementById('arquivo').value = null;

        Mens(res.msg);

    })

}

DelArquivo = (idx,nomeArquivo) => {

    let dados = {
        nome_arquivo: nomeArquivo
    }

    SendDataController('/recepcao/atendimentos/remover_upload',dados,'POST', (res) => {

        buffArquivos.splice(idx,1);

        document.getElementById('tbody-exam').innerHTML = null;
        
        let i= 0;
        let tbody = '';
    
        while (i < buffArquivos.length) {
    
            tbody = `<tr>`;
            tbody += `<td> ${i + 1} </td>`;
            tbody += `<td> ${buffArquivos[i].nome_exame} </td>`;
            tbody += `<td> ${buffArquivos[i].nome_arquivo} </td>`;
            tbody += `<td><img src='/img/trash.svg' width='18' height='18' onclick='DelArquivo(${i},"${buffArquivos[i].novo_arquivo}")'></td>`;
            tbody += `</tr>`;
    
            document.getElementById('tbody-exam').innerHTML += tbody
    
            i++
    
        }

        Mens(res.msg)

    });
}

AddPaciente = () => {

    let modal = document.getElementById('modal-cad-pac');

    openModal(modal);

    let card = document.getElementById('card-cad-pac');

    card.style.width = '62em';
    card.style.marginTop = '8em';

    document.getElementById('tit-modal-cad-pac').textContent = 'Novo Paciente';

    document.getElementById('txt-id-pac').value = 0;
    document.getElementById('txt-nome-pac').value = null;
    document.getElementById('txt-dtnasc-pac').value = null;
    document.getElementById('txt-nm-mae-pac').value = null;
    document.getElementById('txt-nm-pai-pac').value = null;
    document.getElementById('txt-natur-pac').value = null;
    document.getElementById('txt-nacio-pac').value = null;
    document.getElementById('txt-ender-pac').value = null;
    document.getElementById('txt-num-pac').value = null;
    document.getElementById('txt-bairro-pac').value = null;
    document.getElementById('txt-cidade-pac').value = null;
    document.getElementById('txt-uf-pac').value = null;
    document.getElementById('txt-cep-pac').value = null;
    document.getElementById('txt-rg-pac').value = null;
    document.getElementById('txt-org-pac').value = null;
    document.getElementById('txt-cns-pac').value = null;
    document.getElementById('txt-cpf-pac').value = null;
    document.getElementById('txt-cel-1-pac').value = null;
    document.getElementById('txt-cel-2-pac').value = null;
    document.getElementById('txt-email-pac').value = null;

    document.getElementById('sel-sexo-pac').innerHTML = `<option value="0"></option>`;
    document.getElementById('sel-raca-pac').innerHTML = `<option value="0"></option>`;
    document.getElementById('sel-est-civil-pac').innerHTML = `<option value="0"></option>`;

    SendDataController('/recepcao/atendimentos/novo_paciente',{},'GET', async (res) => {

        let option;

        await res.dados.sexos.map( (sexos) => {

            option = `<option value="${sexos.id}">${sexos.nome}</option>` 

            document.getElementById('sel-sexo-pac').innerHTML += option

        });

        await res.dados.racas.map( (racas) => {

            option = `<option value="${racas.id}">${racas.nome}</option>` 

            document.getElementById('sel-raca-pac').innerHTML += option

        });

        await res.dados.estado_civis.map( (estados) => {

            option = `<option value="${estados.id}">${estados.nome}</option>` 

            document.getElementById('sel-est-civil-pac').innerHTML += option

        });

    });

}

SalvarPaciente = () => {

    try {

        if (!document.getElementById('txt-nome-pac').value) throw new Error('Digite o nome do paciente.')
        if (!document.getElementById('txt-dtnasc-pac').value) throw new Error('Digite a data de nascimento do paciente.')
        if (!document.getElementById('txt-nm-mae-pac').value) throw new Error('Digite o nome da mãe do paciente.')
        if (!document.getElementById('txt-nm-pai-pac').value) throw new Error('Digite o nome do pai do paciente.')
        if (!document.getElementById('txt-natur-pac').value) throw new Error('Digite a naturalidade do paciente.')
        if (!document.getElementById('txt-nacio-pac').value) throw new Error('Digite a nacionalidade do paciente.')
        if (!document.getElementById('txt-ender-pac').value) throw new Error('Digite o endereço do paciente.')
        if (!document.getElementById('txt-num-pac').value) throw new Error('Digite o numero do endereço do paciente.')
        if (!document.getElementById('txt-bairro-pac').value) throw new Error('Digite o bairro do endereço do paciente.')
        if (!document.getElementById('txt-cidade-pac').value) throw new Error('Digite a cidade do endereço do paciente.')
        if (!document.getElementById('txt-uf-pac').value) throw new Error('Digite o uf do endereço do paciente.')
        if (!document.getElementById('txt-cep-pac').value) throw new Error('Digite o cep do endereço do paciente.')
        if (!document.getElementById('txt-rg-pac').value) throw new Error('Digite o rg do paciente.')
        if (!document.getElementById('txt-org-pac').value) throw new Error('Digite o orgão que expediu o rg do paciente.')
        if (!document.getElementById('txt-cpf-pac').value) throw new Error('Digite o cpf do paciente.')
        if (!document.getElementById('txt-cel-1-pac').value) throw new Error('Digite um contato telefonico do paciente.')
        if (opt('sel-sexo-pac').value == '0') throw new Error('Selecione o sexo do paciente.')
        if (opt('sel-raca-pac').value == '0') throw new Error('Selecione a raca do paciente.')
        if (opt('sel-est-civil-pac').value == '0') throw new Error('Selecione o estado civil do paciente.')

        if (!ValidarCPF(document.getElementById('txt-cpf-pac').value)) {
            Mens('CPF informado invalido!');
            return
        }

        if (document.getElementById('txt-email-pac').value && !ValidarEmail(document.getElementById('txt-email-pac').value)) {
            Mens('Email informado invalido!');
            return
        }

        let dados = {
            id: document.getElementById('txt-id-pac').value,
            nome: document.getElementById('txt-nome-pac').value,
            dtnasc: document.getElementById('txt-dtnasc-pac').value,
            nm_mae: document.getElementById('txt-nm-mae-pac').value,
            nm_pai: document.getElementById('txt-nm-pai-pac').value,
            natur: document.getElementById('txt-natur-pac').value,
            nacio: document.getElementById('txt-nacio-pac').value,
            ender: document.getElementById('txt-ender-pac').value,
            num: document.getElementById('txt-num-pac').value,
            bairro: document.getElementById('txt-bairro-pac').value,
            cidade: document.getElementById('txt-cidade-pac').value,
            uf: document.getElementById('txt-uf-pac').value,
            cep: document.getElementById('txt-cep-pac').value,
            rg: document.getElementById('txt-rg-pac').value,
            org: document.getElementById('txt-org-pac').value,
            cns: document.getElementById('txt-cns-pac').value,
            cpf: document.getElementById('txt-cpf-pac').value,
            cel_1: document.getElementById('txt-cel-1-pac').value,
            cel_2: document.getElementById('txt-cel-2-pac').value,
            email: document.getElementById('txt-email-pac').value,
            sexo: opt('sel-sexo-pac').value,
            raca: opt('sel-raca-pac').value,
            est_civ: opt('sel-est-civil-pac').value
        }

        SendDataController('/recepcao/atendimentos/salvar_paciente',dados,'POST', (res) => {

            Mens(res.msg);

        });

    } catch (error) {
        Mens(error.message)
    }

}

SalvarAtendimento = () => {

    try {
        
        /***********************************************************
        * Dados do Paciente 
        ************************************************************/
        if (!document.getElementById('txt-prontuario').value) throw new Error('Selecione um paciente.');
        if (!document.getElementById('txt-nm-mae').value) throw new Error('Digite o nome da mãe do paciente.');
        if (!document.getElementById('txt-nm-pai').value) throw new Error('Digite o nome do pai do paciente.');
        if (!document.getElementById('txt-nm-pai').value) throw new Error('Digite o nome do pai do paciente.');
        if (opt('sel-sexo').value == 0) throw new Error('Selecione o sexo do paciente');
        if (opt('sel-racas').value == 0) throw new Error('Selecione a raça do paciente');
        if (opt('sel-est-civis').value == 0) throw new Error('Selecione o estado civil do paciente');
        if (!document.getElementById('txt-endereco').value) throw new Error('Digite o endereço do paciente.');
        if (!document.getElementById('txt-numero').value) throw new Error('Digite o numero do endereço do paciente.');
        if (!document.getElementById('txt-bairro').value) throw new Error('Digite o bairro do endereço do paciente.');
        if (!document.getElementById('txt-cidade').value) throw new Error('Digite a cidade do endereço do paciente.');
        if (!document.getElementById('txt-uf').value) throw new Error('Digite a uf do endereço do paciente.');
        if (!document.getElementById('txt-cep').value) throw new Error('Digite cep do endereço do paciente.');
        if (!document.getElementById('txt-celular').value) throw new Error('Digite um telefone para contato do paciente.');
        if (!document.getElementById('txt-cpf').value) throw new Error('Digite cpf do paciente.');

        if (!ValidarCPF(document.getElementById('txt-cpf').value)) {
            Mens('CPF informado invalido!');
            return
        }

        /***********************************************************
        * Dados do Atendimento
        ************************************************************/
        if (opt('sel-tp-atend').value == 0) throw new Error('Selecione um tipo de atendimento.');
        if (opt('sel-rg-atend').value == 0) throw new Error('Selecione um regime de atendimento.');
        if (opt('sel-esp-atend').value == 0) throw new Error('Selecione uma especialidade de atendimento.');
        if (opt('sel-preferencial').value == 0) throw new Error('Selecione o preferência do atendimento.');
        if (!document.getElementById('txt-med-assist').value) throw new Error('Digite o nome do medico assistente.');
        if (!document.getElementById('txt-crm-assist').value) throw new Error('Digite o crm do medico assistente.');
        if (!document.getElementById('txt-esp-assist').value) throw new Error('Digite a especialidade do medico assistente.');

        let dados = {
            paciente: {
                id: document.getElementById('txt-prontuario').value,
                nm_mae: document.getElementById('txt-nm-mae').value,
                nm_pai: document.getElementById('txt-nm-pai').value,
                sexo_id: opt('sel-sexo').value,
                raca_id: opt('sel-racas').value,
                estado_civil_id: opt('sel-est-civis').value,
                endereco: document.getElementById('txt-endereco').value,
                numero: document.getElementById('txt-numero').value,
                bairro: document.getElementById('txt-bairro').value,
                cidade: document.getElementById('txt-cidade').value,
                uf: document.getElementById('txt-uf').value,
                cep: document.getElementById('txt-cep').value,
                celular_i: document.getElementById('txt-celular').value,
                celular_ii: document.getElementById('txt-celular_ii').value,
                cpf: document.getElementById('txt-cpf').value,
            },
            atendimento : {
                id_atend: parseInt(document.getElementById('txt-id-atend').value),
                tipo_id: parseInt(opt('sel-tp-atend').value),
                regime_atend_id: opt('sel-rg-atend').value,
                esp_atend_id: parseInt(opt('sel-esp-atend').value),
                preferencia: opt('sel-preferencial').value,
                medico_assist: document.getElementById('txt-med-assist').value,
                crm_assist: document.getElementById('txt-crm-assist').value,
                esp_assist: document.getElementById('txt-esp-assist').value,
                observacao: document.getElementById('txt-observ').value,
                acompanhante: document.getElementById('txt-acompanhante').value,
                exames: buffArquivos
            }    
        }

        SendDataController('/recepcao/atendimentos/salvar_atendimento',dados,'POST', (res) => {

            if (res.err > 0) {
                Mens(res.msg);
                return
            }

            LimparPloter();

            Mens(`<span>Atendimento Numero: ${res.dados.atendimentos.id}, Gerado com sucesso.</span>`);

            buffArquivos = [];

        });

    } catch (error) {
        Mens(error)
    }


}

PeriodoConsultaAtend = () => {

    let data = new Date();

    let ano =  data.getFullYear().toString();
    let mes =  (data.getMonth() + 1).toString();
    let dia = data.getDate().toString();

    mes.length < 2 ? mes = '0' + mes : mes = mes;
    dia.length < 2 ? dia = '0' + dia : dia = dia

    document.getElementById('txt-dt-ini').value = ano + '-' + mes + '-01';
    document.getElementById('txt-dt-fin').value = ano + '-' + mes + '-' + dia;

    CarregarListaAtendimentos();

}

CarregarListaAtendimentos = () => {
    
    if (!document.getElementById('txt-dt-ini').value) {
        Mens('Digite a Data Inicial do Periodo.');
        return
    }
    
    if (!document.getElementById('txt-dt-fin').value) {
        Mens('Digite a Data Final do Periodo.');
        return
    }

    const dados = {
        data_ini: document.getElementById('txt-dt-ini').value,
        data_fin: document.getElementById('txt-dt-fin').value,
        nome_paciente: document.getElementById('txt-nome-pac').value
    }

    SendDataController('/recepcao/atendimentos/listar',dados,'POST', (res) => {

        if (res.err > 0) {
            Mens(res.msg);
            return
        }

        buffDados = res;

        ListarAtendimentos();

    });

}

ListarAtendimentos = (pagina = 1) => {

    document.getElementById('tbody').innerHTML = null;

    let porPagina = cfgResolucao();
    let i = (pagina - 1) * porPagina;
    let x = i + porPagina

    x > buffDados.dados.atendimentos.length ? x = buffDados.dados.atendimentos.length : x = x

    let option = '';

    while (i < x) {

        let data = buffDados.dados.atendimentos[i].data.substr(0,10).split('-');
        data = data[2] + '-' + data[1] + '-' +data[0]

        option = `<tr>`;
        option += `<td width="90px">${buffDados.dados.atendimentos[i].id}</td>`;
        option += `<td width="140px">${data + ' ' + buffDados.dados.atendimentos[i].data.substr(11,8)} </td>`;
        option += `<td width="50px">${buffDados.dados.atendimentos[i].paciente_id}</td>`;
        option += `<td width="240px">${buffDados.dados.atendimentos[i].nome}</td>`;
        option += `<td width="240px">${buffDados.dados.atendimentos[i].nm_mae}</td>`;
        option += `<td width="200px">${buffDados.dados.atendimentos[i].nm_situacao}</td>`;
        option += `<td width="80px">
                        <img src='/img/edit.svg' height="18" width="18" onclick="EditAtendAbrirModal(${buffDados.dados.atendimentos[i].id})" >
                        <img class="ms-1" src='/img/view.svg' height="20" width="20" onclick="ExamesAtendAbrirModal(${buffDados.dados.atendimentos[i].paciente_id})">
                    </td>`;
        option += `</tr>`;

        document.getElementById('tbody').innerHTML += option;

        i++

    }

    /********************************************************************
    | Controle de Paginação da tabela
    *********************************************************************/ 
    document.getElementById('sel-paginacao').innerHTML = null;

    let qtdepaginas = Math.ceil(buffDados.dados.atendimentos.length / porPagina);

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

EditAtendAbrirModal = (id) => {

    let modal = document.getElementById('modal-edit-atend');

    openModal(modal);

    document.getElementById('tit-modal-edit-atend').innerText = "Editar Atendimento";

    let card = document.getElementById('card-edit-atend');
                                            
    card.style.width = '95em';
    card.style.marginTop = '95px';

    let dados = {
        id : id
    }

    SendDataController('/recepcao/atendimentos/edit',dados,'POST', async (res) => {

        let data = res.dados.atendimentos.data.substr(0,10).split('-');
        data = data[2] + '-' + data[1] + '-' +data[0]

        let option = '<option value="0"></option>'

        document.getElementById('sel-tp-atend').innerHTML = null;

        await res.dados.tipoatend.map( (tipo) => {

            if (tipo.ativo == 0) {

                option = `<option value='${tipo.id}'>${tipo.nome}</optinio>`;

                document.getElementById('sel-tp-atend').innerHTML += option

            }

        });

        option = '<option value="0"></option>'

        document.getElementById('sel-esp-atend').innerHTML = null;

        await res.dados.especialidades.map( (especialidade) => {

            if (especialidade.ativo == 0) {

                option = `<option value='${especialidade.id}'>${especialidade.nome}</optinio>`;

                document.getElementById('sel-esp-atend').innerHTML += option

            }

        });

        option = '<option value="0"></option>'

        document.getElementById('sel-rg-atend').innerHTML = null;

        await res.dados.regimeatend.map( (regime) => {

            if (regime.ativo == 0) {

                option = `<option value='${regime.id}'>${regime.nome}</optinio>`;

                document.getElementById('sel-rg-atend').innerHTML += option

            }

        });
       
        document.getElementById('txt-prontuario').value = res.paciente_id;
        document.getElementById('txt-nome').value = res.nm_paciente;
        document.getElementById('txt-dt-nasc').value = res.dtnasc.substr(0,10)
        document.getElementById('txt-id-atend').value = res.dados.atendimentos.id;
        document.getElementById('txt-dt-atend').value = data  + ' ' + res.dados.atendimentos.data.substr(11,8);
        document.getElementById('sel-tp-atend').value = res.dados.atendimentos.tipo_id
        document.getElementById('sel-rg-atend').value = res.dados.atendimentos.regime_atend_id
        document.getElementById('sel-esp-atend').value = res.dados.atendimentos.especialidade_atend_id
        document.getElementById('txt-med-assist').value = res.dados.atendimentos.nm_medico_assist
        document.getElementById('txt-crm-assist').value = res.dados.atendimentos.crm_medico_assist
        document.getElementById('txt-esp-assist').value = res.dados.atendimentos.esp_medico_assist
        document.getElementById('txt-observ').value = res.dados.atendimentos.observacao
        document.getElementById('txt-acompanhante').value = res.dados.atendimentos.acompanhante
       
    });

}

EditAtendSalvar = () => {

    try {
        
        /***********************************************************
        * Dados do Atendimento
        ************************************************************/
        if (opt('sel-tp-atend').value == 0) throw new Error('Selecione um tipo de atendimento.');
        if (opt('sel-rg-atend').value == 0) throw new Error('Selecione um regime de atendimento.');
        if (opt('sel-esp-atend').value == 0) throw new Error('Selecione uma especialidade de atendimento.');
        if (!document.getElementById('txt-med-assist').value) throw new Error('Digite o nome do medico assistente.');
        if (!document.getElementById('txt-crm-assist').value) throw new Error('Digite o crm do medico assistente.');
        if (!document.getElementById('txt-esp-assist').value) throw new Error('Digite a especialidade do medico assistente.');

        let dados = {
            id_atend: document.getElementById('txt-id-atend').value,
            tipo_id: opt('sel-tp-atend').value,
            regime_atend_id: opt('sel-rg-atend').value,
            esp_atend_id: opt('sel-esp-atend').value,
            medico_assist: document.getElementById('txt-med-assist').value,
            crm_assist: document.getElementById('txt-crm-assist').value,
            esp_assist: document.getElementById('txt-esp-assist').value,
            observacao: document.getElementById('txt-observ').value,
            acompanhante: document.getElementById('txt-acompanhante').value
        }

        //document.getElementById('imagem').src = res.dados.atendimento.imagem
        SendDataController('/recepcao/atendimentos/edit_salvar',dados,'POST', (res) => {

            Mens(res.msg);
           
        });

    } catch (error) {
        Mens(error.message)
    }

}

ExamesAtendAbrirModal = (id) => {

    SendDataController('/recepcao/atendimentos/listar_exames',{paciente_id: id},'POST', (res) => {

        let modal = document.getElementById('modal-exam-atend');

        openModal(modal);

        document.getElementById('tit-modal-exam-atend').innerText = "Exames Atendimento";

        let card = document.getElementById('card-exam-atend');
                                                
        card.style.width = '45em';
        card.style.marginTop = '180px';

        let tbody = '';

        document.getElementById('tbody-exam').innerHTML = null;

        res.dados.map((exames) => {

            let data =  exames.dt_inclusao.toString().replace(/T/, ' ').replace(/\..+/, '') //exames.dt_inclusao.substr(0,10).split('-');

            //data = data[2] + '-' + data[1] + '-' + data[0];

            //data += ' ' + exames.dt_inclusao.substr(11,8);

            tbody = `<tr>`;
            tbody += `<td width="50px">${exames.id}</td>`;
            tbody += `<td width="120px">${data}</td>`;
            tbody += `<td width="150px">${exames.nm_exame}</td>`;
            tbody += `<td width="150px">${exames.nm_arquivo}</td>`;
            tbody += `<td width="80px"><img src="img/trash.svg" height="18" width="14" onclick="Deletar(${exames.id})"></td>`;
            tbody += `</tr>`;

            document.getElementById('tbody-exam').innerHTML += tbody;

        });

        Deletar = (id) =>  {

            Confirmar('Deseja Excluir esse exame ?', () => {

                let dados = {
                    id_atend: document.getElementById('txt-id-atend-pac').value,
                    id: id
                }

                SendDataController('/recepcao/atendimentos/excluir_exames', dados, 'POST' ,(res) => {

                    closeModal('modal-confirm');

                    let tbody = '';

                    document.getElementById('tbody-exam').innerHTML = null;

                    res.dados.map((exames) => {

                        tbody = `<tr>`;
                        tbody += `<td width="50px">${exames.id}</td>`;
                        tbody += `<td width="120px">${exames.dt_inclusao}</td>`;
                        tbody += `<td width="150px">${exames.nm_exame}</td>`;
                        tbody += `<td width="150px">${exames.nm_arquivo}</td>`;
                        tbody += `<td width="80px"><img src="img/trash.svg" height="18" width="14" onclick="Deletar(${exames.id})"></td>`;
                        tbody += `</tr>`;

                        document.getElementById('tbody-exam').innerHTML += tbody;

                    });

                });
               
            });

        }

        document.getElementById('txt-pront-pac').value = res.id;
        document.getElementById('txt-nm-pac').value = res.nome;
        document.getElementById('txt-id-atend-pac').value = id;
        document.getElementById('txt-dtnasc-pac').value = FormatDateMySQL(res.dtnasc.substr(0,10));
                                 
    });

}

SalvarUpload = () => {

    let arquivo = document.getElementById('arquivo').files[0];
    let tipo_arquivo = opt('sel-tipo-arquivo').value;
    let prontuario = document.getElementById('txt-pront-pac').value;
    let nome_exame = document.getElementById('txt-nm-exame').value;
    let id_atend = document.getElementById('txt-id-atend-pac').value;

    if (prontuario == '0') {
        Mens('Selecione um Paciente antes de fazer um upload de um arquivo.');
        return
    }

    if (!tipo_arquivo) {
        Mens('Selecione um tipo de arquivo.');
        return
    }
    
    if (!arquivo) {
        Mens('Selecione um arquivo para Upload.')
        return
    }

    let arquivos_permitidos = ['image/jpeg','image/png','application/pdf'];
    let arquivo_tamanho_permitido = (1024 * 1024) * 0.35

    if (!arquivos_permitidos.includes(arquivo.type)) {
        Mens('Tipo de arquivo não permitido.');
        return
    }

    if (arquivo.size > arquivo_tamanho_permitido) {
        Mens('Tamanho do arquivo não permitido.');
        return
    }

    if (tipo_arquivo == 'ENC' && nome_exame == '') {
        nome_exame = 'Encaminhamento';
    }
    else if(tipo_arquivo !== 'ENC' && nome_exame == '') {
        Mens('Digite o nome do exame.');
        return
    }

    const novo_arquivo = prontuario + '-' + tipo_arquivo + '-' + Date.now() + '.' + arquivo.name.split('.').pop();
 
    const dados = new FormData();

    dados.append('arquivo', arquivo, novo_arquivo);
    dados.append('paciente_id',prontuario);
    dados.append('id_atend', id_atend);
    dados.append('nome_exame',nome_exame);
    dados.append('novo_arquivo',novo_arquivo);
    dados.append('tipo_arquivo',tipo_arquivo);
    dados.append('mimetype',arquivo.type);

    UploadFiles('/recepcao/atendimentos/salvar_upload',dados, (res) => {
    
        let tbody = '';

        document.getElementById('tbody-exam').innerHTML = null;

        res.dados.exames.map((exames) => {

            let data = exames.dt_inclusao.substr(0,10).split('-');

            data = data[2] + '-' + data[1] + '-' + data[0];

            data += ' ' + exames.dt_inclusao.substr(11,8);

            tbody = `<tr>`;
            tbody += `<td width="50px">${exames.id}</td>`;
            tbody += `<td width="120px">${data}</td>`;
            tbody += `<td width="150px">${exames.nm_exame}</td>`;
            tbody += `<td width="150px">${exames.nm_arquivo}</td>`;
            tbody += `<td width="80px"><img src="img/trash.svg" height='16' width='16' onclick="Deletar(${exames.id})"></td>`;
            tbody += `</tr>`;

            document.getElementById('tbody-exam').innerHTML += tbody;

        });

        Deletar = (id) => {

            Confirmar('Deseja Excluir esse exame ?', () => {

                let dados = {
                    id_atend: document.getElementById('txt-id-atend-pac').value,
                    id: id
                }

                SendDataController('/recepcao/atendimentos/excluir_exames', dados, 'POST' ,(res) => {

                    closeModal('modal-confirm');

                    let tbody = '';

                    document.getElementById('tbody-exam').innerHTML = null;

                    res.dados.map((exames) => {

                        tbody = `<tr>`;
                        tbody += `<td width="50px">${exames.id}</td>`;
                        tbody += `<td width="120px">${exames.dt_inclusao}</td>`;
                        tbody += `<td width="150px">${exames.nm_exame}</td>`;
                        tbody += `<td width="150px">${exames.nm_arquivo}</td>`;
                        tbody += `<td width="80px"><img src="img/trash.svg" onclick="Deletar(${exames.id})"></td>`;
                        tbody += `</tr>`;

                        document.getElementById('tbody-exam').innerHTML += tbody;

                    });

                });
               
            });

        }

        closeModal('modal-upload');

        Mens(res.msg);

    })

}

/****************************************************************/