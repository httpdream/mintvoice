$(() => {
  $("#submit").click(() => {
    let data = $("#write_notice").serializeArray();
    data = data.concat({
      name: "content",
      value: CKEDITOR.instances.editor.getData()
    });
    $.ajax({
      url: `/board/notice`,
      type: "POST",
      data: data,
      json: true,
      success: response => {
        if (response.message === "success") {
          location.href = "/board/notice"
        }
        else {
          alert(response.message);
        }
      }
    });
  });
})