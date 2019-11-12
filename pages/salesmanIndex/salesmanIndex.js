// pages/salesmanIndex/salesmanIndex.js
import tool from '../../utils/utils.js';
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
    swiper: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    homeLists: [],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: false,
    lineTypeId: '', // 线路id
    userType: '', // 身份类型
  },
  serverFun() {
    // 获取当前页面数据
    let that = this;
    let params = { "cmd": "salestouristHomePage"};
    http.postD(params).then((res) => {
      console.log('saleIndexres:', res);
      if (res.data.result == '0') {
        that.setData({
          swiper: res.data.dataobject,
          homeLists: res.data.dataList
        })
      } else {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none'
        })
      }
    })
  },
  
  agencyLogin() {
    // 旅行社登录
    wx.navigateTo({
      url: '/pages/agency/agencLogin',
    })
  },
  showPopup: function () {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  touchBtn() {
    // 右侧图标点击事件
    console.log('touchBtn3333');
    console.log(globalInfo.userType);
    let that = this;
    if (globalInfo.userType == '3') {
      // 游客

      wx.navigateTo({
        url: '/pages/discountCoupon/discountCoupon',
      })
    } else if (globalInfo.userType == '2') {
      // 销售员
      that.getScanCode();
    }
  },

  getScanCode() {
    // 唤起扫一扫
    let that = this;

    // if (options.q !== undefined) {
    //   let getScanCodeUrl = decodeURIComponent(options.q);
    //   console.log('getScanCodeUrl:', getScanCodeUrl);
    //   let uid = tool.sendUrlToParams(getScanCodeUrl, 'uid');
    //   let isScanCodeQr = tool.sendUrlToParams(getScanCodeUrl, 'isScanCodeQr');
    //   let type = tool.sendUrlToParams(getScanCodeUrl, 'type');

    //   // 扫码进入
    //   that.setData({
    //     lineTypeId: type,
    //     agencyId: uid,
    //     isScanCodeQr: isScanCodeQr
    //   });
    //   wx.setStorageSync('lineTypeId', that.data.lineTypeId)
    //   wx.setStorageSync('agencyId', that.data.agencyId)
    //   that.showPopup();
    //   this.getLists('1', '1');


    // } 

    wx.scanCode({
      // onlyFromCamera: true,
      success(res) {
        console.log(res);
        console.log('res.result:', res.result);
        // 前面是旅行社id  后面是分类id
        let getScanCodeUrl = res.result;
    //   console.log('getScanCodeUrl:', getScanCodeUrl);
        let uid = tool.sendUrlToParams(getScanCodeUrl, 'uid');
        let isScanCodeQr = tool.sendUrlToParams(getScanCodeUrl, 'isScanCodeQr');
        let type = tool.sendUrlToParams(getScanCodeUrl, 'type');
        
        let idArr = res.result.split(',')
        console.log(res.result.split(','));
        if (res && res.result) {
          if (uid && type) {
            that.setData({
              lineTypeId: type,
            })
            wx.setStorageSync('agencyId', uid);
            wx.setStorageSync('lineTypeId', type);
            // wx.setStorageSync('isScanCodeQr', isScanCodeQr);
            wx.navigateTo({
              url: '/pages/routerList/itinerary?lineTypeId=' + that.data.lineTypeId,
            })
          } else {
            wx.showToast({
              title: '扫描获取信息失败',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '扫描获取信息失败',
            icon: 'none',
          })
        }
        
      }
    })
  },
  getBackIndePage() {
    console.log('3434');
    wx.clearStorageSync();
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  toSeeLine(){
    if (globalInfo.userType == '3') {
      // 游客
      wx.showToast({
        title: '请联系旅游顾问',
        icon: 'none'
      })
     
    } else if (globalInfo.userType == '2') {
      // 销售员
      wx.showToast({
        title: '请联系旅行社',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this;
    wx.hideShareMenu();
    let optionsData = options;
    if (optionsData.userType == '3') {
      globalInfo.userType = '3';
      that.setData({
        userType: '3'
      })
    } else {
      // 系统信息的高度
      if (globalInfo.userType == '3') {
        // 游客
        that.setData({
          userType: globalInfo.userType
        })

      } else if (globalInfo.userType == '2') {
        // 销售员
        that.setData({
          userType: globalInfo.userType
        })
      } 
    }
    
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        console.log(res.statusBarHeight)
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    })
    this.serverFun();
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
    let that = this;
   
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
  onShareAppMessage: function () {

  }
})