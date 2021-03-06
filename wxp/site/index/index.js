//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var http = require('../../utils/http.js');
const app = getApp();
var that;
Page({
  data: {
    userInfo: {"rocky":"11111"},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    btnText: '保存',
    gender: [
      { value: 'male', name: '男' },
      { value: 'female', name: '女' },
    ],
    xingge: [
      { value: 'inner', name: '内向型' },
      { value: 'outer', name: '外向型' },
      { value: 'unknown', name: '不确定' },
    ],
    selectedgender: "male",
    selectedxingge: 'outer',
    selectedfangxiang: '23333',

    date: '2015-06-01',
    region: ['北京市', '北京市', '全部'],
    customItem: '全部',
    timeindex: 4,
    timearray: ['0小时', '0.5小时', '1小时', '1.5小时', '2小时', '2.5小时', '3小时', '3.5小时', '4小时'],

    budget: 20000,
    classability: [],
    fangxiang: [],
    
    cloudresult:{}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    console.log("onLoad....", app.globalData.userInfo, this.data.canIUse);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      console.log(111111111);
      app.userInfoReadyCallback = res => {
        console.log("userInfoReadyCallback====",res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    //取服务器数据classability
    //http._get("https://shenguotech.cn:8443/iphone/helloworld")
    that = this;
    wx.request({
      url: http._url("/iphone/classability"),
      method: "GET",
      header: http.Header,
      success: res => {
        if (res.statusCode == 200) {
          that.setData({
            'classability': res.data.data
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });

    //查询方向数据
    wx.request({
      url: http._url("/iphone/trainingdirection"),
      method: "GET",
      header: http.Header,
      success: res => {
        if (res.statusCode == 200) {
          that.setData({
            'fangxiang': res.data.data
          })
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
    
    //查询用户数据
    /*
    var Children = Bmob.Object.extend("children");
    var newOpenid = wx.getStorageSync('openid')
    var currentUser = Bmob.User.current();
    var query = new Bmob.Query(Children);
    if (currentUser) {
      console.log("UserModel.id "+currentUser.id);
      query.equalTo("own", currentUser.id);  
    };
    query.find({
      success: function (results) {
        console.log(results);
        console.log("children数据共查询到 " + results.length + " 条记录" + newOpenid);
        // 处理查询到的数据

        var object = results[results.length - 1];
        console.log(object.id + ' - ' + object.get('region'));
        app.globalData.childdata.region = object.get('region');
        app.globalData.childdata.birthday = object.get('birthday');
        app.globalData.childdata.gender = object.get('gender');
        app.globalData.childdata.learninghours = object.get('learninghours');
        app.globalData.childdata.learningbudget = object.get('learningbudget');
        app.globalData.childdata.objectid = object.id;
        app.globalData.childdata.xingge = object.get('xingge');
        app.globalData.childdata.hobbyclass = object.get('hobbyclass');
        app.globalData.childdata.fangxiang = object.get('fangxiang');
        console.log(app.globalData.childdata);
        var temptimeindex = that.data.timearray.indexOf(app.globalData.childdata.learninghours);

        const hobbylength = app.globalData.childdata.hobbyclass.length;
        const classlistlength = that.data.classability.length;
        for (let i = 0; i < hobbylength; i++)
          for (let j = 0; j < classlistlength; j++)
          {
            if (that.data.classability[j].value == app.globalData.childdata.hobbyclass[i])
              that.data.classability[j].checked=true;
           }; 
         
         //  console.log(that.data.classability);

        that.setData({
          region: app.globalData.childdata.region,
          date: app.globalData.childdata.birthday,
          selectedgender: app.globalData.childdata.gender,
          budget: app.globalData.childdata.learningbudget,
          selectedxingge: app.globalData.childdata.xingge,
          selectedfangxiang: app.globalData.childdata.fangxiang,
          timeindex: temptimeindex,
          'classability': that.data.classability
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    */
    //赋初值


    //设置初始默认数值

  },

  onReady: function () {
    console.log("onReady....");
  },
  getUserInfo: function (e) {
    console.log("getuserinfo===", e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  btnTestColud: function () {
    console.log("call cloud send objectid "+app.globalData.childdata.objectid);
    console.log(app.globalData);
    Bmob.Cloud.run('calscore', { "objectid": app.globalData.childdata.objectid }, {
      success: function (result) {
        console.log(result);
        that.setData({
          cloudresult:result,
        })
      },
      error: function (error) {
      }
    })
  },

  btnNextClick: function () {
    app.globalData.childdata.region = this.data.region
    app.globalData.childdata.birthday = this.data.date
    app.globalData.childdata.gender = this.data.selectedgender
    app.globalData.childdata.learninghours = this.data.timearray[this.data.timeindex]
    app.globalData.childdata.learningbudget = this.data.budget
    app.globalData.childdata.xingge = this.data.selectedxingge
    app.globalData.childdata.fangxiang = this.data.selectedfangxiang
    var selectedlist = [];

    for (var i = 0; i < this.data.classability.length; i++) {
      var object = this.data.classability[i];
      if (object.checked == true) {

        selectedlist.push(object.name);
      }
    }
    console.log(selectedlist);
    app.globalData.childdata.hobbyclass = selectedlist;
    console.log('保存事件，childdata值为：', app.globalData.childdata)
    //数据库保存

    var currentUser = Bmob.User.current();
    var User = Bmob.Object.extend("_User");
    var UserModel = new User();
    var Child = Bmob.Object.extend("children");
    var child = new Child();
    child.set("region", app.globalData.childdata.region);
    child.set("birthday", app.globalData.childdata.birthday);
    child.set("gender", app.globalData.childdata.gender);
    child.set("learninghours", app.globalData.childdata.learninghours);
    child.set("learningbudget", app.globalData.childdata.learningbudget);
    child.set("hobbyclass", app.globalData.childdata.hobbyclass);
    child.set("xingge", app.globalData.childdata.xingge);
    child.set("fangxiang", app.globalData.childdata.fangxiang);
    if (currentUser) {
      UserModel.id = currentUser.id;
      child.set("own", UserModel);
    }
    //添加数据，第一个入口参数是null
    child.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("儿童信息创建成功, objectId:" + result.id);
        app.globalData.childdata.objectid = result.id;
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建儿童信息失败');
      }
    });
    this.setData({ btnText: "已保存" })
  },

  radioChange: function (e) {
    console.log('性别radio发生change事件，携带value值为：', e.detail.value)
    this.setData({ selectedgender: e.detail.value })
  },

  radioXinggeChange: function (e) {
    console.log('性格radio发生change事件，携带value值为：', e.detail.value)
    this.setData({ selectedxingge: e.detail.value })
  },

  radioFangxiangChange: function (e) {
    console.log('方向radio发生change事件，携带value值为：', e.detail.value)
    this.setData({ selectedfangxiang: e.detail.value })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindDurationPickerChange: function (e) {
    this.setData({
      timeindex: e.detail.value
    })
  },

  bindBudgetSliderChange: function (e) {
    this.setData({
      budget: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  classCheckboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var items = this.data.classability, values = e.detail.value;
    for (var i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value == values[j]) {
          items[i].checked = true;
          break
        }
      }
    }
    this.setData({
      classability: items
    })
  }
})