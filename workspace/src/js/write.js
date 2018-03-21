$(() => {
  $("#write #submit").click(element => {
    console.log($("#write").serializeArray());
    $.ajax({
      url: "/board",
      type: "POST",
      data: $("#write").serializeArray(),
      json: true,
      success: response => {
        console.log(response);
      }
    });
  });
})