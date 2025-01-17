window.onload = function () {
  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var dataX = document.getElementById('dataX');
  var dataY = document.getElementById('dataY');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  var dataRotate = document.getElementById('dataRotate');
  var dataScaleX = document.getElementById('dataScaleX');
  var dataScaleY = document.getElementById('dataScaleY');
  var regEx = /:|;/;
  var img1 = $('#img-1');
  var img2 = $('#img-2');
  var img3 = $('#img-3');

  var options = {
    aspectRatio: 16 / 9,
    preview: '.preview',
    ready: function (e) {},
    cropstart: function (e) {},
    cropmove: function (e) {},
    cropend: function (e) {},
    crop: function (e) {
      var data = e.detail;
      dataX.value = Math.round(data.x);
      dataY.value = Math.round(data.y);
      dataHeight.value = Math.round(data.height);
      dataWidth.value = Math.round(data.width);
      dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
      dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
      dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
    },
    zoom: function (e) {},
  };
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;
  var uploadedImageType = 'image/jpeg';
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageURL;

  function changeImg(fileType, srcImg) {
    fileType = fileType.replace('-', '');
    let reg = new RegExp('^(image|application)/w+', '');
    if (!reg.test(fileType)) {
      image.src = srcImg;

      if (cropper) {
        cropper.destroy();
      }

      cropper = new Cropper(image, options);
      inputImage.value = null;
    } else {
      window.alert('Imagem não pode ser cortada');
    }
  }

  $('#img-1').on('click', function () {
    var srcImg1 = $('#img-1')[0].src;
    $('#img-1').addClass('clicked');
    $('#img-2').removeClass('clicked');
    $('#img-3').removeClass('clicked');

    changeImg(srcImg1.split(regEx)[1], srcImg1);
  });

  $('#img-2').on('click', function () {
    var srcImg2 = $('#img-2')[0].src;
    $('#img-2').addClass('clicked');
    $('#img-1').removeClass('clicked');
    $('#img-3').removeClass('clicked');
    changeImg(srcImg2.split(regEx)[1], srcImg2);
  });

  $('#img-3').on('click', function () {
    var srcImg3 = $('#img-3')[0].src;
    $('#img-3').addClass('clicked');
    $('#img-1').removeClass('clicked');
    $('#img-2').removeClass('clicked');
    changeImg(srcImg3.split(regEx)[1], srcImg3);
  });

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (
    typeof document.createElement('cropper').style.transition === 'undefined'
  ) {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Download
  if (typeof download.download === 'undefined') {
    download.className += ' disabled';
    download.title = 'Your browser does not support download';
  }

  // Options
  actions.querySelector('.docs-toggles').onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropBoxData;
    var canvasData;
    var isCheckbox;
    var isRadio;

    if (!cropper) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }

    isCheckbox = target.type === 'checkbox';
    isRadio = target.type === 'radio';

    if (isCheckbox || isRadio) {
      if (isCheckbox) {
        options[target.name] = target.checked;
        cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();

        options.ready = function () {
          console.log('ready');
          cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
        };
      } else {
        options[target.name] = target.value;
        options.ready = function () {
          console.log('ready');
        };
      }

      // Restart
      cropper.destroy();
      img1[0].src = '';
      img2[0].src = '';
      img3[0].src = '';
      $('#img-1').removeClass('usedPreview');
      $('#img-2').removeClass('usedPreview');
      $('#img-3').removeClass('usedPreview');
      console.log('cropper');
      cropper = new Cropper(image, options);
    }
  };

  // Methods
  actions.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropped;
    var result;
    var input;
    var data;

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (
      target === this ||
      target.disabled ||
      target.className.indexOf('disabled') > -1
    ) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option') || undefined,
      secondOption: target.getAttribute('data-second-option') || undefined,
    };

    cropped = cropper.cropped;

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.clear();
          }

          break;

        case 'getCroppedCanvas':
          try {
            data.option = JSON.parse(data.option);
          } catch (e) {
            console.log(e.message);
          }

          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = cropper[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.crop();
          }

          break;

        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal

            if (!download?.disabled) {
              download.download = uploadedImageName;
              download.href = result.toDataURL(uploadedImageType);

              if ($('#img-1').hasClass('clicked')) {
                img1[0].src = download.href;
                $('#img-1').removeClass('clicked');
                return;
              } else if ($('#img-2').hasClass('clicked')) {
                img2[0].src = download.href;
                $('#img-2').removeClass('clicked');
                return;
              } else if ($('#img-3').hasClass('clicked')) {
                img3[0].src = download.href;
                $('#img-3').removeClass('clicked');
                return;
              }

              if (!$('#img-1').hasClass('usedPreview')) {
                img1[0].src = download.href;
                $('#img-1').addClass('usedPreview');
              } else if (!$('#img-2').hasClass('usedPreview')) {
                img2[0].src = download.href;
                $('#img-2').addClass('usedPreview');
              } else {
                img3[0].src = download.href;
                $('#img-3').addClass('usedPreview');
              }
            }
          }

          break;
        case 'clear':
          $('.clicked').removeClass('usedPreview');
          $('.clicked')[0].src = '';

          break;

        case 'destroy':
          cropper = null;

          img1[0].src = '';
          img2[0].src = '';
          img3[0].src = '';
          $('#img-1').removeClass('usedPreview');
          $('#img-2').removeClass('usedPreview');
          $('#img-3').removeClass('usedPreview');

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            image.src = originalImageURL;
          }

          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  };

  document.body.onkeydown = function (event) {
    var e = event || window.event;

    if (e.target !== this || !cropper || this.scrollTop > 300) {
      return;
    }

    switch (e.keyCode) {
      case 37:
        e.preventDefault();
        cropper.move(-1, 0);
        break;

      case 38:
        e.preventDefault();
        cropper.move(0, -1);
        break;

      case 39:
        e.preventDefault();
        cropper.move(1, 0);
        break;

      case 40:
        e.preventDefault();
        cropper.move(0, 1);
        break;
    }
  };

  // Import image
  var inputImage = document.getElementById('inputImage');

  if (URL) {
    inputImage.onchange = function () {
      var files = this.files;
      var file;

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          uploadedImageType = file.type;
          uploadedImageName = file.name;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          image.src = uploadedImageURL = URL.createObjectURL(file);

          if (cropper) {
            cropper.destroy();
          }

          cropper = new Cropper(image, options);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
          console.log('dhsshdashjdjsadash');
        }
      }
    };
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  }
};
