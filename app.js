//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    
    wx.onAppHide ((res) => {
      console.log('退出', res);
      // wx.setStorageSync('isShareOpen', '3');
    })
  },
  onHide: function () {
    let pages = getCurrentPages();
    console.log('pagesonHide:', pages);
    let currPage = null;
    // console.log(pages) 的到一个数组
    if (pages.length) {
      // 获取当前页面的对象（上边所获得的数组中最后一项就是当前页面的对象）
      currPage = pages[pages.length - 1];
    }
    // 获取当前页面的路由
    let route = currPage.route
    console.log('routeonHide:', route)
    // let pages = getCurrentPages();

    // if (pages['0'].route == '需要判断的页面') {

    //   wx.redirectTo({

    //     url: '需要跳转到的页面'

    //   })

    // }

  },
  
  onShow: function (options) {
    // let curRote = wx.getStorageSync('curRoute');
    // let isShareOpen = wx.getStorageSync('isShareOpen');
    // console.log('onShow options', options);
    // if (options.scene == 1007) {
    //   // 通过单人聊天会话分享进入
      
    //   console.log('发现栏小程序分享进入');
    //   // that.setData({
    //   //   isShowBtn: '2'
    //   // })
    //   wx.setStorageSync('isShowBtn', '2')
    // }
    // if (options.scene == 1008) {
    //   // 通过群聊会话分享进入
      
    //   // wx.setStorageSync('isShareOpen', '2');
    //   console.log('发现栏小程序分享进入');
    //   // that.setData({
    //   //   isShowBtn: '2'
    //   // })
    //   wx.setStorageSync('isShowBtn', '2')
    // }
    // if (options.scene == 1001) {
    //   // 通过发现栏小程序进入
    //   // wx.setStorageSync('isShareOpen', '3');
    //   console.log('发现栏小程序进入');
    //   wx.setStorageSync('isShowBtn', '3')
    // }

    // ......
  },
  globalData: {
    userInfo: null,
    userType: '0', // 用户类型 1：旅行社；2：销售员；3：游客
    shareBgUrl: '' // 分享封面图
  }
})