
    /*******************************************************************
    | OUTRAS FUNÇÕES Geral Uso Sistema
    ********************************************************************/
    const token = 'zeBgBxr8km/zf7s1jkgRpLKwkBj3/EwFsrQEyCEKrt8udLinPE0tug==';
    
    //const mod_load = new bootstrap.Modal(document.getElementById('mensageiro-wait'));

    /*AbrirModal = (modalID) => {

        let modal = new bootstrap.Modal(document.getElementById(modalID));

        modal.show();
    } 

    FecharModal = (modalID) => {

        let modal = new bootstrap.Modal(document.getElementById(modalID));

        modal.hide();

    } */

    LoadPage = async (page,element_id, execute = null,nome_tela = '') => {
        
        const box = document.getElementById(element_id);
        const loading = '<span class="sub-tit ms-2 mt-2">Aguarde, carregando pagina....</span>';
        
        if (element_id != '') box.innerHTML = loading;

        try {

            const response = await fetch(page, {
                method: "GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cache-Control": "no-cache, no-store, max-age=0",
                    "Expires": "Thu, 1 Jan 1970 00:00:00 GMT",
                    "Pragma": "no-cache",
                    "Accept": "GET"
                }

            });
        
            const html = await response.text();
            
            if (element_id != '') box.innerHTML = html;

            if (response.status == 200) {
                if (execute != null) await execute()
            }

            document.getElementById('nome-tela').innerText = nome_tela;
        
        } 
        catch (error) {
          Mens('Aviso : '+ error);
        }

    };

    LimparPloter = () => {
        
        document.getElementById('ploter').innerHTML = null;
        document.getElementById('ploter').innerHTML = '<img class="logo-painel" src="/img/fsph_logo.png">'
        document.getElementById('nome-tela').innerHTML = null;
    
    };

    elem = (ID) => { 
        return document.getElementById(ID) 
    };

    opt = (idSelect) => { 
        let select = document.getElementById(idSelect);
        return select.options[select.selectedIndex] 
    };

    rdio = (tagname) => {

        let radioCheck = document.querySelector('input[type="radio"][name="'+ tagname +'"]:checked');
            
        if(radioCheck && radioCheck.value){
            return radioCheck.value;
        }

    };

    Mens = (texto) =>  {

        let modal = document.getElementById('modal-mens');

        openModal(modal);

        document.getElementById('mens').innerHTML = texto
        document.getElementById('mens').classList.add('text-muted')
    
    };

    Confirmar = (texto,acao) =>  {

        let modal = document.getElementById('modal-confirm');

        openModal(modal);

        document.getElementById('mens-conf').innerText = texto
        document.getElementById('mens-conf').classList.add('text-muted')

        let btn = document.getElementById('btn-acao')

        btn.onclick = () => {
            acao();
        }
    
    };

    Loading = ( texto = null) => {

        openModal(elem('modal-loading'))

        if (texto == null) {
            texto = 'Aguarde, carregando ....'
        }

        elem('img-loading').src = "assets/img/Loading.gif";
        elem('msg-loading').innerHTML = texto;

    };

    /************************************************************************
    | MODAL SCRIPTS
    *************************************************************************/
    openModal = (modal) => {
  
        document.body.style.overflow = "hidden";
      
        modal.setAttribute("data-open",true);
      
        /*let overlay = document.createElement("div");
      
        overlay.id = "modal-overlay";
      
        document.body.appendChild(overlay);*/
      
    };
    
    closeModal = (modalID) => {
    
        let modal = document.getElementById(modalID);

        document.body.style.overflow = "auto";
    
        modal.removeAttribute("data-open");
    
        //document.body.removeChild(document.getElementById("modal-overlay"));
    
    };

    ValidarEmail = (email) => {
    
        var emailFilter=/^.+@.+\..{2,}$/;
        var illegalChars= /[\(\)\<\>\,\;\:\\\/\"\[\]]/;
            
        if(!emailFilter.test(email)||email.match(illegalChars)){
            return false
        }
        else{
            return true
        }
    };

    ValidarCPF = (cpf) => {

        var Soma = 0
        var Resto
      
        var strCPF = String(cpf).replace(/[^\d]/g, '')
      
        if (strCPF.length !== 11){return false}
      
        if ([ '00000000000',
              '11111111111',
              '22222222222',
              '33333333333',
              '44444444444',
              '55555555555',
              '66666666666',
              '77777777777',
              '88888888888',
              '99999999999',
            ].indexOf(strCPF) !== -1) {return false}
      
        for (i=1; i<=9; i++) {
          Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
        }
      
        Resto = (Soma * 10) % 11
      
        if ((Resto == 10) || (Resto == 11)) {Resto = 0}
      
        if (Resto != parseInt(strCPF.substring(9, 10)) ) {return false}
      
        Soma = 0
      
        for (i = 1; i <= 10; i++) {
          Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)
        }
      
        Resto = (Soma * 10) % 11
      
        if ((Resto == 10) || (Resto == 11)) { Resto = 0}
      
        if (Resto != parseInt(strCPF.substring(10, 11) )) { return false }
      
        return true
    }

    FormatDateMySQL = (data) => {

        data = data.split('-');
        
        let ano = data[0];
        let mes = data[1];
        let dia = data[2];
        
        if (dia.length == 1) {
            dia = '0' + dia;
        }

        if (mes.length == 1) {
            mes = '0' + mes;
        }

        data = ano + '-' + mes + '-' + dia;

        return data;
        
    };

    DataHora = () => {

        const data = new Date();

        let ano = data.getFullYear();
        let mes = (data.getMonth() + 1).toString().length < 2 ? "0" + (data.getMonth() + 1).toString() : (data.getMonth() + 1).toString()
        let dia = data.getDate().toString().length < 2 ? "0" + data.getDate().toString() : data.getDate().toString()
        let hora = data.getHours().toString().length < 2 ? "0" + data.getHours().toString() : data.getHours().toString()
        let min = data.getMinutes().toString().length < 2 ? "0" + data.getMinutes().toString() : data.getMinutes().toString()
        let seg = data.getSeconds().toString().length < 2 ? "0" + data.getSeconds().toString() : data.getSeconds().toString()

        if (dia.length == 1) {
            dia = '0' + dia;
        }

        if (mes.length == 1) {
            mes = '0' + mes;
        }

        return dia + '-' + mes + '-' + ano + ' ' + hora + ':' + min + ':' + seg;

    };

    SendDataController = async (Rota,Dados = {},Method = 'GET',actionCallBack = null) => {

       try {
      
            const dados = JSON.stringify(Dados);
      
            const options = {
                method : Method,
                headers: { 
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store, max-age=0",
                    "Expires": "Thu, 1 Jan 1970 00:00:00 GMT",
                    "Pragma": "no-cache"
                }
            }
        
            if (Method.toUpperCase() == 'POST') {
                options.body = dados;
            }
          
            const response = await fetch(Rota, options);

            const res = await response.json();
        
            if ((response.status >= 200 && response.status <= 300 ) && actionCallBack !== null ) {
                await actionCallBack(res);
            } else {
                throw new Error(res.msg);
                Mens(res.msg)
            }
      
        }
       catch (error) {
          Mens(error.stack + ' teste');
       }
      
    };

    ValidarCNPJ = (cnpj) => {

        var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
        var c = String(cnpj).replace(/[^\d]/g, '')
        
        if(c.length !== 14)
            return false
    
        if(/0{14}/.test(c))
            return false
    
        for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
        if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false
    
        for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
        if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
            return false
    
        return true
    };

    UploadFiles = async (Rota, Dados = {}, acCallBack = null) => {

        try {
      
            const options = {
              method : 'POST',
              body: Dados
            }
        
            const response = await fetch(Rota, options);
        
            const res = await response.json();

            if (response.status == 200  &&  acCallBack !== null ) {
                acCallBack(res);       
            }
            else {
                Mens(res.msg);
            }
        
        }
        catch (error) {
            alert('Avisos : '+ error);
        }

    }

    function mascara_cpf(i){
   
        var v = i.value;
        
        if(isNaN(v[v.length-1])){ // impede entrar outro caractere que não seja número
           i.value = v.substring(0, v.length-1);
           return;
        }
        
        i.setAttribute("maxlength", "14");
        if (v.length == 3 || v.length == 7) i.value += ".";
        if (v.length == 11) i.value += "-";
     
    }

    function formatar_cpf(cpf) {
        var value = cpf;
        var cpfPattern = value.replace(/\D/g, '') // Remove qualquer coisa que não seja número
						.replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o terceiro dígito
						.replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o sexto dígito
						.replace(/(\d{3})(\d)/, '$1-$2') // Adiciona traço após o nono dígito
						.replace(/(-\d{2})\d+?$/, '$1'); // Impede entrada de mais de 11 dígitos
        return cpfPattern;
    }

    function cfgResolucao() {

        let resolucoes = ['1920x1080','1760x990','1680x1050','1600x900'];
        let resolucao = window.screen.width +'x'+ window.screen.height;
        
        if (resolucao == resolucoes[0]) {
            return 22
        } else if (resolucao == resolucoes[1]) {
            return 19
        }
        else if (resolucao == resolucoes[2]) {
            return 21
        }
        else if (resolucao == resolucoes[3]) {
            return 17
        } else {
            if (window.screen.height > 1080) return 25;
            if (window.screen.height <= 900) return 16;
        }

    }

    