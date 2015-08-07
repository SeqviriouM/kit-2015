window.onload = function(){
    audio_file.onchange = function(){
        var files = this.files;
        var file = URL.createObjectURL(files[0]); 
        audio_player.src = file; 
        audio_player.play();
    };
};

jQuery(document).ready(function ($) {

    var context = new (window.AudioContext || window.webkitAudioContext)(),
        source,
        processor,
        filterLowPass,
        filterHighPass,
        mix,
        mix2;

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
        })
        .on('click', function (e) {
            $(this).find('input[type="file"]').trigger('click');
        })

    $('.dropzone input').on('click', function (e) {
        e.stopPropagation();
        // return false;
    });

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


  function createAudio() {
    // create low-pass filter
    // filterLowPass = context.createBiquadFilter();
    // source.connect(filterLowPass);

    // filterLowPass.type = 'lowpass';
    // filterLowPass.frequency.value = 120;

    // create high-pass filter
    // filterHighPass = context.createBiquadFilter();
    // source.connect(filterHighPass);
    // filterHighPass.type = 'highpass';
    // filterHighPass.frequency.value = 120;

    // create the gain node
    mix = context.createGain();

    mix2 = context.createGain();
    source.connect(mix2);
    mix2.connect(context.destination);

    mix.gain.value = 1;
    mix2.gain.value = 0;

    // create the processor
    processor = context.createScriptProcessor(2048 /*bufferSize*/ , 2 /*num inputs*/ , 1 /*num outputs*/);

    // connect everything
    // filterHighPass.connect(processor);
    // filterLowPass.connect(mix);
    processor.connect(mix);
    mix.connect(context.destination);

    // connect with the karaoke filter
    // processor.onaudioprocess = karaoke;

    source.connect(context.destination);
    // playback the sound
    source.start(0);

    // setTimeout(disconnect, source.buffer.duration * 1000 + 1000);
  }

})