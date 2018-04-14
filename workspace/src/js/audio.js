// Dependencies:
// https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// https://cdnjs.cloudflare.com/ajax/libs/html5media/1.1.8/html5media.min.js
// https://cdnjs.cloudflare.com/ajax/libs/plyr/2.0.18/plyr.js

// Inspiration: http://jonhall.info/how_to/create_a_playlist_for_html5_audio
// Mythium Archive: https://archive.org/details/mythium/
function setVoiceAudio(voice) {
    console.log(voice.map(item => item.id));
    console.log("babo", voice);
    $('#plList li').remove();
    var tracks = voice.map((item, i) => {
        return {
            track: i + 1,
            name: item.filename,
            file: item.filename,
            duration: item.name
        }
    });
    var index = 0,
        playing = false,
        mediaPath = '/voice/',
        extension = '',
        tracks = tracks,
        buildPlaylist = $(tracks).each(function(key, value) {
            var trackNumber = value.track,
                trackName = value.name,
                trackDuration = value.duration;
            if (trackNumber.toString().length === 1) {
                trackNumber = '0' + trackNumber;
            }
            $('#plList').append('<li><div class="plItem"><span class="plNum">' + trackNumber + '.</span><span class="plTitle">' + trackName + '</span><span class="plLength">' + trackDuration + '</span></div></li>');
        }),
        trackCount = tracks.length,
        npAction = $('#npAction'),
        npTitle = $('#npTitle'),
        audio = $('#audio1').on('play', function () {
            playing = true;
            npAction.text('Now Playing...');
        }).on('pause', function () {
            playing = false;
            npAction.text('Paused...');
        }).on('ended', function () {
            npAction.text('Paused...');
            if ((index + 1) < trackCount) {
                index++;
                loadTrack(index);
                audio.play();
            } else {
                audio.pause();
                index = 0;
                loadTrack(index);
            }
        }).get(0),
        btnPrev = $('#btnPrev').on('click', function () {
            if ((index - 1) > -1) {
                index--;
                loadTrack(index);
                if (playing) {
                    audio.play();
                }
            } else {
                audio.pause();
                index = 0;
                loadTrack(index);
            }
        }),
        btnNext = $('#btnNext').on('click', function () {
            if ((index + 1) < trackCount) {
                index++;
                loadTrack(index);
                if (playing) {
                    audio.play();
                }
            } else {
                audio.pause();
                index = 0;
                loadTrack(index);
            }
        }),
        li = $('#plList li').on('click', function () {
            var id = parseInt($(this).index());
            if (id !== index) {
                playTrack(id);
            }
        }),
        loadTrack = function (id) {
            $('.plSel').removeClass('plSel');
            $('#plList li:eq(' + id + ')').addClass('plSel');
            npTitle.text(tracks[id].name);
            index = id;
            audio.src = mediaPath + tracks[id].file;
        },
        playTrack = function (id) {
            loadTrack(id);
            audio.play();
        };
    extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
    loadTrack(index);
}

function getVoices(data = "") {
    var supportsAudio = !!document.createElement('audio').canPlayType;
    if (supportsAudio) {
        $.ajax({
            url: "/voice/search?" + data,
            type: "GET",
            json: true,
            success: response => {
                console.log("/voice/search" + data, response.items);
                setVoiceAudio(response.items);
            }
        });
    }
}

jQuery(function ($) {
    'use strict'
    getVoices();

    $('#searchButton').click(element => {
        let data = $('#searchForm').serialize() + "&" + $('#feelsForm').serialize();
        console.log(data);
        getVoices(data);
    });
});

// initialize plyr
plyr.setup($('#audio1'), {});
