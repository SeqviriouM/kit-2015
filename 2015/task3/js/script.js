jQuery(document).ready(function ($) {

    var context,
        analyserNode,
        source,
        gainNode,
        filterNode,
        startOffset = 0,
        startTime = 0,
        buffer,
        title,
        dataArray = [],
        bufferLength,
        drawId,
        drawType = 0, 
        filterType="lowpass";

    /* Элементы управления play/stop */
    var controlsPlay = $('.controls__play'),
        controlsPause = $('.controls__pause'),
        titleSelector = $('.file-information__title');

    /* Проверка на поддержку AudioContext */
    try {
        context = new (window.AudioContext || window.webkitAudioContext)();
        analyserNode = context.createAnalyser();
        gainNode = context.createGain();
        gainNode.gain.value = $('.gain').val();
        filterNode = context.createBiquadFilter();
    } catch (e) {
        alert("Your browser doesn't support AudioContext");
    }

    /* Обработчики на загрузку файла */
    $('.dropzone')
        .on('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        })
        .on('dragleave', function (e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        })
        .on('drop', fileSelectHandler)
        .on('click', function (e) {
            $(this).find('input[type="file"]').trigger('click');
        })

    $('.dropzone input')
        .on('click', function (e) {
            e.stopPropagation();
            // return false;
        })
        .on('change', fileSelectHandler);


    /* Обработчики на элементы управления (play/stop)*/
    $('.controls')
        .on('click', '.controls__play:not(.disabled):not(.active)', function (e) {
            $('.controls__element').removeClass('active');
            $(this).addClass('active');
            playAudio();
        })
        .on('click', '.controls__pause:not(.disabled):not(.active)', function (e) {
            $('.controls__element').removeClass('active');
            $(this).addClass('active');
            pauseAudio();
        })
        .on('click', '.controls__stop:not(.disabled):not(.active)', function (e) {
            $('.controls__element').removeClass('active');
            $(this).addClass('active');
            stopAudio();
        });


    /* Обработчики на изменение настроек */
    $('.gain').on('change', function(e){
        if(!gainNode) return false;

        gainNode.gain.value = $('.gain').val();
    });

    $('.range-f').on('change', function(e){
        if(!filterNode) return false;

        filterNode.frequency.value = $('.range-f').val();
    });

    $('.range-q').on('change', function(e){
        if(!filterNode) return false;

        filterNode.Q.value = $('.range-q').val();
    });

    $('.range-g').on('change', function(e){
        if(!filterNode) return false;

        filterNode.gain.value = $('.range-g').val();
    });

    $('.draw-type').on('change', function(e){
        if (!analyserNode) return false;

        drawType = parseInt($(this).val());
        createAnalyzer();
    });

    $('.filter-type').on('change', function(e){
        if (!filterNode) return false;

        filterType = $(this).val();
        createFilter();
    });

    /* Обработчик на боковое меню */
    $('.sidebar__header').on('click', function (e) {
        $(this).parent().toggleClass('open');  
    }) 

    /* Загрузка выбранного файла*/
    function fileSelectHandler (e) {
        e.stopPropagation();
        e.preventDefault();
        debugger;

        var droppedFiles, reader;

        $('.loading').addClass('show'); // Активация отображения загрузки

        droppedFiles = e.target.files || e.originalEvent.dataTransfer.files; // Получение выбранного файла

        /* Отображение названия исполняемого файла */
        title = droppedFiles[0].name;
        if (title) {
            titleSelector.text(title);
        }

        reader = new FileReader();

        /* Обработчик на успешное прочтение файла */ 
        reader.onload = function(fileEvent) {
          var data = fileEvent.target.result;
          initAudio(data); // Инициализация аудио элемента
        };

        reader.readAsArrayBuffer(droppedFiles[0]); // Чтение файла
        return false;
    }

    function initAudio(data) {
        if (source) {
            try {
                source.stop(0);
            } catch (e) { }
        }
        source = context.createBufferSource(); // Создаем источник

        /* Декодируем ответ */
        if (context.decodeAudioData) {
          context.decodeAudioData(data, function (buffer) {
            source.buffer = buffer; // Подключаем буфер
            createAudio();
          }, function (e) {
            console.error(e);
          });
        } else {
          source.buffer = context.createBuffer(data, false);
          createAudio();
        }
    }


    function createAudio(startOffset) {       
        createAnalyzer(); // Задаем анализатор
        createFilter(); // Задаем фильтр

        /* Подключаем все необходимое */
        source.connect(context.destination);
        source.connect(analyserNode);
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.connect(filterNode);
        filterNode.connect(context.destination);

        /* Активируем контролы */
        enableControls();

        /* Запускаем музыку */
        source.start(0, startOffset % source.buffer.duration || 0);

    }

    /* Функция задания анализатора */
    function createAnalyzer () {
      // Если идет анимация, то отменяем ее
      if (drawId) {
        cancelAnimationFrame(drawId);
      }

      // Задаем настройки анализатора исходя из типа анимации
      if (drawType === 0) {
          analyserNode.fftSize = 2048;
          analyserNode.smoothingTimeConstant = 0.3
          bufferLength = analyserNode.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);

          drawWaveForm(); // Активируем анимацию
      } else {
          analyserNode.fftSize = 256;
          analyserNode.smoothingTimeConstant = 0.3
          bufferLength = analyserNode.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);

          drawSpectrum(); // Активируем анимацию
      }
    }

    /* Функция задания фильтра */
    function createFilter () {
        if (filterNode) {
            filterNode.type = filterType; // тип фильтра
            filterNode.frequency.value = $('.range-f').val(); // частота
            filterNode.Q.value = $('.range-q').val(); // Q-factor
            filterNode.gain.value = $('.range-g').val(); // Gain
        }

    }

    /* Функция зактивация контролов (play/stop) */ 
    function enableControls () {
        $('.controls__element').removeClass('disabled');
        $('.controls__element').removeClass('active');
        $('.loading').removeClass('show');
        $('.controls__play').addClass('active');
    }

    /* Функция запуска аудио файла */ 
    function playAudio () {
      if (source) {
          try {
              source = context.createBufferSource();
              source.connect(context.destination);
              source.buffer = buffer;
              startTime = context.currentTime; // Сохранение текущее время

              createAudio(startOffset);
          } catch (e) {
              alert("Oops, there are some errors, try to reload page");
          } 
      }
      
    }

    /* Функция остановки аудио файла */
    function pauseAudio () {
        if (source) {
            try {
                buffer = source.buffer;
                source.stop(0);
                startOffset += context.currentTime - startTime; // Сохранение проигранного времени
                cancelAnimationFrame(drawId);
            } catch (e) {
                alert("Oops, there are some errors, try to reload page");
            } 
        }
    }

    function stopAudio () {
        if (source) {
            try {
                buffer = source.buffer;
                source.stop(0);
                startOffset = 0; // Сброс проигранного времени
                cancelAnimationFrame(drawId);
            } catch (e) {
                alert("Oops, there are some errors, try to reload page");
            } 
        }
    }

    /* Анимация Waveform */
    function drawWaveForm () {
        var canvas = document.querySelector('#visualisation'),
            canvasCtx = canvas.getContext('2d'),
            WIDTH = 480,
            HEIGHT = 320;

        drawId = requestAnimationFrame(drawWaveForm);
        analyserNode.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    }

    /* Анимация Spectrum */
    function drawSpectrum () {
        var canvas = document.querySelector('#visualisation'),
            canvasCtx = canvas.getContext('2d'),
            WIDTH = 480,
            HEIGHT = 320,
            gradient;

        drawId = requestAnimationFrame(drawSpectrum);
        analyserNode.getByteFrequencyData(dataArray);


        gradient = canvasCtx.createLinearGradient(0,0,0,300);
        gradient.addColorStop(1,'#ff0000');
        gradient.addColorStop(0.75,'#ff0000');
        gradient.addColorStop(0.25,'#ffff00');
        gradient.addColorStop(0,'#ffffff');

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            // canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
            canvasCtx.fillStyle = gradient;
            canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

})