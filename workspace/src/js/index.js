$(document).ready(function() {
  $.ajax({
    url: "/count",
    type: "POST",
    dataType: "JSON",
    success: response => {
      console.log(response);
      console.log(response.idcount);
      console.log(response.namecount);
      let countOptions = {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
      };
      let sourceCount = new CountUp('sourceCount', 0, response.idcount, 0, 3, countOptions);
      let sourceUser = new CountUp('sourceUser', 0, response.namecount, 0, 3, countOptions);
      if (!sourceCount.error && !sourceUser.error) {
        sourceCount.start();
        sourceUser.start();
      } else if(sourceCount.error){
        console.error(sourceCount.error);
      } else {
        console.error(sourceUser.error);
      }
    }
  });
});
