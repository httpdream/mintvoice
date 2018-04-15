$(() => {
  $("#write #submit").click(element => {
    let data = $("#write").serializeArray();
    data = data.concat({
      name: "content",
      value: CKEDITOR.instances.editor.getData()
    });
    console.log(data);
    $.ajax({
      url: "/board",
      type: "POST",
      data: data,
      json: true,
      success: response => {
        console.log(response);
      }
    });
  });
})