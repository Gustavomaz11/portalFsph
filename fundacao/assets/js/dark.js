function pegarVariaveisCss() {
  const root = document.documentElement
  const styles = getComputedStyle(root)
  const variaveisCss = {}

  for (let i = 0; i < styles.length; i++) {
    const propriedade = styles[i]
    if(propriedade.startsWith('--')) {
      const valor = styles.getPropertyValue(propriedade).trim()
      variaveisCss[propriedade] = valor
    }
  }
  return variaveisCss
}

function pegarVariavel(valor) {
  const root = document.documentElement
  const styles = getComputedStyle(root)
  return styles.getPropertyValue(valor).trim()
}

function definirVariavel(nome, valor) {
  document.documentElement.style.setProperty(nome, valor)
}

const todasVariaveis = pegarVariaveisCss()
console.log('Variaveis do CSS:' ,todasVariaveis)

const corPrincipal = pegarVariavel('--theme-color')
console.log('Cor principal', corPrincipal)

// definirVariavel('--theme-color', '#000')
let darkOn = false
let darkBtn = document.querySelector('#darkBtn')
let headerContatos = document.querySelector('#headerContatos');

darkBtn.addEventListener('click', (e) => {
  e.preventDefault()
  if (darkOn) {
    // Modo Claro
    let listaVariaveis = [
      '--theme-color',
      '--theme-color2',
      '--title-color',
      '--body-color',
      '--smoke-color',
      '--smoke-color2',
      '--black-color',
      '--gray-color',
      '--white-color',
      '--light-color',
      '--yellow-color',
      '--success-color',
      '--error-color',
      '--th-border-color'
    ]

    let listaNovosValores = [
      '#0a3c79',
      '#1F5FFF',
      '#000D44',
      '#788094',
      '#F5F7FA',
      '#F5F8FD',
      '#000000',
      '#bdbdbd',
      '#ffffff',
      '#bdbdbd',
      '#FFB539',
      '#28a745',
      '#dc3545',
      '#D8DDE1'
    ]
    for (let i = 0; i < listaVariaveis.length; i++) {
      definirVariavel(listaVariaveis[i], listaNovosValores[i])
    }

  } else {
    // Modo Escuro
    let listaVariaveis = [
      '--theme-color',
      '--theme-color2',
      '--title-color',
      '--body-color',
      '--smoke-color',
      '--smoke-color2',
      '--black-color',
      '--gray-color',
      '--white-color',
      '--light-color',
      '--yellow-color',
      '--success-color',
      '--error-color',
      '--th-border-color'
    ]

    let listaNovosValores = [
      '#2c2c2c',
      '#404040',
      '#ffffff',
      '#b3b3b3',
      '#171717',
      '#121212',
      '#000000',
      '#808080',
      '#ffffff',
      '#666666',
      '#d4d4d4',
      '#a3a3a3',
      '#4a4a4a',
      '#333333'
    ]
    for (let i = 0; i < listaVariaveis.length; i++) {
      definirVariavel(listaVariaveis[i], listaNovosValores[i])
    }
    
  }
})


