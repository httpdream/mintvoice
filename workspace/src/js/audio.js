// Dependencies:
// https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// https://cdnjs.cloudflare.com/ajax/libs/html5media/1.1.8/html5media.min.js
// https://cdnjs.cloudflare.com/ajax/libs/plyr/2.0.18/plyr.js

// Inspiration: http://jonhall.info/how_to/create_a_playlist_for_html5_audio
// Mythium Archive: https://archive.org/details/mythium/

let audio = "";
let current_page = 1;

function changePage(page) {
    let data = "";
    if (audio == "") {
        data = `offset=${(page-1) * 10}&limit=10`;
    }
    else {
        data = `${audio}&offset=${(page-1) * 10}&limit=10`;
    }
    $.ajax({
        url: "/voice/search?" + data,
        type: "GET",
        json: true,
        success: response => {
            current_page = page;
            setVoiceAudio(response.items, response.count);
        }
    });
}

function setVoiceAudio(voice, count) {
    voice.forEach(function(voice, index){
      voice.original_filename = translateList(voice);
    });
    setPagination(Math.ceil(count / 10), current_page);
    $('#plList li').remove();
    var tracks = voice.map((item, i) => {
        return {
            track: i + 1,
            name: item.original_filename,
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
            $('#plList').append('<li><div class="plItem"><span class="plNum">' + ((current_page - 1)*10 + +trackNumber) + '.</span><span class="plTitle">' + trackName + '</span><span class="plLength">' + trackDuration + '</span></div></li>');
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
                $("#voiceCount").html(response.count);
                setVoiceAudio(response.items, response.count);
            }
        });
    }
}

jQuery(function ($) {
    'use strict'
    getVoices();

    $('#searchButton').click(element => {
        let data = $('#searchForm').serialize() + "&" + $('#feelsForm').serialize();
        audio = data;
        getVoices(data);
    });
});

function translateList(voice){
    console.log(voice);
    let result="";
    let category = voice.filename.substring(voice.filename.indexOf("[") + 1, voice.filename.indexOf("]"));
    let gender = voice.filename.substring(voice.filename.indexOf("]")+2, voice.filename.indexOf("]")+3);
    let checkOctave = voice.filename.substring(voice.filename.indexOf("]")+4).split("_");
    if(checkOctave.length == 2){
      let age = voice.filename.substring(voice.filename.indexOf("]")+4).split("_")[0];
      let feels = voice.filename.substring(voice.filename.indexOf("]")+4, voice.filename.indexOf(".")).split("_")[1];
      result = translate(category, gender, age, feels);
    }
    else{
      let age = voice.filename.substring(voice.filename.indexOf("]")+4).split("_")[0];
      let octave = voice.filename.substring(voice.filename.indexOf("]")+4).split("_")[1];
      let feels = voice.filename.substring(voice.filename.indexOf("]")+4, voice.filename.indexOf(".")).split("_")[2];
      result = translate(category, gender, age, feels, octave);
    }
    return result;
}

function translate(){
  let feelsplit = arguments[3].split(",");
  let feelresult = [];
  let result = "";
  feelsplit.forEach(function(feel, index){
    feelresult.push(moduleTrans(feel, feelsList));
  });
  if(arguments.length == 5){
    result = `[${moduleTrans(arguments[0],categoryList)}]_${moduleTrans(arguments[1],genderList)}_${moduleTrans(arguments[2],ageList)}_${moduleTrans(arguments[4],octaveList)}_${feelresult.join(",")}.mp3`;
  }
  else{
    result = `[${moduleTrans(arguments[0],categoryList)}]_${moduleTrans(arguments[1],genderList)}_${moduleTrans(arguments[2],ageList)}_${feelresult.join(",")}.mp3`;
  }
  return result;
}

let categoryList = {
  "게임" : "Game",
  "애니" : "Animation",
  "교재" : "Book",
  "광고" : "AD",
  "나레이션" : "Narration",
  "외화" : "Foreign",
  "기타" : "ETC"
}

let genderList = {
  "남" : "man",
  "여" : "woman"
}

let ageList = {
  "아역" : "child",
  "청소년" : "youth",
  "성인" : "adult",
  "중년" : "middle-age",
  "노년" : "old-age"
}

let octaveList = {
  "고음" : "highTone",
  "중고음" : "middle-highTone",
  "중음" : "middleTone",
  "중저음" : "middle-lowTone",
  "저음" : "lowTone"
}

let feelsList = {
  "소심" : "fainthearted",
  "당당" : "commanding",
  "야비" : "scurrilous",
  "뚱뚱" : "fat",
  "밝음" : "bright",
  "친절" : "kind",
  "나긋" : "well-rounded",
  "음침" : "dismal",
  "사악" : "wicked",
  "능글" : "stiff",
  "강함" : "strong",
  "거침" : "rough",
  "코믹" : "comical",
  "익살" : "Frivolous",
  "냉정" : "cool",
  "괴물" : "monster",
  "자상" : "caring",
  "광기" : "mad",
  "유약" : "glazed",
  "차분" : "tranquil",
  "슬픔" : "sad",
  "분노" : "angry",
  "느끼" : "oily",
  "여유" : "affordable",
  "활발" : "active",
  "푸근" : "warm",
  "듬직" : "decent",
  "강직" : "upright",
  "거만" : "arrogent",
  "터프" : "tough",
  "긴장" : "nervous",
  "멍청" : "stupid",
  "어두움" : "dark",
  "겁쟁이" : "coward",
  "히스테릭" : "hysteric"
}

function moduleTrans(target, list){
  for(let key in list) {
    if(key == target){
          target = list[key];
          continue;
    }
  }
  return target;
}

// initialize plyr
plyr.setup($('#audio1'), {});
