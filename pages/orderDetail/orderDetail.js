// pages/orderDetail/orderDetail.js
const HTTP = require('../../utils/http-list.js');
const http = new HTTP();
let app = getApp();
let globalInfo = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    agencyId: '',
    orderInfo: {},
    
  },
  confirmOrder() {
    // 核销订单
    let that = this;
    let params = {
      "cmd": "confirmsend",
      "cid": that.data.orderId,
      "uid": that.data.agencyId
    };
    http.postD(params)
      .then((res) => {
        console.log('confirmOrder res:', res);
        if (res.data.result == '0') {
          wx.showToast({
            title: '核销成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              wx.redirectTo({
                url: '/pages/confirmList/travelList',
              })
            }
          })
          
        } else {
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none'
          })
        }
      })
  },

  getOrderInfo() {
    let that = this;
    let params = {
      "cmd": "confirmsdetail",
      "cid": that.data.orderId
    };

    http.postD(params)
    .then((res) => {
      if (res.data.result == '0') {
        if (res.data.dataobject) {
          that.setData({
            orderInfo: res.data.dataobject
          })
        }
      } else {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    let optionsData = options;
    console.log('orderDetail optionsData:', optionsData);
    if (optionsData.orderId) {
      that.setData({
        orderId: optionsData.orderId
      })
    }
    if (optionsData.agencyId) {
      that.setData({
        agencyId: optionsData.agencyId ? optionsData.agencyId : wx.getStorageSync('agencyId')
      })
    }
    this.getOrderInfo();
    
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
    return {
      title: '旅游小程序', 
      path: '/pages/orderDetailShare/orderDetailShare?orderId=' + that.data.orderId + '&agencyId=' + that.data.agencyId,  // 路径，传递参数到指定页面。
      imageUrl: '', // 分享的封面图
      success: (res) => {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        // wx.setStorageSync('isShareOpen', '2');
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

    
  }
})