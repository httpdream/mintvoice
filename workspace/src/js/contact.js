let boardSrc="#";
$(document).ready(function(){
  $.ajax({
    url: "/board/list?type=contact",
    type: "GET",
    dataType: "JSON",
    success: response => {
      response.items.forEach(function(item, index){
        let createDate = item.created_at.substring(0,10);
        $("#tableMain").append(
          "<tr><td><a href=\"" + boardSrc + "\">" + item.name + "</a></td><td>" + item.password + "</td><td>" + createDate + "</td><td>" + item.view + "</td></tr>"
        );
      });
    }
  });
});
