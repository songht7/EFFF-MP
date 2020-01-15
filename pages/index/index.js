import graceChecker from "/util/graceChecker.js";
import { Interface } from "/util/util.js";
const url = Interface.apiurl + Interface.addr.getPhone;
Page({
  data: {
    article_id: 35,
    canIUseAuthButton: true,
    nickName: "",
    avatar: "",
    mobile: "",
    city: "",
    province: "",
    gender: "",//男对应“m”，女对应“f”
    genderList: ['男', '女'],
    index: 0,
    age: ['18岁以下', '19-22岁', '23-26岁', '27-35岁', '36-40岁', '41-50岁', '51岁'],
    ageIndex: 0,
    formData: {},
    hasUserInfo: false,
    loading: false
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onItemInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },
  onClear(e) {
    this.setData({
      [e.target.dataset.field]: '',
    });
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value,
    });
  },
  bindObjPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      ageIndex: e.detail.value,
    });
  },
  onGetAuthorizeUser(res) {
    my.getOpenUserInfo({
      fail: (fail) => {
        console.log(fail);
      },
      success: (res) => {
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        console.log("userInfo:", userInfo);
        if (userInfo.msg == 'Success') {
          this.setData({
            nickName: userInfo.nickName,
            avatar: userInfo.avatar,
            city: userInfo.city,
            province: userInfo.province,
            gender: userInfo.gender,
            index: userInfo.gender == "m" ? 0 : 1,
            userInfo,
            hasUserInfo: true,
          });
        }
      }
    });
  },
  getUserInfo() {
    my.getAuthCode({
      scopes: 'auth_user',
      fail: (error) => {
        console.error('getAuthCode', error);
      },
      success: () => {
        // do login...
        // then
        my.getAuthUserInfo({
          fail: (error) => {
            console.error('getAuthUserInfo ', error);
          },
          success: (userInfo) => {
            console.log(`userInfo:`, userInfo);
            this.setData({
              nickName: userInfo.nickName,
              userInfo,
              hasUserInfo: true,
            });
            // abridge.alert({
            //   title: JSON.stringify(userInfo), // alert 框的标题
            // });
          }
        });
      }
    });
  },
  onGetAuthorize() {
    var that = this;
    my.getPhoneNumber({
      success: (res) => {
        let encryptedData = res.response;
        console.log(res);
        console.log(url);
        my.request({
          url: url,
          data: encryptedData,
          method: "POST",
          success: function (res) {
            console.log(res);
            if (res.msg == 'Success') {
              that.setData({
                mobile: res.mobile
              })
            }
          },
          fail: function (res) {
            console.log(res);
            my.showToast({
              type: 'none',
              content: '授权手机号失败',
              duration: 2000,
              success: () => { },
            });
          },
          complete: function (res) { }
        });
      },
      fail: (res) => {
        console.log(res);
        console.log('getPhoneNumber_fail');
      },
    });
  },
  onAuthError(e) {
    console.log(e);
  },
  formSubmit(e) {
    var _this = this;
    if (_this.data.loading == true) {
      return
    }
    //console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
    var formData = e.detail.value;
    console.log(formData)
    //return
    _this.setData({
      loading: true
    })
    var rule = [{
      name: "UserName",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请填写姓名"
    },
    {
      name: "UserPhone",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "请填写正确的手机号"
    }, {
      name: "City",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请选择城市"
    }
    ];
    // console.log(rule)
    // return
    //进行表单检查
    var checkRes = graceChecker.check(formData, rule);
    if (checkRes) {
      console.log("age:", _this.data.age);
      var data2DB = {
        "avatar": _this.data.avatar,
        "name": formData.UserName + ' --Source From - alipay',
        "age_range": _this.data.age[formData.Age],
        "sex": _this.data.genderList[formData.Gender],
        "phone": formData.UserPhone,
        "city": formData.City,
        "article_id": _this.data.article_id
      };
      console.log("data2DB:", data2DB);
      my.request({
        url: Interface.apiurl + Interface.addr.saveSingle,
        method: 'POST',
        data: data2DB,
        dataType: 'json',
        success: function (res) {
          console.log(res);
          var result = res.data;
          if (result.success) {
            my.showToast({
              type: 'none',
              content: "领取成功！",
              duration: 2000,
              success: () => { },
            });
            my.navigateTo({ url: "/pages/thx/thx?key=" + result.result.id })
          } else {
            my.showToast({
              type: 'none',
              content: result.result,
              duration: 3000,
              success: () => { },
            });
          }
        },
        fail: function (res) {
          my.showToast({
            type: 'none',
            content: '预约请求失败',
            duration: 3000,
            success: () => { },
          });
          console.log(JSON.stringify(res));
        },
        complete: function (res) {
          _this.setData({
            loading: false
          })
          // my.alert({title: 'complete'});
        }
      });
    } else {
      my.showToast({
        type: 'none',
        content: graceChecker.error,
        duration: 3000,
        success: () => { },
      });
      _this.setData({
        loading: false
      })
    }

  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'EF英孚教育',
      desc: '英孚教育 英语培训中心',
      path: 'pages/index/index',
    };
  },
});
