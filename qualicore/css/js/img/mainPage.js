const btnMenu = document.querySelector('#btnMenu')
btnMenu.addEventListener('click',()=>{
    document.querySelector('main').style = "display:none;"
    document.querySelector('aside').classList.add('openMenu')
})

const btnCloneMenu = document.querySelector('#btnCloneMenu')
btnCloneMenu.addEventListener('click',()=>{
    document.querySelector('aside').classList.remove('openMenu')
    document.querySelector('main').style = 'display: block;'
})

const cxEntradaBtn = document.querySelector('#cxEntradaBtn')

let lengthRnc = localStorage.getItem('lengthRnc')
if(lengthRnc != null)
    lengthRnc = JSON.parse(lengthRnc)

function showName (nomeCompleto){
    while (nomeCompleto.length > 13) {
        const partes = nomeCompleto.trim().split(" ")
        if (partes.length > 1) {
            partes.pop()
            nomeCompleto = partes.join(" ")
            if(partes[partes.length-1].length <= 2){
                partes.pop()
                nomeCompleto = partes.join(" ")
            }
        } else {
          nomeCompleto = nomeCompleto.substring(0, 13)
          break
        }
      }
      return nomeCompleto
}

// pegando usuario
let user = localStorage.getItem('login')
if(user != null)
    user = JSON.parse(user)

if(user == null)
    window.location.href = 'index.html';

if(user.permissao == "User")
    window.location.href = 'monitoramento.html';

const nome = document.querySelector('#nome')
nome.innerText = user.nome?showName(user.nome):'xxxx'

const iconPesoa = document.querySelector('#iconPesoa')
const imgPerfil = document.querySelector(".imgPerfil")

if(user.perfil){
    iconPesoa.style = 'display:none;'
    imgPerfil.style = 'display:block;'
    imgPerfil.src = user.perfil.path
}

if(user.permissao == 'User'){
    dashBtn.style = 'display:none;'
    dashBtn.disabled = true

    relatorioBtn.style = 'display:none;'
    relatorioBtn.disabled = true

    departamentoBtn.style = 'display:none;'
    departamentoBtn.disabled = true

    usuariosBtn.style = 'display:none;'
    usuariosBtn.disabled = true
}else if(user.permissao == 'Gerente' || user.permissao == 'Controlador'){
    departamentoBtn.style = 'display:none;'
    departamentoBtn.disabled = true

    usuariosBtn.style = 'display:none;'
    usuariosBtn.disabled = true
}

async function handleGetMyCarLetter (){
    try {
        const novaMenssagemJson = await fetch(`http://172.23.42.17:3333/menssagem/msgNova/${user._id}`)
        const novaMenssagem = await novaMenssagemJson.json()
        notificacaoNovaMsg(novaMenssagem)
    } catch (error) {
        console.log(error)
    } finally {
        // setInterval(handleGetMyCarLetter,30000)
    }
}

handleGetMyCarLetter()
// função que deixa a cor da carta laranja caso tenha alguam msg não vista
function notificacaoNovaMsg (novaMsg){
    if(novaMsg){
        cxEntradaBtn.classList.add('novaMenssagem')
    }else{
        cxEntradaBtn.classList.remove('novaMenssagem')
    }
}

async function handleGetRnc (){
    try {
        const rncJson = await fetch(`http://172.23.42.17:3333/rnc/${user._id}`)
        const rnc = await rncJson.json()
        return rnc
    } catch (error) {
        console.log(error)
    }
}

async function handleGetDepartamento (){
    try {
        const departamentoJson = await fetch('http://172.23.42.17:3333/departamento')
        const departamento = await departamentoJson.json()
        return departamento
    } catch (error) {
        console.log(error)
    }
}

async function handleGetRncConcluidas (){
    try {
        const concluidasJson = await fetch(`http://172.23.42.17:3333/rncConcluidas/${user._id}`)
        const concluidas = await concluidasJson.json()
        return concluidas
    } catch (error) {
        console.log(error)
    }
}

// pegando funcionarios
let funcionarios = localStorage.getItem('funcionarios')
if(funcionarios != null)
    funcionarios = JSON.parse(funcionarios)

// função que deixa a cor da carta laranja caso tenha alguam msg não vista

document.addEventListener('DOMContentLoaded',async function() {
    const botaoPerfil = document.getElementById('botaoPerfil');
    const menuPerfil = document.getElementById('menuPerfil');
    const modal = document.querySelector(".modalPerfil");
    const btn = document.getElementById("meuPerfilBtn");
    const closeBtn = document.querySelector(".fecharModal");
    
    const dashBtn = document.querySelector('#dashBtn')
    const relatorioBtn = document.querySelector('#relatorioBtn')
    const rncBtn = document.querySelector('#rncBtn')
    const monitoramentoBtn = document.querySelector('#monitoramentoBtn')
    const departamentoBtn = document.querySelector('#departamentoBtn')
    const usuariosBtn = document.querySelector('#usuariosBtn')
    const cxEntradaBtn = document.querySelector('#cxEntradaBtn')
    const meuPerfilBtn = document.querySelector('#meuPerfilBtn')

    const rnc =await handleGetRnc()
    const concluidas =await handleGetRncConcluidas()
    const departamentos = await handleGetDepartamento()
    const todasRnc = [...rnc,...concluidas]

    const listaSidebarBtn = [dashBtn, relatorioBtn, rncBtn, monitoramentoBtn, departamentoBtn, usuariosBtn, cxEntradaBtn, meuPerfilBtn]
    const urlSidebar = [
        'homePage.html',
        'relatorioQualidade.html',
        'abrirRnc.html',
        'monitoramento.html',
        'departamentos.html',
        'usuarios.html',
        'cxEntrada.html',
        'meuPerfil.html'
    ]

    for(let i = 0; i < listaSidebarBtn.length; i++) {
        listaSidebarBtn[i].addEventListener('click', () => {
            window.location.href = urlSidebar[i]
        })
    }

    btn.addEventListener('click', () => {
        modal.classList.add("show");
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove("show");
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove("show");
            document.body.style.overflow = 'auto';
        }
    });

    botaoPerfil.addEventListener('click', function(event) {
        event.stopPropagation();
        menuPerfil.classList.toggle('ativo');
    });

    document.addEventListener('click', function(event) {
        if (!menuPerfil.contains(event.target) && !botaoPerfil.contains(event.target)) {
            menuPerfil.classList.remove('ativo');
        }
    });

    // Função para gerar cores com base no índice
    function generateColors(index) {
        const hue = (index * 137.5) % 360;
        return `hsl(${hue}, 70%, 60%)`;
    }

    // Configuração comum para os gráficos
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 12
                    },
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    family: "'Roboto', sans-serif",
                    size: 14
                },
                bodyFont: {
                    family: "'Roboto', sans-serif",
                    size: 12
                },
                cornerRadius: 8,
                padding: 12
            },
            datalabels: {
                color: 'white',
                anchor: 'end',
                align: 'end',
                formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(2) + '%';
                    return percentage;
                }
            }
        }
    };

    // Gráfico de barras
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    // let labels

    const labels = []
    const data = Array.from({length:departamentos.length},()=> 0)
    departamentos.map((currentDepartamentos)=>{
        labels.push(`${showName(currentDepartamentos.nome)} - ${currentDepartamentos.sigla}`)
    })
    todasRnc.map((currentRnc)=>{
        const index = labels.findIndex(departamentos => departamentos.includes(currentRnc.criador.departamento.sigla))
        data[index]+=1
    })

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Não Conformidades Detectadas por Setor',
                data: data,
                backgroundColor: labels.map((_, index) => generateColors(index)),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Índice de Não Conformidades Abertas por Setor',
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
    });
    

    // Gráfico de rosca
    const ctxRosca = document.getElementById('meuGraficoRosca').getContext('2d');
    const labelsRosca = ['Em aberto', 'Resolvido'];
    const dataRosca = [rnc.length, concluidas.length];
    
    new Chart(ctxRosca, {
        type: 'doughnut',
        data: {
            labels: labelsRosca,
            datasets: [{
                label: 'Registros de Não Conformidades abertas',
                data: dataRosca,
                backgroundColor: labelsRosca.map((_, index) => generateColors(index)),
                borderColor: 'white',
                borderWidth: 2,
            }]
        },
        options: {
            ...commonOptions,
            cutout: '60%',
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Índice das Não Conformidades Resolvidas e Pendentes',
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });

    // Gráfico de linhas
    const ctxLinhas = document.getElementById('meuGraficoLinhas').getContext('2d');
    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ]
    const date = new Date()
    const mes = date.getMonth()+1
    const labelsLinhas = meses.slice(0,mes)
    const dataLinhas = Array.from({length:mes+1},()=> 0)
    concluidas.map((currentRnc)=>{
        let indexMesRnc = Number(currentRnc.data.split("/")[1])-1
        dataLinhas[indexMesRnc]+= 1
    })
    
    new Chart(ctxLinhas, {
        type: 'line',
        data: {
            labels: labelsLinhas,
            datasets: [{
                label: 'Tratamento das Não Conformidades',
                data: dataLinhas,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Tratamento das Não Conformidades',
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
    });


    const ctxBar = document.getElementById('meuGraficoBar').getContext('2d');

    // Defina as categorias e dados correspondentes
    const objDataBar = [
        {
            nome:"Processos / Insumos",
            qtn:0
        },
        {
            nome:"Auditoria Externa",
            qtn:0
        },
        {
            nome:"Análise Crítica do Sistema",
            qtn:0
        },
        {
            nome:"Reclamação de Cliente",
            qtn:0
        },
        {
            nome:"Produto não Conforme",
            qtn:0
        },
        {
            nome:"Acidente / Incidente",
            qtn:0
        },
        {
            nome:"Oportunidade de Melhoria",
            qtn:0
        },
        {
            nome:"Auditoria Interna",
            qtn:0
        }
    ]
    const labelsBar = [];
    const dataBar = []; // Dados de não conformidades

    todasRnc.map((currentRnc)=>{
        objDataBar.map((dataBarObj)=>{
            labelsBar.push(showName(dataBarObj.nome))
            if(currentRnc.origem == dataBarObj.nome){
                dataBarObj.qtn+= 1
            }
        })
    })

    objDataBar.forEach((currentdataBar)=>{
        dataBar.push(currentdataBar.qtn)
    })

    new Chart(ctxBar, {
        type: 'bar', // Mudei para 'bar'
        data: {
            labels: labelsBar,
            datasets: [{
                label: 'Não Conformidades por Categoria',
                data: dataBar,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
                hoverBorderColor: 'rgba(75, 192, 192, 1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Categorias',
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Número de Não Conformidades',
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição de Não Conformidades por Categoria',
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });


    const ctxArea = document.getElementById('meuGraficoArea').getContext('2d');
    // const labelsArea = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
    // const dataArea = [2, 4, 6, 5, 8, 10];

    const labelsArea = meses.slice(0,mes)
    const dataArea = Array.from({length:mes+1},()=> 0)
    todasRnc.map((currentRnc)=>{
        let indexMesRnc = Number(currentRnc.data.split("/")[1])-1
        if(currentRnc.status == "concluido"){
            dataArea[indexMesRnc]+= 1
        }else{
            dataArea[indexMesRnc]-= 1
        }
    })

    // Usar a função generateColors para cada parte do gráfico
    const backgroundColors = labelsArea.map((_, index) => generateColors(index));

    new Chart(ctxArea, {
        type: 'polarArea',
        data: {
            labels: labelsArea,
            datasets: [{
                label: 'Acúmulo de Não Conformidades',
                data: dataArea,
                backgroundColor: backgroundColors, // Cores diferentes para cada parte
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Índice de Eficácia das Não Conformidades',
                    font: {
                        size: 20,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        display: true
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });

    const ctxMisto = document.getElementById('meuGraficoMisto').getContext('2d');

    const labelsMisto = meses.slice(0,mes)
    
    const objMisto = [
        { nome: "Janeiro", valorTotal: 0, quantidade: 0 },
        { nome: "Fevereiro", valorTotal: 0, quantidade: 0 },
        { nome: "Março", valorTotal: 0, quantidade: 0 },
        { nome: "Abril", valorTotal: 0, quantidade: 0 },
        { nome: "Maio", valorTotal: 0, quantidade: 0 },
        { nome: "Junho", valorTotal: 0, quantidade: 0 },
        { nome: "Julho", valorTotal: 0, quantidade: 0 },
        { nome: "Agosto", valorTotal: 0, quantidade: 0 },
        { nome: "Setembro", valorTotal: 0, quantidade: 0 },
        { nome: "Outubro", valorTotal: 0, quantidade: 0 },
        { nome: "Novembro", valorTotal: 0, quantidade: 0 },
        { nome: "Dezembro", valorTotal: 0, quantidade: 0 }
      ];
    const dataMisto = Array.from({length:mes},()=> 0)
    concluidas.forEach((rncConcluida)=>{
        let mes = Number(rncConcluida.data.split("/")[1])-1
        objMisto[mes].valorTotal+= 1
        objMisto[mes].quantidade+= quantidadeDeDias(rncConcluida.data, rncConcluida.dataConclusao)
    })

    objMisto.forEach((mistoMes,index)=>{
        if(mistoMes.valorTotal != 0)
            dataMisto[index] = mistoMes.quantidade / mistoMes.valorTotal
    })

    function quantidadeDeDias(dataInit, dataFinal){
        dataInit = Number(dataInit.split('/').reverse().join(''))
        dataFinal = Number(dataFinal.split('/').reverse().join(''))
        return dataFinal - dataInit
    }

    new Chart(ctxMisto, {
        type: 'line',
        data: {
            labels: labelsMisto,
            datasets: [{
                label: 'Tempo medio de reolução da não conformidade',
                data: dataMisto,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: 'Tempo medio de solução da não conformidade',
                    font: {
                        family: "'Roboto', sans-serif",
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            }
        }
    });
    


});



