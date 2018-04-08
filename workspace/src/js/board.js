let boardSrc="#";
$(document).ready(function(){
  $.ajax({
    url: "/board/list",
    type: "GET",
    dataType: "JSON",
    success: response => {
      console.log(response);
      console.log(response.items[1].name);
      response.items.forEach(function(item, index){
        let createDate = item.created_at.substring(0,10);
        $("#tableMain").append(
          "<tr><td><a href=\"" + boardSrc + "\">" + item.title + "</a></td><td>MintMedia</td><td>" + createDate + "</td><td>" + item.view + "</td></tr>"
        );
      });
    }
  });
});
