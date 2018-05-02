// 非vue文件公用ajax
function getJson(url, param, success, error) {          
    $.ajax({
      type: 'POST',
      url: vars.api + url,
      data: param,
      dataType: 'json',
      beforeSend: function(XMLHttpRequest) {
        // console.log(XMLHttpRequest);
        // XMLHttpRequest.setRequestHeader('token', 111)
      },
      success: function(data) {
        if (typeof success == 'function') {
          success(data);
        } else {
          console.info('send:' + JSON.stringify(param) + '\nto:' + url + '\nreturn:\n' + JSON.stringify(data, null, 4))
        }
      },
      error: function(msg) {
        if (typeof error == 'function') {
          error(msg);
        } else {
          console.error('send:' + JSON.stringify(param) + '\nto:' + url + '\nstatus:' + msg.status + '\nreturn:\n' + JSON.stringify(msg))
        }
      }
    });
  }