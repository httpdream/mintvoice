$(() => {
  $("#submit").click(() => {
    let data = $("#write_audition").serializeArray();
    data = data.concat({
      name: "content",
      value: CKEDITOR.instances.editor.getData()
    });
    $.ajax({
      url: `/board/audition`,
      type: "POST",
      data: data,
      json: true,
      success: response => {
        if (response.message === "success") {
          location.href = "/board/audition"
        }
        else {
          alert(response.message);
        }
      }
    });
  });
})