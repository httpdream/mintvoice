let createDate=0;

let getParameters = function (paramName) {
  // 리턴값을 위한 변수 선언
  let returnValue;

  // 현재 URL 가져오기
  let url = location.href;

  // get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
  let parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

  // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
  for (let i = 0; i < parameters.length; i++) {
      let varName = parameters[i].split('=')[0];
      if (varName.toUpperCase() == paramName.toUpperCase()) {
          returnValue = parameters[i].split('=')[1];
          return decodeURIComponent(returnValue);
      }
  }
};

$(document).ready(function(){
  let params = "";
  let page = 1;
  if (getParameters('page')) {
    page = +getParameters('page');
    params = `?offset=${(page - 1) * 10}&limit=10`;
  }
  $.ajax({
    url: "/board/audition/list" + params,
    type: "GET",
    dataType: "JSON",
    success: response => {
      setPagination(Math.ceil(response.count / 10), page);
      response.items.forEach(function(item, index){
        createDate = item.created_at.substring(5,10);
        $("#tableMain").append(
          "<tr><td><a href=\"/board/audition/" + item.id + "\">" + item.title + "</a></td><td>" + item.name + "</td><td>" + createDate + "</td><td>" + item.view + "</td></tr>"
        );
      });
    }
  });
});
