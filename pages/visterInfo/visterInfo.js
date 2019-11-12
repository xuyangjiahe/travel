// pages/visterInfo/visterInfo.js
const HTTP = require('../../utils/http-list.js');
import areaLists from '../../utils/area.js';
const http = new HTTP();
let app = getApp();
let globalInfo = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    show: false,
    areaList: areaLists,
    areaName: '请选择',
    sexName: '请选择',
    sexType: 1, // 1:男 2：女
    sexList: ['男', '女'],
    isShowSexIfram: false,
    userId: '',
    name: '',
    phone: '',
    address: '',
    title: '游客注册登录',
  },
  submitFun() {
    // 提交操作
    let that = this;

    if (that.data.areaName == '' || that.data.areaName == '请选择') {
      wx.showToast({
        title: '请选择省份',
        icon: 'none'
      })
      return
    }
    if (that.data.name == '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
      return
    }
    if (that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if (that.data.phone.length != '11') {
      wx.showToast({
        title: '手机号格式输入有误',
        icon: 'none'
      })
      return
    }
    if (that.data.sexName == '' || that.data.sexName == '请选择') {
      wx.showToast({
        title: '请选择性别', 
        icon: 'none'
      })
      return
    }
    if (that.data.address == '') {
      wx.showToast({
        title: '请输入详细地址', 
        icon: 'none'
      })
      return
    }
    that.serverFun();
  },
  serverFun() {
    // 请求数据
    let that = this;
    let params = {
      "cmd": "touristAuthentication",
      "uid": that.data.userId,
      "province": that.data.areaName,
      "name": that.data.name,
      "phone": that.data.phone,
      "sex": that.data.sexName,
      "address": that.data.address,
    };
    http.postD(params).then((res) => {
      if (res.data.result == '0') {
        // 销售员，游客公用一个首页
        wx.redirectTo({
          url: '/pages/discountCoupon/discountCoupon',
        })
      } else {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none'
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
  showSexPopup() {
    this.setData({ isShowSexIfram: true });
  },
  closeSexPopup() {
    this.setData({ isShowSexIfram: false });
  },
  onCancelSex(event) {
    console.log(event)
    this.setData({
      sexName: event.detail.value
    })
    this.closeSexPopup()
  },
  onConfirmSex(event) {
    console.log(event)
    this.setData({
      sexName: event.detail.value
    })
    if (event.detail.index === 0) {
      this.setData({
        sexType: 1
      })
    } else if (event.detail.index === 1) {
      this.setData({
        sexType: 2
      })
    }
    console.log(this.data.sexType);
    this.closeSexPopup()
  },
  getname(event) {
    this.setData({
      name: event.detail.value
    })
  },
  getphone(event) {
    this.setData({
      phone: event.detail.value
    })
  },
  getaddress(event) {
    this.setData({
      address: event.detail.value
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.hideShareMenu();
    wx.getStorageSync('userId');
    this.setData({
      userId: wx.getStorageSync('userId')
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        console.log(res.statusBarHeight)
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    })
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