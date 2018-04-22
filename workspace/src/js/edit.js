$(() => {
    $("#submit").click(() => {
      let data = $("#write_contact").serializeArray();
      data = data.concat({
        name: "content",
        value: CKEDITOR.instances.editor.getData()
      });
      data = data.concat({
        name: "password",
        value: password
      });
      $.ajax({
        url: `/board/${type}/${board_id}`,
        type: "PUT",
        data: data,
        json: true,
        success: response => {
          if (response.message === "success") {
            location.href = `/board/${type}/${board_id}`;
          }
          else {
            alert(response.message);
          }
        }
      });
    });
  })