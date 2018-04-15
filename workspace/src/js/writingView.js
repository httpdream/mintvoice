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
});
