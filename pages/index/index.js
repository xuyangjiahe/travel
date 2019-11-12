//index.js
//获取应用实例
const config = require("../../config.js");
const HTTP = require('../../utils/http-list.js');
const http = new HTTP();
let app = getApp();
let globalInfo = app.globalData;

Page({
  onShareAppMessage() {
    
  },
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
    userType: '', // 用户类型 1：旅行社；2：销售员；3：游客
    alreayCompleteUrl: '',// 已经完善过信息地址；
    noCompleteUrl: '', // 没有完善信息跳转地址
    baseUrl: '',
    isCompleteInfo: '0' // "是否完善信息 0未完善 1已完善"
  },
  
  saleLogin(e) {
    // 销售员登录
    let that = this;
    console.log('e', e)
    // 第一次登录到销售认证页面
    // 测试
    // wx.navigateTo({
    //   url: '/pages/salesmanIndex/salesmanIndex',
    // })
    that.setData({
      userType: '2'
    })
    globalInfo.userType = '2';
    wx.setStorageSync('userType', '2');
    this.impowerFun('2', e.detail.userInfo);
    this.onClose();
  },
  impowerFun(userType, userInfo) {
    // 获取授权
    let that = this;
    let serverUrl ;
    let myCode = {};
    wx.login({
      success:(res) => {
        console.log('login res:', res);
        myCode = {
          code: res.code,
          userInfo: userInfo
        };

        wx.getSetting({
          success(res) {
            console.log('getSetting res:', res);
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success:(res) => {
                  console.log("userInfo:", res)
                  console.log("userInfo:", res.userInfo)
                  // myCode['userInfo'] = res.userInfo;
                  http.postCommon(serverUrl, myCode).then((resverRes) => {
                    console.log('resverRes:', resverRes);
                    if (resverRes.data.result == '0') {
                      // 存储用户id
                      wx.removeStorageSync('agencyId');
                      wx.removeStorageSync('userId');
                      wx.setStorageSync('userId', resverRes.data.uid);
                      wx.setStorageSync('isCompleteInfo', resverRes.data.iswanshan);
                      that.setData({
                        isCompleteInfo: resverRes.data.iswanshan
                      })
                      if (resverRes.data.iswanshan === '1') {
                        wx.redirectTo({
                          url: that.data.alreayCompleteUrl,
                        })
                      } else {
                        wx.redirectTo({
                          url: that.data.noCompleteUrl,
                        })
                      }
                    } else {
                      console.log(resverRes.data.resultNote)
                      wx.showToast({
                        title: resverRes.data.resultNote,
                        icon: 'none'
                      })
                    }
                  })
                }
              })
            }
            
          }
        })
      }
    })
    // alreayCompleteUrl: '',// 已经完善过信息地址；
      // noCompleteUrl: '/pages/salesmanInfo/salesmanInfo', // 没有
    if (userType == '2') {
      // 销售员授权
      serverUrl = '/api/salelogin';
      that.setData({
        alreayCompleteUrl: '/pages/salesmanIndex/salesmanIndex',
        noCompleteUrl: '/pages/salesmanInfo/salesmanInfo'
      })
    } else if (userType == '3') {
      serverUrl = '/api/touristlogin';
      that.setData({
        alreayCompleteUrl: '/pages/salesmanIndex/salesmanIndex',
        noCompleteUrl: '/pages/visterInfo/visterInfo'
      })
    }
    
  },

  agencyLogin(e) {
    // 旅行社登录
    let that = this;
    wx.redirectTo({
      url: '/pages/agency/agencLogin',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        wx.removeStorageSync('userId');
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
    setTimeout(() => {
      that.onClose();
    }, 500)
    
  },
  travelLogin(e) {
    // 游客登录
    let that = this;
    // wx.navigateTo({
    //   url: '/pages/visterInfo/visterInfo'
    // })
    that.setData({
      userType: '3'
    })
    globalInfo.userType = '3';
    wx.setStorageSync('userType', '3');
    this.impowerFun('3', e.detail.userInfo);
    this.onClose();
  },
  showPopup:function() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  
  serverFun() {
    // 获取当前页面数据
    let that = this;
    let params = { "cmd": "salestouristHomePage" };
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
  onLoad: function () {
    this.serverFun();
    let that = this
    // 系统信息的高度
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        console.log(res.statusBarHeight)
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      },
    })
    that.checkLocation();


  },
  openWordFun(wordData) {
    // wordData 里面包含下载文档url
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: config.api_blinl_ip + '/111.docx',
      success: function (res) {
        console.log('downloadFileRes', res);
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            
            wx.showToast({
              title: '文档打开失败',
              icon: 'none'
            })
          },
        })
      },
      fail: function (res) {
        console.log('文件下载失败');
        wx.showToast({
          title: '文件下载失败',
          icon: 'none'
        })
      },
    })
  },
  checkLocation() {
    // 判断缓存信息
    let that = this;
    console.log('userType:', wx.getStorageSync('userType'));
    console.log('userId:', wx.getStorageSync('userId'));
    // if ( wx.getStorageInfoSync('userType') == '2') {
    //   wx.navigateTo({
    //     url: '/pages/salesmanIndex/salesmanIndex',
    //   })
    // }
    if (wx.getStorageSync('agency') && wx.getStorageSync('userType') == '1') {
      if (wx.getStorageSync('isCompleteInfo') === '1') {
        wx.redirectTo({
          url: '/pages/travelHome/travelHome',
        })
      } else {
        wx.showToast({
          title: '您尚未完善信息，请先登录完善信息。',
          icon: 'none',
          duration: 500,
          success() {
            wx.redirectTo({
              url: '/pages/agency/agencLogin',
            })
          }
        })
      }
      
    } else if (wx.getStorageSync('userId') && wx.getStorageSync('userType') == '2') {
      if (wx.getStorageSync('isCompleteInfo') === '1') {
        globalInfo.userType = '2';
        wx.redirectTo({
          url: '/pages/salesmanIndex/salesmanIndex',
        })
      } else {
        wx.showToast({
          title: '您尚未完善信息，请先完善信息。',
          icon: 'none',
          duration: 500,
          success() {
            wx.redirectTo({
              url: '/pages/salesmanInfo/salesmanInfo',
            })
          }
        })
      }
      
    } else if (wx.getStorageSync('userId') && wx.getStorageSync('userType') == '3') {
      if (wx.getStorageSync('isCompleteInfo') === '1') {
        globalInfo.userType = '2';
        wx.redirectTo({
          url: '/pages/discountCoupon/discountCoupon',
        })
      } else {
        wx.showToast({
          title: '您尚未完善信息，请先完善信息。',
          icon: 'none',
          duration: 500,
          success() {
            wx.redirectTo({
              url: '/pages/visterInfo/visterInfo',
            })
          }
        })
      }
      
    }
  },
 
})
