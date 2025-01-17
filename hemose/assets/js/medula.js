document
  .querySelector('#agendamentoMedulaOssea')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const dadosFormulario = {
      tp_agenda: 'MDO',
      nome: document.querySelector('#nameMedulaOssea').value,
      email: document.querySelector('#emailMedulaOssea').value,
      contato: document.querySelector('#numberMedulaOssea').value,
      cpf: document.querySelector('#cpfMedulaOssea').value,
      dt_agenda: document.querySelector('#date-pickMedulaOssea').value,
      hr_agenda: document.querySelector('#time-pickMedulaOssea').value,
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
