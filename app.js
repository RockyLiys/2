//app.js
var Bmob = require('wxp/utils/bmob.js')
var host = "bmobcloud.com"//"bmobcloud.com"  // shenguotech.cn:8443
Bmob.initialize("7658aba544d88d3b95405025114ab37b", "20b84fb31710b557d1be1d6ced116a8d", "",host);

App({
  onLaunch: function () {
    var user = new Bmob.User();//开始注册用户
    console.log("user===",user);
    var newOpenid = wx.getStorageSync('openid')
    console.log('newOpenid==', newOpenid);
    console.log(!newOpenid);
    if (!newOpenid) {
      wx.login({
        success: function (res) {
          console.log('login.....', res.code, user);
          user.loginWithWeapp(res.code).then(function (user) {
            var openid = user.get("authData").weapp.openid;
            console.log("openid==",openid);
            console.log(user, 'user', user.id, res);
            console.log(user.get("nickName"));
            if (user.get("nickName")) {
              // 第二次访问
              console.log(user.get("nickName"), 'res.get("nickName")');
              wx.setStorageSync('openid', openid)
            } else {
              //保存用户其他信息
              console.log('saveinfo......');
              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;
                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                  query.get(user.id, {
                    success: function (result) {
                      // 自动绑定之前的账号
                      result.set('nickName', nickName);
                      result.set("userPic", avatarUrl);
                      result.set("openid", openid);
                      result.save();
                    }
                  });
                }
              });
            }
          }, function (err) {
            console.log(err, 'errr');
          });
        }
      });
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('getSetting==', res);
        console.log(res.authSetting['scope.userInfo']);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    childdata:{
      gender:'unknown',
      xingge:'unknown',
      birthday:'2012-1-1',
      region: ['unknown', 'unknown', 'unknown'],
      learninghours:'unknown',
      learningbudget:'unknown',
      fangxiang: 'unknown',
      hobbyclass: ['unknown'],

      objectid:'unknown',
    }
  }
})