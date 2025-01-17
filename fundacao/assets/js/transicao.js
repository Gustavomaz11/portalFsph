let agendamentoDoacaoIndividual = document.querySelector('#agendamentoDoacaoIndividual');
let agendamentoCampanha = document.querySelector('#agendamentoCampanha');
let slideImage = document.querySelector('#slideImage');

function transicao() {
  if (slideImage.classList.contains('alterarPosicaoImagem')) {
    slideImage.classList.remove('alterarPosicaoImagem');
    slideImage.classList.add('voltarPosicaoImagem');
    agendamentoCampanha.style.display = 'none';
    agendamentoDoacaoIndividual.style.display = 'flex';
    slideImage.src = 'assets/img/gallery/womanDonate.svg'


  } else {
    slideImage.classList.remove('voltarPosicaoImagem');
    slideImage.classList.add('alterarPosicaoImagem');
    agendamentoCampanha.style.display = 'flex';
    agendamentoDoacaoIndividual.style.display = 'none';
    slideImage.src = 'assets/img/gallery/1.svg'
  }
}
