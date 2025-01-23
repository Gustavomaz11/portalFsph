function pegarVariaveisCss() {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const variaveisCss = {};

  for (let i = 0; i < styles.length; i++) {
    const propriedade = styles[i];
    if (propriedade.startsWith('--')) {
      const valor = styles.getPropertyValue(propriedade).trim();
      variaveisCss[propriedade] = valor;
    }
  }
  return variaveisCss;
}

function pegarVariavel(valor) {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  return styles.getPropertyValue(valor).trim();
}

function definirVariavel(nome, valor) {
  document.documentElement.style.setProperty(nome, valor);
}

const todasVariaveis = pegarVariaveisCss();
console.log('Variaveis do CSS:', todasVariaveis);

const corPrincipal = pegarVariavel('--titulo-sessenaQuatro');
console.log('Fonte Para Titulos', corPrincipal);

let contador = parseInt(localStorage.getItem('fontSize') || 0);
const toggleFontBtn = document.querySelector('#sizeToggle');
const text = document.getElementById('sampleText');

localStorage.setItem('fontSize', contador);
console.log(contador);

if (contador === 0) {
  definirVariavel('--titulo-sessenaQuatro', '64px');
  definirVariavel('--titulo-quarentaOito', '48px');
  definirVariavel('--quarenta-px', '40px');
  definirVariavel('--trinta-seis', '36px');
  definirVariavel('--trinta-quatro', '34px');
  definirVariavel('--trinta-dois', '32px');
  definirVariavel('--trinta-px', '30px');
  definirVariavel('--vinte-oito', '28px');
  definirVariavel('--vinte-seis', '26px');
  definirVariavel('--vinte-quatro', '24px');
  definirVariavel('--vinte-dois', '22px');
  definirVariavel('--vinte-px', '20px');
  definirVariavel('--dezoito-px', '18px');
  definirVariavel('--dezesseis-px', '16px');
} else if (contador === 1) {
  definirVariavel('--titulo-sessenaQuatro', '66px');
  definirVariavel('--titulo-quarentaOito', '50px');
  definirVariavel('--quarenta-px', '42px');
  definirVariavel('--trinta-seis', '38px');
  definirVariavel('--trinta-quatro', '36px');
  definirVariavel('--trinta-dois', '34px');
  definirVariavel('--trinta-px', '32px');
  definirVariavel('--vinte-oito', '30px');
  definirVariavel('--vinte-seis', '28px');
  definirVariavel('--vinte-quatro', '26px');
  definirVariavel('--vinte-dois', '24px');
  definirVariavel('--vinte-px', '22px');
  definirVariavel('--dezoito-px', '20px');
  definirVariavel('--dezesseis-px', '18px');
} else if (contador === 2) {
  definirVariavel('--titulo-sessenaQuatro', '70px');
  definirVariavel('--titulo-quarentaOito', '54px');
  definirVariavel('--quarenta-px', '46px');
  definirVariavel('--trinta-seis', '42px');
  definirVariavel('--trinta-quatro', '40px');
  definirVariavel('--trinta-dois', '38px');
  definirVariavel('--trinta-px', '36px');
  definirVariavel('--vinte-oito', '34px');
  definirVariavel('--vinte-seis', '32px');
  definirVariavel('--vinte-quatro', '30px');
  definirVariavel('--vinte-dois', '28px');
  definirVariavel('--vinte-px', '26px');
  definirVariavel('--dezoito-px', '24px');
  definirVariavel('--dezesseis-px', '22px');
} else if (contador === 3) {
  contador = 0;
  definirVariavel('--titulo-sessenaQuatro', '64px');
  definirVariavel('--titulo-quarentaOito', '48px');
  definirVariavel('--quarenta-px', '40px');
  definirVariavel('--trinta-seis', '36px');
  definirVariavel('--trinta-quatro', '34px');
  definirVariavel('--trinta-dois', '32px');
  definirVariavel('--trinta-px', '30px');
  definirVariavel('--vinte-oito', '28px');
  definirVariavel('--vinte-seis', '26px');
  definirVariavel('--vinte-quatro', '24px');
  definirVariavel('--vinte-dois', '22px');
  definirVariavel('--vinte-px', '20px');
  definirVariavel('--dezoito-px', '18px');
  definirVariavel('--dezesseis-px', '16px');
}

toggleFontBtn.addEventListener('click', (e) => {
  contador = (contador + 1) % 3;
  toggleFontBtn.textContent = `Aa (${contador + 1}/3)`;
  e.preventDefault();
  if (contador === 0) {
    localStorage.setItem('fontSize', contador);
    definirVariavel('--titulo-sessenaQuatro', '64px');
    definirVariavel('--titulo-quarentaOito', '48px');
    definirVariavel('--quarenta-px', '40px');
    definirVariavel('--trinta-seis', '36px');
    definirVariavel('--trinta-quatro', '34px');
    definirVariavel('--trinta-dois', '32px');
    definirVariavel('--trinta-px', '30px');
    definirVariavel('--vinte-oito', '28px');
    definirVariavel('--vinte-seis', '26px');
    definirVariavel('--vinte-quatro', '24px');
    definirVariavel('--vinte-dois', '22px');
    definirVariavel('--vinte-px', '20px');
    definirVariavel('--dezoito-px', '18px');
    definirVariavel('--dezesseis-px', '16px');
  } else if (contador === 1) {
    localStorage.setItem('fontSize', contador);
    definirVariavel('--titulo-sessenaQuatro', '66px');
    definirVariavel('--titulo-quarentaOito', '50px');
    definirVariavel('--quarenta-px', '42px');
    definirVariavel('--trinta-seis', '38px');
    definirVariavel('--trinta-quatro', '36px');
    definirVariavel('--trinta-dois', '34px');
    definirVariavel('--trinta-px', '32px');
    definirVariavel('--vinte-oito', '30px');
    definirVariavel('--vinte-seis', '28px');
    definirVariavel('--vinte-quatro', '26px');
    definirVariavel('--vinte-dois', '24px');
    definirVariavel('--vinte-px', '22px');
    definirVariavel('--dezoito-px', '20px');
    definirVariavel('--dezesseis-px', '18px');
  } else if (contador === 2) {
    localStorage.setItem('fontSize', contador);
    definirVariavel('--titulo-sessenaQuatro', '70px');
    definirVariavel('--titulo-quarentaOito', '54px');
    definirVariavel('--quarenta-px', '46px');
    definirVariavel('--trinta-seis', '42px');
    definirVariavel('--trinta-quatro', '40px');
    definirVariavel('--trinta-dois', '38px');
    definirVariavel('--trinta-px', '36px');
    definirVariavel('--vinte-oito', '34px');
    definirVariavel('--vinte-seis', '32px');
    definirVariavel('--vinte-quatro', '30px');
    definirVariavel('--vinte-dois', '28px');
    definirVariavel('--vinte-px', '26px');
    definirVariavel('--dezoito-px', '24px');
    definirVariavel('--dezesseis-px', '22px');
  } else if (contador === 3) {
    contador = 0;
    localStorage.setItem('fontSize', contador);
    definirVariavel('--titulo-sessenaQuatro', '64px');
    definirVariavel('--titulo-quarentaOito', '48px');
    definirVariavel('--quarenta-px', '40px');
    definirVariavel('--trinta-seis', '36px');
    definirVariavel('--trinta-quatro', '34px');
    definirVariavel('--trinta-dois', '32px');
    definirVariavel('--trinta-px', '30px');
    definirVariavel('--vinte-oito', '28px');
    definirVariavel('--vinte-seis', '26px');
    definirVariavel('--vinte-quatro', '24px');
    definirVariavel('--vinte-dois', '22px');
    definirVariavel('--vinte-px', '20px');
    definirVariavel('--dezoito-px', '18px');
    definirVariavel('--dezesseis-px', '16px');
  }
});
