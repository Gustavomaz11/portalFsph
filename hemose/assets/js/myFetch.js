document
  .querySelector('#agendamentoDoacaoIndividual')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const dadosFormulario = {
      tp_agenda: 'UNI',
      nome: document.querySelector('#name').value,
      email: document.querySelector('#email').value,
      contato: document.querySelector('#number').value,
      cpf: document.querySelector('#cpf').value,
      dt_agenda: document.querySelector('#date-pick').value,
      hr_agenda: document.querySelector('#time-pick').value,
    };

    await enviarFormulario(dadosFormulario);
  });

document
  .querySelector('#agendamentoCampanha')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const dadosFormulario = {
      tp_agenda: 'CAM',
      nome: document.querySelector('#nameCampanha').value,
      email: document.querySelector('#emailCampanha').value,
      contato: document.querySelector('#numeroCampanha').value,
      qt_pessoas: document.querySelector('#qtdPessoas').value,
      dt_agenda: document.querySelector('#dataCampanha').value,
      turno: document.querySelector('#turno').value,
    };

    await enviarFormulario(dadosFormulario);
  });

async function enviarFormulario(dados) {
  try {
    const url = new URL('http://172.23.42.17:3002/apiagendamento/adicionar');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    const resultado = await response.json();
    if (response.ok) {
      alert('Agendamento realizado com sucesso');
    } else {
      alert(`Erro: ${resultado.message}`);
    }
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}
