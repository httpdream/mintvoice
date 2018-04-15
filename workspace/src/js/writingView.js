let boardSrc="#";
let createDate=0;

$(document).ready(function(){
  $.ajax({
    url: "/board/view/"+board_id,
    type: "GET",
    dataType: "JSON",
    success: response => {
      console.log(response.item);
      createDate = response.item.created_at.substring(5,10);
      $("#viewTitle").html(response.item.title);
      $("#viewWriter").html(response.item.name);
      $("#viewDate").html(createDate);
      $("#viewMain").html(response.item.content);
    }
  });
  preBoard();
  nextBoard();
});

function preBoard(){
  $.ajax({
    url: "/board/view/"+(board_id-1),
    type: "GET",
    dataType: "JSON",
    success: response => {
      console.log(response.item);
      if(!response.item.title){
        $("#viewPre").html("&and;&nbsp;&nbsp;이전 글이 없습니다.");
      }
      else{
        $("#viewPre").append(
          "<a href=\"/board/"+ (board_id-1) + "\">" + response.item.title + "</a>"
        );
      }
    }
  });
}

function nextBoard(){
  $.ajax({
    url: "/board/view/"+(board_id+1),
    type: "GET",
    dataType: "JSON",
    success: response => {
      console.log(response.item);
      if(!response.item.title){
        $("#viewNext").html("&or;&nbsp;&nbsp;다음 글이 없습니다.");
      }
      else{
        $("#viewNext").append(
          "<a href=\"/board/"+ (board_id+1) + "\">" + response.item.title + "</a>"
        )
      }
    }
  });
}
