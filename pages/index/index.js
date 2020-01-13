Page({
  data: {
    canIUseAuthButton: true,
    nickName: "",
    avatar: "",
    mobile: "",
    city: "",
    province: "",
    gender: "",
    genderList: ['男', '女'],
    index: 0,
    age: ['18岁以下', '19-22岁', '23-26岁', '27-35岁', '36-40岁', '41-50岁', '51岁'],
    ageIndex: 0,
    hasUserInfo: false
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
  onGetAuthorize(res) {
    my.getOpenUserInfo({
      fail: (fail) => {
        console.log(fail);
      },
      success: (res) => {
        let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
        this.setData({
          nickName: userInfo.nickName,
          avatar: userInfo.avatar,
          city: userInfo.city,
          province: userInfo.province,
          gender: userInfo.gender,
          userInfo,
          hasUserInfo: true,
        });
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
        if (encryptedData.msg == 'Success') {
          that.setData({
            mobile: encryptedData.mobile
          })
        }
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
