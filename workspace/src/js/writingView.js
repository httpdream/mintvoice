let boardSrc="#";
let createDate=0;
let responseTitle = 0;
let responseName = 0;

$(document).ready(function(){
  $.ajax({
    url: "/board/" + type + "/view/"+board_id,
    type: "GET",
    dataType: "JSON",
    async:false,
    success: response => {
      console.log(response.item);
      responseTitle = response.item.title;
      responseName = response.item.name;
      createDate = response.item.created_at.substring(5,10);
      $("#viewTitle").html(responseTitle);
      $("#viewWriter").html(responseName);
      $("#viewDate").html(createDate);
      $("#viewMain").html(response.item.content);
    }
  });
  preBoard();
  nextBoard();
  mobileSize();
});

function preBoard(){
  $.ajax({
    url: "/board/" + type + "/view/"+(board_id+1),
    type: "GET",
    dataType: "JSON",
    success: response => {
      console.log(response.item);
      if(!response.item.title){
        $("#viewPre").html("&and;&nbsp;&nbsp;다음 글이 없습니다.");
      }
      else{
        $("#viewPre").append(
          "<a href=\"/board/" + type + "/"+ (board_id+1) + "\">" + response.item.title + "</a>"
        );
      }
    }
  });
}

function nextBoard(){
  $.ajax({
    url: "/board/" + type + "/view/"+(board_id-1),
    type: "GET",
    dataType: "JSON",
    success: response => {
      console.log(response.item);
      if(!response.item.title){
        $("#viewNext").html("&or;&nbsp;&nbsp;이전 글이 없습니다.");
      }
      else{
        $("#viewNext").append(
          "<a href=\"/board/"+ type + "/" + (board_id-1) + "\">" + response.item.title + "</a>"
        )
      }
    }
  });
}

function mobileSize(){
  console.log(responseTitle);
  console.log("view.js ready!");
  if ($(window).width() <= 767){
    console.log("width size ready!");
    $("thead tr th").remove();
    $("thead tr").append(
      "<th colspan=\"5\">"+ responseTitle +"</th><th colspan=\"1\">" + responseName + "</th>"
    );
  }
}

$('#passwordCheck').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget);
  let recipient = button.data('whatever');
  let lang = button.data('lang');
  let modal = $(this);
  console.log(lang);
  if(recipient == "delete"){
    if(lang == "eng"){
      modal.find('.modal-body input').attr("placeholder", "Are you sure you want to delete it?");
    }
    else{
      modal.find('.modal-body input').attr("placeholder", "정말 삭제하시겠습니까?");
    }
  }
  else{
    if(lang == "eng"){
      modal.find('.modal-body input').attr("placeholder", "Enter Password");
    }
    else{
      modal.find('.modal-body input').attr("placeholder", "비밀번호 입력");
    }
  }
});
