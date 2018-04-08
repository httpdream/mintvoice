let boardSrc="#";
$(document).ready(function(){
  $.ajax({
    url: "/board/list?type=contact",
    type: "GET",
    dataType: "JSON",
    success: response => {
      response.items.forEach(function(item, index){
        let createDate = item.created_at.substring(5,10);
        $("#tableMain").append(
          "<tr><td><a href=\"" + boardSrc + "\">" + item.title + "</a></td><td>" + item.name + "</td><td>" + createDate + "</td><td>" + item.view + "</td></tr>"
        );
      });
    }
  });
});
