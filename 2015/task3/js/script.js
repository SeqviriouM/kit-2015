jQuery(document).ready(function ($) {

    var context = new (window.AudioContext || window.webkitAudioContext)(),
        analyser = context.createAnalyser(),
        source,
        startOffset = 0,
        startTime = 0,
        buffer,
        title,
        dataArray = [],
        bufferLength,
        drawId;

    var titleSelector = $('.file-information__title');


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
        .on('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            debugger;

            var droppedFiles = e.target.files || e.originalEvent.dataTransfer.files;

            title = droppedFiles[0].name;

            if (title) {
                titleSelector.text(title);
            }

            var reader = new FileReader();

            reader.onload = function(fileEvent) {
              var data = fileEvent.target.result;
              initAudio(data);

              // var currentSong = document.getElementById('current-song');
              // var dv = new jDataView(this.result);

              // // "TAG" starts at byte -128 from EOF.
              // // See http://en.wikipedia.org/wiki/ID3
              // if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
              //   var title = dv.getString(30, dv.tell());
              //   var artist = dv.getString(30, dv.tell());
              //   var album = dv.getString(30, dv.tell());
              //   var year = dv.getString(4, dv.tell());
              //   currentSong.innerHTML = 'Playing ' + title + ' by ' + artist;
              // } else {
              //   // no ID3v1 data found.
              //   currentSong.innerHTML = 'Playing';
              // }

              // options.style.display = 'block';
            };

            reader.readAsArrayBuffer(droppedFiles[0]);
            return false;
        })
        .on('click', function (e) {
            $(this).find('input[type="file"]').trigger('click');
        })

    $('.dropzone input')
        .on('click', function (e) {
            e.stopPropagation();
            // return false;
        })
        .on('change', function (e) {
            e.stopPropagation();
            e.preventDefault();
            debugger;

            var droppedFiles = e.target.files || e.originalEvent.dataTransfer.files;

            var reader = new FileReader();

            reader.onload = function(fileEvent) {
              var data = fileEvent.target.result;
              initAudio(data);

              // var currentSong = document.getElementById('current-song');
              // var dv = new jDataView(this.result);

              // // "TAG" starts at byte -128 from EOF.
              // // See http://en.wikipedia.org/wiki/ID3
              // if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
              //   var title = dv.getString(30, dv.tell());
              //   var artist = dv.getString(30, dv.tell());
              //   var album = dv.getString(30, dv.tell());
              //   var year = dv.getString(4, dv.tell());
              //   currentSong.innerHTML = 'Playing ' + title + ' by ' + artist;
              // } else {
              //   // no ID3v1 data found.
              //   currentSong.innerHTML = 'Playing';
              // }

              // options.style.display = 'block';
            };

            // http://ericbidelman.tumblr.com/post/8343485440/reading-mp3-id3-tags-in-javascript
            // https://github.com/jDataView/jDataView/blob/master/src/jDataView.js

            reader.readAsArrayBuffer(droppedFiles[0]);
            return false;
        });


    $('.controls__play').on('click', play);
    $('.controls__stop').on('click', stop);

    function initAudio(data) {
        // if (source) source.stop(0);

        source = context.createBufferSource();

        if (context.decodeAudioData) {
          context.decodeAudioData(data, function (buffer) {
            source.buffer = buffer;
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

    source.connect(context.destination);
    source.connect(analyser);

    // analyser.fftSize = 2048;
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.3
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.start(0, startOffset % source.buffer.duration || 0);

    // drawWaveForm();

    drawSpectrum();

    // setTimeout(disconnect, source.buffer.duration * 1000 + 1000);
  }

  function play () {
    if (source) {
        try {
            source = context.createBufferSource();
            source.connect(context.destination);
            source.buffer = buffer;
            paused = false;

            startTime = context.currentTime;
            // source.connect(context.destination);
            // Start playback, but make sure we stay in bound of the buffer.
            createAudio(startOffset);
            // source.start(0, startOffset % buffer.duration);
            // draw();
        } catch (e) {

        } 
    }
    
  }

    function stop () {
        if (source) {
            try {
                buffer = source.buffer;
                source.stop(0);
                startOffset += context.currentTime - startTime;
                cancelAnimationFrame(drawId);
            } catch (e) {

            } 
        }
    }

    function drawWaveForm () {
        var canvas = document.querySelector('#visualisation'),
            canvasCtx = canvas.getContext('2d'),
            WIDTH = 480,
            HEIGHT = 320;

        drawId = requestAnimationFrame(drawWaveForm);
        analyser.getByteTimeDomainData(dataArray);

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

    function drawSpectrum () {
        var canvas = document.querySelector('#visualisation'),
            canvasCtx = canvas.getContext('2d'),
            WIDTH = 480,
            HEIGHT = 320;

        drawId = requestAnimationFrame(drawSpectrum);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
            canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

})