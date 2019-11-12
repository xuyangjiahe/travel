// pages/completeInfo.js
// const areaLists = require('../../utils/area.js');
var toolMd5 = require('../../utils/md5.js');
const config = require("../../config.js");
import areaLists from '../../utils/area.js'
const HTTP = require('../../utils/http-list.js');
const http = new HTTP();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    show: false,
    areaList: areaLists,
    areaName: '请选择',
    name: '',
    address: '',
    password: '',
    confirmpassword: '',
    agencyId: '',
    travelName: '',
    travelImg: '',
    title: '旅行社认证',
  },
  getBacHhome() {
    let that = this;
    wx.clearStorage();
    wx.clearStorageSync();
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }, 500)
  },
  submitBtn() {
    let that  = this;
   
    if (that.data.name == '' || that.data.name == '请输入负责人姓名') {
      wx.showToast({
        title: '请填写负责人名称',
        icon: 'none'
      })
      return
    }
    if (that.data.address == '' || that.data.address == '请输入地址信息') {
      wx.showToast({
        title: '请填详细地址',
        icon: 'none'
      })
      return
    }
    if (that.data.areaName == '' || that.data.areaName == '请选择') {
      wx.showToast({
        title: '请选择省份',
        icon: 'none'
      })
      return
    }
    if (that.data.password == '' || that.data.password == '请更该登录密码') {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      })
      return
    }
    if (that.data.confirmpassword == '' || that.data.confirmpassword == '请再输入一次密码') {
      wx.showToast({
        title: '请输入确认密码',
        icon: 'none'
      })
      return
    }
    if (that.data.confirmpassword !== that.data.password) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      })
      return
    }
   
    that.serverFun();
  },
  serverFun() {
    // 提交请求
    let that = this;
    let param = {
      'cmd': 'userAuthentication',
      'uid': that.data.agencyId,
      'personcharge': that.data.name,
      'address': that.data.address,
      'province': that.data.areaName,
      'newpassword': toolMd5.hexMD5(that.data.password)
    };
    /**
     * "result": "0",
    "resultNote": "成功",
     * */ 
    http.postD(param)
    .then((res) => {
      if (res.data.result == '0') {
        wx.showToast({
          title: '旅行社认证信息提交成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/travelHome/travelHome',
          })
        }, 100)
      } else {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none'
        })
      }
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
      if (res.data.result == '0') {
        that.setData({
          travelName: res.data.dataobject.nickname,
          travelImg:  res.data.dataobject.icon
        })
      }else {
        // 失败时设置为默认logo，名字为空
        that.setData({
          travelImg: '../../images/icon1.png',
          travelName: '欢迎使用旅游小程序'
        })
      }
    })
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  onConfirm(data) {
    console.log(data)
    this.setData({
      areaName: data.detail.values[0].name
    })
    this.onClose();
  },
  onCancel(data) {
    console.log(data)
  },
  onChange(data) {
    console.log(data)
  },
  getname(event) {
    console.log(event)
    this.setData({
      name: event.detail.value
    })
  },
  getaddress(event) {
    this.setData({
      address: event.detail.value
    })
  },
  getpassword(event) {
    this.setData({
      password: event.detail.value
    })
  },
  getconfirmpassword(event) {
    this.setData({
      confirmpassword: event.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.hideShareMenu()
    this.setData({
      agencyId: wx.getStorageSync('agencyId')
    });
    console.log('agencyId:', wx.getStorageSync('agencyId'));
    this.getTravelInfo();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('agencyId:', wx.getStorageSync('agencyId'));
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