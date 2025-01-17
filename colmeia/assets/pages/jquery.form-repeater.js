$(document).ready(function () {
  'use strict';

  // Inicializa o repeater padrão
  $('.repeater-default').repeater();

  // Inicializa o repeater com opções de exibir/ocultar customizadas
  $('.repeater-custom-show-hide').repeater({
    show: function () {
      $(this).slideDown();
    },
    hide: function (remove) {
      $(remove).slideUp();
    }
  });

  // Adiciona o evento de click no botão Publicar
  $('.btn-success').click(function (e) {
    e.preventDefault();
    swal({
      title: 'Bom Trabalho!',
      text: 'O evento foi publicado com sucesso!',
      type: 'success',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger ml-2',
    })
  });
});