// pages/travelHome/travelHome.js
const HTTP = require('../../utils/http-list.js');
const http = new HTTP();
let app = getApp();
let globalInfo = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    agencyId: '',
    homeLists: [],
    travelName: '',
    travelImg: '',
    travelIntro: '',
    travelContent: '', // 详情富文本
    lineTypeId: '', // 线路id
    qrCodeList: [], // 线路二维码列表
    travelInfo: {},
  },
  onConfirmFun() {
    // 确认操作
    wx.navigateTo({
      url: '/pages/confirmList/travelList'
    })
  },
  getTravelInfo() {
    // 获取旅行社信息
    let that = this;
    let param = {
      'cmd': 'UserHomePage',
      'uid': that.data.agencyId
    };

    http.postD(param)
      .then((res) => {
        console.log('lvxingsheindex res:', res);
        if (res.data.result == '0') {
          that.setData({
            travelName: res.data.dataobject.nickname,
            travelImg: res.data.dataobject.icon,
            travelIntro: res.data.dataobject.traveldesc,
            travelContent: res.data.dataobject.content,
            travelInfo: res.data.dataobject,
            homeLists: res.data.dataList,
            // qrCodeList: res.data.dataList   // 字段冲突
          })
        } else {
          // 失败时设置为默认logo，名字为空
          that.setData({
            travelImg: '../../images/icon1.png',
            travelName: '欢迎使用旅游小程序'
          })
        }
      })
  },
  toSeeDetail() {
    // 查看旅行社详情
    let that = this;
    wx.navigateTo({
      url: '/pages/travelIntro/travelIntro',
      event: {
        // 获取被打开页面传送到当前页面的值
        sendContent: (data) => {
          console.log('data:', data);
        }
      },
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendContent', { data: that.data.travelInfo })
        // res.eventChannel.emit('sendContent', { data: 'that.data.travelContent' })
      }
    })
  },
  toSeeLine(event) {
    let that = this;
    console.log(event);
    that.setData({
      lineTypeId: event.currentTarget.dataset.id
    })
    wx.setStorageSync('lineTypeId', that.data.lineTypeId);

    if (that.data.homeLists) {
      that.data.homeLists.map((item) => {
        if (item.cid == that.data.lineTypeId) {
          wx.setStorageSync('qrCodeInfo', item.qrcode)
        }
      })
    }

    console.log('/pages/routerList/itinerary?typeId=' + that.data.lineTypeId);
    wx.navigateTo({
      url: '/pages/routerList/itinerary?lineTypeId=' + that.data.lineTypeId + '&agencyId=' + that.data.agencyId,
    })
  },
  getBackIndePage() {
    console.log('3434');
    wx.clearStorageSync();
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options); 
    let that = this;
    wx.hideShareMenu();
    let optionsData = options;
    globalInfo.userType = 1;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        console.log(res.statusBarHeight)
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    })
    this.setData({
      agencyId: wx.getStorageSync('agencyId') ? wx.getStorageSync('agencyId') : optionsData.agencyId
    });
    console.log('agencyId:', wx.getStorageSync('agencyId'));
    this.getTravelInfo();
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.redirectTo({
    //   url: '/pages/index/index',
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    let that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }

    console.log(globalInfo.shareBgUrl);
    wx.setStorageSync('isShareOpen', '2');
    return {
      title: that.data.lineInfo.travelName, // pages/routeDetail/routeDetail
      path: '/pages/travelHome/travelHome?agencyId=' + that.data.agencyId,  // 路径，传递参数到指定页面。
      imageUrl: globalInfo.shareBgUrl, // 分享的封面图
      success: (res) => {
        // 转发成功
        // console.log("转发成功:" + JSON.stringify(res));
        // wx.setStorageSync('isShareOpen', '2');
      },
      fail: function (res) {
        // 转发失败
        // console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})