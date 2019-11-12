// pages/agencLogin.js
var toolMd5 = require('../../utils/md5.js');
const HTTP = require('../../utils/http-list.js');
const http = new HTTP();
let app = getApp();
let globalInfo = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountNum: '',
    password: '',
    agencyId: '', // 旅行社id
  },
  login() {
    // 登录
    let that = this;
    console.log('accountNum:', that.data.accountNum);
    console.log('password:', that.data.password);
    if (that.data.accountNum == '') {
      wx.showToast({
        title: "请输入账号",
        icon: 'none'
      })
      return
    }
    if (that.data.password == '') {
      wx.showToast({
        title: "请输入密码",
        icon: 'none'
      })
      return
    }
    // 请求
    let param = {
      cmd: 'userLogin',
      phone: that.data.accountNum,
      password: toolMd5.hexMD5(that.data.password)
    };
    /**
     * "result": "0",
    "resultNote": "成功",
    "uid": "旅行社id"
    "iswanshan": "是否完善信息 0未完善 1已完善"
     * 
    */
    http.postD(param).then((res) => {
      console.log(res);
      // 测试用
      // wx.navigateTo({
      //   url: '/pages/completeInfo/completeInfo',
      // })
      if (res.data.result == '0') {
        // 旅行社
        
        globalInfo.userType = '1';
        that.setData({
          agencyId: res.data.uid
        });
        wx.removeStorageSync('agencyId');
        wx.removeStorageSync('userId');
        wx.setStorageSync('agencyId', res.data.uid);
        wx.setStorageSync('userType', '1');
        if (res.data.iswanshan == '0') {
          wx.redirectTo({
            url: '/pages/completeInfo/completeInfo',
          })
        } else {
          // 资料已经完善
          wx.redirectTo({
            url: '/pages/travelHome/travelHome',
          })
        }

      } else {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none'
        })
        // console.log(res.data);
      }
    }).catch((err) => {
      console.log('error:', err);
    })
  },
  /**
   * 获取账号密码
   * */ 
  getAccountNum(event) {
    this.setData({
      accountNum: event.detail.value
    })
  },
  getPassword(event) {
    this.setData({
      password: event.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(globalInfo)
    wx.hideShareMenu();
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
  onShareAppMessage: function () {

  }
})