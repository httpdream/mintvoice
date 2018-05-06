let boardSrc="#";
let createDate=0;
let responseTitle = 0;
let responseName = 0;

$(document).ready(function(){
  $.ajax({
    url: `/board/${type}/view/${board_id}?update=true`,
    type: "GET",
    dataType: "JSON",
    async:false,
    success: response => {
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
  if ($(window).width() <= 767){
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
  if(recipient == "delete"){
    modal.find('.modal-content form').unbind("submit");
    modal.find('.modal-content form').submit(removeBoard);
    if(lang == "eng"){
      modal.find('.modal-body input').attr("placeholder", "Are you sure you want to delete it?");
    }
    else{
      modal.find('.modal-body input').attr("placeholder", "정말 삭제하시겠습니까?");
    }
  }
  else{
    modal.find('.modal-content form').unbind("submit");
    modal.find('.modal-content form').submit(editBoard);
    if(lang == "eng"){
      modal.find('.modal-body input').attr("placeholder", "Enter Password");
    }
    else{
      modal.find('.modal-body input').attr("placeholder", "비밀번호 입력");
    }
  }
});

function removeBoard(event) {
  event.preventDefault();
  $.ajax({
    url: `/board/${type}/${board_id}`,
    type: "DELETE",
    dataType: "JSON",
    data: {
      password: $("#passwordCheck input").val()
    },
    success: response => {
      if (response.status === 200) {
        alert("삭제가 완료되었습니다.");
        location.href = `/board/${type}`
      }
      else {
        alert(response.message);
      }
    }
  });
}

function editBoard(event) {
  event.preventDefault();
  $.ajax({
    url: `/board/${type}/${board_id}`,
    type: "PUT",
    dataType: "JSON",
    data: {
      password: $("#passwordCheck input").val()
    },
    success: response => {
      if (response.status === 200) {
        $("#passwordCheck input").val(response.password);
        event.currentTarget.submit();
      }
      else {
        alert(response.message);
      }
    }
  });
}