// pages/itinerary/itinerary.js
const config = require("../../config.js");
const util = require('../../utils/util.js');
import  tool from '../../utils/utils.js';
const HTTP = require('../../utils/http-list.js');
import QRCode from '../../utils/weapp-qrcode.js';
var qrcode;

const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;

// 300rpx 在6s上为 150px
const code_w = 300 / rate;
// 第二种
import SQRCode from '../../utils/qrcode.js';
const http = new HTTP();
let app = getApp();
let globalInfo = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    list:[],
    newList:[],
    lineTypeId: '',
    agencyId: '', // 旅行社id
    nowPage: 1,
    pageCount: 10,
    totalPage: '',
    lineId: '', // 线路id
    showQr: false,
    userType: '0', // 用户类型 1：旅行社；2：销售员；3：游客
    text: 'https://github.com/tomfriwel/weapp-qrcode',
    image: '',
    code_w: code_w,
    qrURLSave: '',
    qrUrlText:'',
    title: '',
    show: false,
    isShareOpen: '2', // 默认2：不显示 3：显示
    alreayCompleteUrl: '',// 已经完善过信息地址；
    noCompleteUrl: '', // 没有完善信息跳转地址
    scanCodeUrl:'/pages/routerList/itinerary', // 扫二维码跳转地址
    isScanCodeQr: '',
    salesmanId:'', // 销售员id
    timeOutTimer: null, // 三秒内没有操作默认执行
  },
  showPopupQr: function () {
    let that = this;
    this.setData({ showQr: true });
    // this.makeQrCode();
    this.createQrCode(that.data.qrUrlText, 'myQrcode', that.data.code_w, that.data.code_w)
  },

  onCloseQr() {
    this.setData({ showQr: false });
  },
  toLineDetail(event) {
    let that = this;
    console.log("event:", event)
    that.setData({
      lineId: event.currentTarget.dataset.lineid
    })
    if (that.data.isShareOpen == '2') {
      wx.setStorageSync('isShareOpen', '2');
    } else {
      wx.setStorageSync('isShareOpen', '3');
    }
    
    wx.setStorageSync('lineId', event.currentTarget.dataset.lineid)
    // '/pages/routeDetail/routeDetail?lineId=' + that.data.lineId + '&isShareOpen=2&salesmanId=' + that.data.salesmanId + '&lineTypeId=' + that.data.lineTypeId + "&userType=" + that.data.userType
    console.log('列表查看详情that.data.userType:', that.data.userType);
    console.log('列表查看详情that.data.salesmanId:', that.data.salesmanId);
    if (that.data.userType == '2') {
      // 销售员
      wx.navigateTo({
        url: '/pages/routeDetail/routeDetail?salesmanId=' + that.data.salesmanId
      })
    } else {
      // 旅行社
      wx.navigateTo({
        url: '/pages/routeDetail/routeDetail'
      })
    }
    
  },
  makeQrCode() {
    let that = this;
    // 这个不用 20191210
    qrcode = new QRCode('myQrcode', {
      // text: that.data.qrURLSave,
      text: that.data.qrUrlText,
      width: code_w,
      height: code_w,
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log(res.path)
        // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
        that.setData({
          qrURLSave: res.path
        })
      }
    })
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    console.log('createQrCode url:', url);
    SQRCode.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myQrcode',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log('tempFilePath', tempFilePath);
        that.setData({
          qrURLSave: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  saveQrCode(){
    // 保存二维码
    let that = this;
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          
          console.log('qrcode:', qrcode);
          wx.getSetting({
            success(res) {
              console.log('getSetting res:', res);
              if (res.authSetting['scope.userInfo'] || res.authSetting['scope.userLocation'] ||res.authSetting['scope.writePhotosAlbum'] ) {
                console.log('授权成功')
                // 网路地址需要下载到本地 并获取本地路径
                // wx.downloadFile({
                //   url: that.data.qrURLSave, //仅为示例，并非真实的资源
                //   success(res) {
                //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                //     if (res.statusCode == 200) {
                  // wx.getImageInfo({
                  //   src: res.tempFilePaths,
                  //   success (res) {
                  //     console.log(res.width)
                  //     console.log(res.height)
                  //   }
                  // })
                      wx.saveImageToPhotosAlbum({
                        filePath: that.data.qrURLSave,
                        success(saveRes) {
                          wx.showToast({
                            title: '已保存至相册',
                          })
                          that.setData({ showQr: false });
                        },
                        complete(completeRES) {
                          console.log('completeRES:',completeRES)
                          // wx.showModal({
                          //   title: 'saveImageToPhotosAlbum completeRES',
                          //   content: JSON.stringify(completeRES),
                          //   success(res) {
                          //     if (res.confirm) {
                          //       console.log('用户点击确定')
                          //     }
                          //   }
                          // })
                        }
                      })
                //     }
                //   }
                // })

              }
            }
          }) 
        }

      }
    })
  },
  getBackIndePage() {
    console.log('3434');
    let that = this;
    // userType: '0', // 用户类型 1：旅行社；2：销售员；3：游客
    if (that.data.userType == '1') {
      wx.redirectTo({
        url: '/pages/travelHome/travelHome',
      })
    } else if (that.data.userType == '2') {
      wx.redirectTo({
        url: '/pages/salesmanIndex/salesmanIndex',
      })
    }
    
  },
  saleLogin(e) {
    // 销售员登录
    let that = this;
    // 清除定时器
    that.setData({
      timeOutTimer: null
    })
    console.log('e', e)
    // 销售员不能转发
    // wx.hideShareMenu();
    that.setData({
      userType: '2'
    })
    globalInfo.userType = '2';
    wx.setStorageSync('userType', '2');
    this.impowerFun('2', e.detail.userInfo);
    
  },
  impowerFun(userType, userInfo) {
    // 获取授权
    let that = this;
    let serverUrl;
    let myCode = {};
    wx.login({
      success: (res) => {
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
                success: (res) => {
                  console.log("userInfo:", res)
                  console.log("userInfo:", res.userInfo)
                  // myCode['userInfo'] = res.userInfo;
                  http.postCommon(serverUrl, myCode).then((resverRes) => {
                    console.log('resverRes:', resverRes);
                    if (resverRes.data.result == '0') {
                      // 存储用户id
                      // wx.removeStorageSync('agencyId');
                      // wx.removeStorageSync('userId');
                      wx.setStorageSync('userId', resverRes.data.uid);
                      console.log('itinerary that.data.userType1', that.data.userType);
                      if (that.data.userType == '2') {
                        console.log('itinerary that.data.userType2', that.data.userType);
                        that.setData({
                          salesmanId: resverRes.data.uid
                        })
                      } else {
                        that.setData({
                          salesmanId: ''
                        })
                      }
                      // "iswanshan": "是否完善信息 0未完善 1已完善"
                      if (resverRes.data.iswanshan === '1') {
                        // wx.navigateTo({
                        //   url: that.data.scanCodeUrl,
                        // })
                        
                        that.onClose();
                      } else {
                        if (userType == '2') {
                          wx.showToast({
                            title: '您还不是销售员，请先注册',
                            icon: 'none'
                          })
                          wx.redirectTo({
                            url: '/pages/salesmanInfo/salesmanInfo',
                          })
                          // 扫描进入 又是第一次进入2：没有销售员信息； 3：有销售员信息
                          wx.setStorageSync('salesManNoCommpleteInfo', '2');
                        } else {
                          that.onClose();
                        }
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
      // that.setData({
      //   // alreayCompleteUrl: '/pages/routerList/itinerary', // 
      //   // noCompleteUrl: '/pages/salesmanInfo/salesmanInfo'
      // })
    } else if (userType == '3') {
      serverUrl = '/api/touristlogin';
      // that.setData({
      //   // alreayCompleteUrl: '/pages/routerList/itinerary',
      //   // noCompleteUrl: '/pages/visterInfo/visterInfo'
      // })
    }

  },

  travelLogin(e) {
    // 游客登录
    let that = this;
    that.setData({
      timeOutTimer: null
    })
    // wx.navigateTo({
    //   url: '/pages/visterInfo/visterInfo'
    // })
    // that.setData({
    //   userType: '3'
    // })
    // globalInfo.userType = '3';
    // wx.setStorageSync('userType', '3');
    // this.impowerFun('3', e.detail.userInfo);
    // 2019-11-13游客假授权
    that.onClose();
    
  },
  onClose() {
    // 登录弹窗
    this.setData({ show: false });
  },
  showPopup: function () {
    // 登录弹窗
    this.setData({ show: true });
  },
  getBacHhome() {
    let that = this;

    if (that.data.isScanCodeQr == '2' || that.data.isShareOpen == '2') {
      // 扫码进入
      wx.clearStorageSync();
      wx.redirectTo({
        url: '/pages/index/index',
      })
    } else {
     
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
    
    // wx.redirectTo({
    //   url: '/pages/index/index',
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
    console.log('options:4444444444444444444', options);
    
    /**
     * 扫二维码地址://https://lvyou.cxzjzg.com/tourismprogram/api/service?uid=8&type=1&isScanCodeQr=2
     * @params uid:旅行社id
     * @params type:线路类型
     * @isScanCodeQr：2:扫码进入；3：不是
     * */ 
    //  微信扫码规则
    if (options.q !== undefined) {
      // wx.showLoading({
      //   title: '加载中请稍后',
      //   mask: true,
      //   duration: 2500
      // })
      let getScanCodeUrl = decodeURIComponent(options.q);
      console.log('getScanCodeUrl:', getScanCodeUrl);
      let uid = tool.sendUrlToParams(getScanCodeUrl, 'uid');
      let isScanCodeQr = tool.sendUrlToParams(getScanCodeUrl, 'isScanCodeQr');
      let type = tool.sendUrlToParams(getScanCodeUrl, 'type');

      // 扫码进入
      that.setData({
        lineTypeId: type,
        agencyId: uid,
        isScanCodeQr: isScanCodeQr
      });
      wx.setStorageSync('lineTypeId', that.data.lineTypeId)
      wx.setStorageSync('agencyId', that.data.agencyId)
      wx.setStorageSync('isScanCodeQr', that.data.isScanCodeQr)
      that.showPopup();
      this.getLists('1', '1');

      console.log('微信扫描进入isScanCodeQr 1:', that.data.isScanCodeQr);
      that.data.timeOutTimer = setTimeout(()=> {
        // 三秒内没有操作默认执行游客登录
        console.log('timeOutTimer');
        that.travelLogin();
      }, 2000);
    } else {
      wx.showLoading({
        title: '加载中请稍后',
        mask: true,
      })
      let optionsData = options;
      console.log('optionsData:', optionsData);
      wx.removeStorageSync('isScanCodeQr')
      if (optionsData.isShareOpen == '2') {
        // 转发进入
        if (optionsData.userType == '2') {
          // 销售员
          that.setData({
            userType: '2',
            salesmanId: optionsData.salesmanId
          })
          globalInfo.userType = '2'
        }
        if (wx.getStorageSync('lineTypeId') || optionsData.lineTypeId) {
          that.setData({
            lineTypeId: optionsData.lineTypeId ? optionsData.lineTypeId : wx.getStorageSync('lineTypeId'),
            agencyId: optionsData.agencyId ? optionsData.agencyId : wx.getStorageSync('agencyId'),
            isScanCodeQr: '2',
            isShareOpen: '2'
          });
          wx.setStorageSync('isShareOpen', '2')
        }

      } else{
        console.log('小程序内扫描二维进入');
        console.log('optionsData:', optionsData);
        console.log("wx.getStorageSync('userId'):", wx.getStorageSync('userId'));
        if (wx.getStorageSync('lineTypeId') || optionsData.lineTypeId) {
          that.setData({
            lineTypeId: optionsData.lineTypeId ? optionsData.lineTypeId : wx.getStorageSync('lineTypeId'),
            agencyId: optionsData.agencyId ? optionsData.agencyId : wx.getStorageSync('agencyId'),
            isScanCodeQr: '3',
            isShareOpen: '3',
            salesmanId: wx.getStorageSync('userId') ? wx.getStorageSync('userId') :''
          });
        }
      }
      
      console.log('小程序内扫描进入isScanCodeQr 2:', that.data.isScanCodeQr);
      this.getLists('1', '1');
    }
  
    
    // this.setData({
    //   qrURLSave: wx.getStorageSync('qrCodeInfo')
    // })
    /**
     * 二维码规则
     * https://xcx.fxly5166.com/api/service?uid=13&type=1&isScanCodeQr=2
     * @param {String} uid 用户id（只有旅行社有：agencyId）
     * @param {String} type 线路类型 1、2、3、4
     * @param {String} isScanCodeQr 固定标识：2
     * 
     * */
   
    that.setData({
      qrUrlText: config.api_blinl_ip +  "api/service?uid=" + that.data.agencyId +"&type="+that.data.lineTypeId+"&isScanCodeQr=2"
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
    that.setData({
      userType: globalInfo.userType
    })
    if (that.data.userType == '2') {
      // wx.hideShareMenu()
    }
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
    console.log('itinerary onShow')
    // this.getLists('1', '1');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('itinerary onHide')

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
    let that =this;
    console.log('itinerary onUnload')
    // if (that.data.userType == '2') {
    //   wx.redirectTo({
    //     url: '/pages/salesmanIndex/salesmanIndex'
    //   })
    // } else if (that.data.userType == '1'){
    //   wx.redirectTo({
    //     url: '/pages/travelHome/travelHome',
    //   })
    // }
    // + that.data.lineTypeId + '&agencyId=' + that.data.agencyId
    // if (that.data.isShareOpen != '2' && that.data.isScanCodeQr != '2') {
    //   wx.redirectTo({
    //     url: '/pages/travelHome/travelHome?agencyId=' + that.data.agencyId,
    //   })
    // }


  },
  getLists(nowPage, refreshType) {
    /**
     * @param {String} refreshType 1:下拉刷新；2：上拉加载更多
     * @param {String} nowPage 当前页吗
    */
    let that = this;
    let params = {
      "cmd": "RouteList",
      "uid": that.data.agencyId,
      "cid": that.data.lineTypeId,
      "nowPage": nowPage,
      "pageCount": that.data.pageCount
    };

    http.postD(params)
      .then((res) => {
        console.log('res:', res);
        if (res.data.result == '0') {
          that.setData({
            totalPage: res.data.totalPage,
            title: res.data.datastr
          })
          if (res.data.dataList) {
            if (refreshType == '1') {
              that.setData({
                list: res.data.dataList
              })
              console.log('dataList', that.data.list);
              let listA = that.data.list;
              let len = listA.length, i = 0;
              for (i; i < len; i++) {
                // console.log();
                listA[i].introduce = util.moreLineEllipsis(listA[i].introduce, '36')
              }
              that.setData({
                newList: listA
              })
              // 隐藏导航栏加载框
              wx.hideNavigationBarLoading();
              // 停止下拉动作
              wx.stopPullDownRefresh();
            } else if (refreshType == '2') {
              let oldLists = that.data.list;
              
              that.setData({
                list: oldLists.concat(res.data.dataList)
              })
              // 防止多出文字溢出
              let listA = that.data.list;
              let len = listA.length, i = 0;
              for (i; i < len; i++) {
                // console.log();
                listA[i].introduce = util.moreLineEllipsis(listA[i].introduce, '36')
              }
              that.setData({
                newList: listA
              })
              // 隐藏上拉加载框
              wx.hideLoading();
            }
            
          } else {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
            // 隐藏上拉加载框
            wx.hideLoading();
          }
          wx.hideLoading();
        } else {
          // 隐藏导航栏加载框
          wx.hideNavigationBarLoading();
          // 停止下拉动作
          wx.stopPullDownRefresh();
          // 隐藏上拉加载框
          wx.hideLoading();
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none'
          })
        }
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getLists('1', '1');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '拼命加载中...',
    })
    const nowPageCur = this.data.nowPage + 1;
    if (Number(this.data.totalPage) >= Number(nowPageCur)) {
      this.setData({
        nowPage: nowPageCur
      });
      this.getLists(nowPageCur, '2');
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }
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
    let shareUrl;
    console.log('列表转发that.data.userType：', that.data.userType);
    if (that.data.userType == '2') {
      shareUrl = '/pages/routerList/itinerary?lineTypeId=' + that.data.lineTypeId + '&agencyId=' + that.data.agencyId + '&isShareOpen=2&salesmanId=' + that.data.salesmanId + '&userType=2'
    } else {
      shareUrl = '/pages/routerList/itinerary?lineTypeId=' + that.data.lineTypeId + '&agencyId=' + that.data.agencyId + '&isShareOpen=2'
    }
    console.log('shareUrlshareUrlshareUrl:', shareUrl);
    return {
      title: that.data.title, // pages/routeDetail/routeDetail
      path: shareUrl,  // 路径，传递参数到指定页面。
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