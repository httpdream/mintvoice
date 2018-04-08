$(document).ready(function(){
  $.ajax({
    url: "/board",
    type: "GET",
    dataType: "JSON",
    success: response => {
      console.log(response);
      boardIndex.forEach(function(item, index){
        $("#tableMain").append(
          "<tr><td><a href=\"" + boardSrc + "\">" + boardTitle + "</a></td><td>MintMedia</td><td>" + boardDate + "</td><td>" + boardView + "</td></tr>"
        );
      });
    };
  });
});
