$(() => {
  $("#submit").click(() => {
    let data = $("#write_audition").serializeArray();
    data = data.concat({
      name: "content",
      value: CKEDITOR.instances.editor.getData()
    });
    $.ajax({
      url: `/board/${type}`,
      type: "POST",
      data: data,
      json: true,
      success: response => {
        if (response.message === "success") {
          location.href = "/board/${type}"
        }
        else {
          alert(response.message);
        }
      }
    });
  });
})