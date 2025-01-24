Cadastros = () => {

    document.getElementById('hide').classList.replace('invisible','visible');
    document.getElementById('ploter').innerHTML = '<img class="logo-painel" src="/img/fsph_logo.png">'

    LoadPage("/cadastros/","menu");

}

Recepcao = () => {

    document.getElementById('hide').classList.replace('invisible','visible');
    document.getElementById('ploter').innerHTML = '<img class="logo-painel" src="/img/fsph_logo.png">'

    LoadPage("/recepcao/","menu");

}

Ambulatorio = () => {

    document.getElementById('hide').classList.replace('invisible','visible');
    document.getElementById('ploter').innerHTML = '<img class="logo-painel" src="/img/fsph_logo.png">'

    LoadPage("/ambulatorio/","menu");

}

Autenticar = () => {

    let modal = document.getElementById('modal-autentica');

    openModal(modal);

    let login = document.getElementById('login')

    login.style.marginTop = '10em'

    //document.getElementById('tit-modal-upload').innerText = "";
   
    //elem('sel-tipo-arquivo').value = 0;
    //elem('txt-nm-arq').value = null;

}

Login = () => {

    let dados = { 
        usuario: document.getElementById('usuario').value,
        senha: document.getElementById('senha').value
    }
        
    SendDataController('/autentica/autenticar',dados, 'POST', async (res) => {

        if(res.err > 0) {
            Mens(res.msg);
            return
        }

        document.getElementById('ploter').innerHTML = '<img class="logo-painel" src="/img/fsph_logo.png">'

        document.getElementById('modulos').innerHTML = null
       
        await res.menu.map( (modulo) => {

            let btn = `<button class="btn" type="button" id="${modulo.name}" onclick=${modulo.program}>${modulo.name}</button>`;

            document.getElementById('modulos').innerHTML += btn;
           
        });

        closeModal('modal-autentica');

    });
}  
    
Logout = () => {

    document.getElementById('ploter').innerHTML = null;

    LoadPage('/autentica/sair','',() => {

        window.location.replace('/');

    });

}

Cancelar = () => {

    /*tela_impressao = window.open('about:blank','PRINT', 'height=800,width=600');

    tela_impressao.document.write('<p>Teste impressão</p>');
    tela_impressao.window.print();

    setTimeout(() => {tela_impressao.close()},2000)*/

    closeModal('modal-autentica');
    
}

