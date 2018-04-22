$(() => {
  $("#submit").click(() => {
    let data = $("#write_contact").serializeArray();
    data = data.concat({
      name: "content",
      value: CKEDITOR.instances.editor.getData()
    });
    $.ajax({
      url: `/board/contact`,
      type: "POST",
      data: data,
      json: true,
      success: response => {
        if (response.message === "success") {
          location.href = "/board/contact"
        }
        else {
          alert(response.message);
        }
      }
    });
  });
})