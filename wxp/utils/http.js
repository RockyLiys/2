/*
  封装 http 请求
*/

(function (root) {
  var http = {};
  http.VERSION = "js0.0.1";
  var EmptyConstructor = function () { };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = http;
    }
    exports.http = http;
  } else {
    root.http = http;
  }

  /*
    设置一些全局变量
  */
  http.Host = "https://shenguotech.cn:8443";
  http.Header = {
    'content-type': 'application/json', // 默认值
  }
  http.tmpT = "ss"

  /*
    组装url
  */
  http._url = function(uri){
    return http.Host + uri;
  }

  /*
    设置请求头
  */
  http._header = function(header){
    if(header == 'undefined'){
      return http.Header;
    }
  }
  /*
    返回结果
  */
  http._resp = function(data){
    this.tmpT = data;
  }
  /*
    请求get
    传入uri
  */
  http._get = function(uri) {
    var that = this;
    var url = http._url(uri);
    var result = "";
    wx.request({
      url: url,
      method: "GET",
      header: http.Header,
      success: res => {
        console.log('get............................');   
        if (res.statusCode == 200) {
          console.log(res);
          that.setData({
            result: res
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  }
  http._post = function(uri, header, data) {
    return "post.....";
  },
  http._delete = function(uri, header) {
    return "delete.....";
  } 

}.call(this));

