$(document).ready(function() {
  let selectNum = 0;
  $("#modalButton").click(function(){
    selectNum = $('#modalCheckBox:checked').length;
    $("#selectNumber").text(selectNum);
  });
});
