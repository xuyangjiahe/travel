// pages/salesmanInfo/salesmanInfo.js
import areaLists from '../../utils/area.js'
const config = require("../../config.js");
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
    show: false,
    areaList: areaLists,
    areaName: '请选择',
    userId: '',
    travelname: '',
    name: '',
    phone: '',
    telephone: '',
    weixin: '',
    qrcode: '../../images/upload_img.png',
    baseUrl: '',
    title: '销售员认证',
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
  sunmitBtn() {
    // 提交认证资料操作
    let that =this;
    if (that.data.travelname == '' || that.data.travelname == '请输入') {
      wx.showToast({
        title: '请输入旅行社名称',
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
    if (that.data.name == '' || that.data.name == '请输入') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
      return
    }
    if (that.data.phone == '' || that.data.phone == '请输入') {
      wx.showToast({
        title: '请输入手机号码',
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
    if (that.data.telephone == '' || that.data.telephone == '请输入') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      })
      return
    }
    if (that.data.weixin == '' || that.data.weixin == '请输入') {
      wx.showToast({
        title: '请输入微信号',
        icon: 'none'
      })
      return
    }
    if (that.data.qrcode == '' || that.data.qrcode == '../../images/upload_img.png') {
      wx.showToast({
        title: '请上传微信二维码图片',
        icon: 'none'
      })
      return
    }
    that.serverFun();
  },
  serverFun() {
    // 请求
    let that = this;
    let params = {
      "cmd": "saleAuthentication",
      "uid": that.data.userId,
      "travelname": that.data.travelname,
      "province": that.data.areaName,
      "name": that.data.name,
      "phone": that.data.phone,
      "telephone": that.data.telephone,
      "weixin": that.data.weixin,
      "qrcode": that.data.qrcode,
    };
    http.postD(params)
    .then((res) => {
      if (res.data.result == '0') {
        wx.redirectTo({
          url: '/pages/salesmanIndex/salesmanIndex',
        })
        // wx.showToast({
        //   title: res.data.resultNote,
        //   icon: 'none'
        // })
      } else {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none'
        })
      }
    })
  },
  upLoadImgFun() {
    // 图片上传
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片 tempFiles /api/uploadFile
        console.log(res);
        const tempFilePaths = res.tempFilePaths
        /**
           * "result": "0",
    "resultNote": "上传成功",
    "dataobject1":"123.jpg"//路径 其它接口上传图片时 上传该链接
           * */
        wx.uploadFile({
          url: config.api_blink_base_url + '/api/uploadFile', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(uploadFileRes) {
            const data = JSON.parse(uploadFileRes.data);
            //do something
            console.log('uploadFileRes:', uploadFileRes);
            console.log('data:', data);
            if (data.result == '0') {
              that.setData({
                qrcode: data.dataobject
              })
            } else {
              wx.showToast({
                title: data.resultNote,
                icon: 'none'
              })
            }
          }
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
  gettravelname(event) {
    this.setData({
      travelname: event.detail.value
    })
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
  gettelephone(event) {
    this.setData({
      telephone: event.detail.value
    })
  },
  getweixin(event) {
    this.setData({
      weixin: event.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      userId: wx.getStorageSync('userId')
    })
    this.setData({
      baseUrl: config.api_blinl_ip
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