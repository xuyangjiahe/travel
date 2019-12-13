// pages/routeDetail/routeDetail.js
// 富文本解析
var WxParse = require('../../wxParse/wxParse.js');
// var article = '<div>我是HTML代码</div>';
// var that = this;
// WxParse.wxParse('article', 'html', article, that, 5);
const config = require("../../config.js");
import tool from '../../utils/utils.js';
const HTTP = require('../../utils/http-list.js');
const http = new HTTP();
// 地图定位
const map = require('../../utils/map.js');
// 生成二维码 第一种 手机端生成的二维码不清晰
// import QRCode from '../../utils/weapp-qrcode.js';
var qrcode;
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;
// 300rpx 在6s上为 150px
const code_w = 300 / rate;
// 第二种
import SQRCode from '../../utils/qrcode.js';

let app = getApp();
let globalInfo = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    showQr: false,
    show: false,
    isautoplay: true,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    lineId: '', // 线路id
    lineTypeId: '', // 线路类型
    salesmanId: '',// 销售员id
    cityData: '', // 定位城市
    salesInfo: {}, // 销售员信息
    lineInfo: {}, // 线路信息
    videoUrl: '',
    playTimes: '', // 播放量
    userType: '', // 用户类型 1：旅行社；2：销售员；3：游客
    isShareOpen: '2', // 默认2：不显示 3：显示
    shareUrl: '',
    content: '', // 详细行程
    richImgLists: [], // 富文本为图片时
    richTextType: '', // "htype": ""//详细行程类型 1富文本 2长图
    code_w: code_w, // 二维码尺寸
    qrURLSave: '',
    title: '',
    qrUrlText: '',
    introduce: '',//行程特色
    isScanCodeQr: '',
    switerimgHeight: '',
    playBtn: false, // 播放按钮
    agencyId:'', // 旅行社id
    isVideoPlayEnd: false, // 视频是否播放完成
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
  
  getLineDetailAgain(lineId, cityData, salesmanId ) {
    // 增加播放次数：
    let that = this;
    let params = {
      "cmd": "routedetail",
      "rid": lineId,
      "province": cityData,
      "saleid": salesmanId // 选填
    };

    http.postD(params)
      .then((res) => {
        if (res.data.result == '0') {
          let resData = res.data;
          that.setData({
            playTimes: resData.datanum ? resData.datanum : 0,
          })
          console.log('videoUrl: ', that.data.videoUrl);
        } else {
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none'
          })
        }
      })
      .catch((res) => {

      })
  },
  // 获取地理坐标并转化
  
  getLineDetail(lineId, cityData, salesmanId ) {
    // 请求 {"cmd":"routedetail","rid":"efe6534b184a461880acbe72107670a9","province":"河南省","saleid":"5b9bb42f238c46da851ad4b70599cd9a"} ?lineId=' + that.data.lineId + '&isShareOpen=2&salesmanId=' + that.data.salesmanId + '&lineTypeId=' + that.data.lineTypeId,
   
    let that = this;
    let params = {
      "cmd": "routedetail",
      "rid": lineId,
      "province": cityData,
      "saleid": salesmanId // 选填
    };
   
   /**
    * "htype":""//详细行程类型 1富文本 2长图
       "content":""//详细行程(富文本内容)
       "images":["",""]//详细行程长图数组
   */
    http.postD(params)
    .then((res) => {
      // console.log('routerdetail res', res);
      
      if (res.data.result == '0') {
        let resData = res.data;
        that.setData({
          playTimes: resData.datanum ? resData.datanum : 0,
          videoUrl: resData.datastr
        })
        console.log('videoUrl: ', that.data.videoUrl);
        let dataobjects = resData.dataobjects; // 销售员信息
        let dataobject = resData.dataobject; // 线路详情
        if (dataobjects) {
          that.setData({
            salesInfo: dataobjects
          })
        }

        if (dataobject) {
          that.setData({
            lineInfo: dataobject,
            // content: tool.unescape(res.data.dataobject.content),
            introduce: tool.unescape(dataobject.introduce) // 特色
          })
        }

        if (dataobject.htype === '2') {
          // 长图
          that.setData({
            richImgLists: dataobject.images,
            richTextType: '2'
          })
        } else {
          // 普通富文本
          that.setData({
            richTextType: '1'
          })
          var article = dataobject.content;
          WxParse.wxParse('article', 'html', article, that, 16);
        }
        
        
        // setTimeout(() => {
        //   that.setData({
        //     playTimes: res.data.datanum ? res.data.datanum : 0,
        //     videoUrl: res.data.datastr
        //   })
        //   console.log('videoUrl: ', that.data.videoUrl);
        // }, 500)
        // 隐藏遮罩层
        wx.hideLoading();
      } else {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none'
        })
      }
    })
    .catch((res) => {
      
    })
  },
  callPhone() {
    // 打电话
    wx.makePhoneCall({
      phoneNumber: this.data.salesInfo.phone
    })
  },
 
  getBackIndePage() {
    let that =this;
    wx.setStorageSync('lineTypeId', that.data.lineTypeId)
    wx.redirectTo({
      url: '/pages/routerList/itinerary?typeId=' + that.data.lineTypeId,
    })
    // wx.navigateBack({
    //   delta: 0
    // })
  },
  getBacHhome() {
    
    let that = this;
   
    if (that.data.isScanCodeQr == '2') {
      // 扫码进入
      wx.clearStorageSync();
      wx.redirectTo({
        url: '/pages/index/index',
      })
    } else {
      wx.setStorageSync('isShareOpen', '3');
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
   
  },
  makeQrCode() {
    // 此方法绘制的二维码手机上展示不完整
    let that = this;
    console.log('qrUrlText:', that.data.qrUrlText);
    qrcode = new QRCode('myQrcode', {
      text: that.data.qrUrlText, 
      width: code_w,
      height: code_w,
      padding: 12, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.H, // 二维码可辨识度
      callback: (res) => {
        // console.log(res.path)
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
  saveQrCode() {
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
              if (res.authSetting['scope.userInfo']) {
                console.log('授权成功')
                console.log('that.data.qrURLSave:', that.data.qrURLSave);
                wx.saveImageToPhotosAlbum({
                  filePath: that.data.qrURLSave,
                  success(saveRes) {
                    that.setData({ showQr: false });
                    wx.showToast({
                      title: '已保存至相册',
                      icon: 'success',
                      duration: 2000
                    })
                  }
                })
                // wx.downloadFile({ // 网路文件需要先下载
                //   url: that.data.qrURLSave, //仅为示例，并非真实的资源
                //   success(res) {
                //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                //     if (res.statusCode === 200) {
                //       wx.saveImageToPhotosAlbum({
                //         filePath: res.tempFilePath,
                //         success(saveRes) {
                //           that.setData({ show: false });
                //           wx.showToast({
                //             title: '已保存至相册',
                //           })
                //         }
                //       })
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

  /**
   *  开发word文档；后台传入文档名称；
   *  第一种：使用web-view；跳转 页面
   *  第二种：使用wx.openDocument() 直接打开文档
   * */ 
  toSeeFileDetai(paramData) {
     let that = this;
    console.log('paramData');
    console.log(paramData);
    if (paramData && paramData.id) {
      wx.navigateTo({
        url: '/pages/outPage/outPage?paramData=' + paramData.id
      })
     } else {
      wx.navigateTo({
        url: '/pages/outPage/outPage?paramData=123.htm'
      })
     }
     
   },
  // 图片点击放大 
  previewImg: function (e) {
    console.log('previewImg e:', e);
    var src = e.currentTarget.dataset.src;//获取data-src  循环单个图片链接
    var imgList = e.currentTarget.dataset.effect_pic;//获取data-effect_pic   图片列表
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  saleLogin(e) {
    // 销售员登录
    let that = this;
     // 清除定时器
     that.setData({
      timeOutTimer: null
    })
    console.log('e', e)
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
                      
                      // "iswanshan": "是否完善信息 0未完善 1已完善"
                      if (resverRes.data.iswanshan === '1') {
                        if (userType == '2') {
                          // 销售员
                          that.getLineDetail(that.data.lineId, that.data.cityData, resverRes.data.uid);
                          that.setData({
                            salesmanId: resverRes.data.uid,
                          })
                        } else {
                          that.getLineDetail(that.data.lineId, that.data.cityData);
                        }
                        // 关闭弹窗
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
                          // this.showPopup();
                        } else {
                          that.getLineDetail(that.data.lineId, that.data.cityData);
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
     
    } else if (userType == '3') {
      serverUrl = '/api/touristlogin';
      
    }

  },

  travelLogin(e) {
    // 游客登录
    let that = this;
    // 清除定时器
    that.setData({
      timeOutTimer: null
    })
    // that.setData({
    //   userType: '3'
    // })
    // globalInfo.userType = '3';
    // wx.setStorageSync('userType', '3');
    // this.impowerFun('3', e.detail.userInfo);

    // 2019-12-13游客进入详情页面假授权
    if (globalInfo.userType == '2') {
      that.getLineDetail(that.data.lineId, that.data.cityData, that.data.salesmanId);
    } else {
      that.getLineDetail(that.data.lineId, that.data.cityData);
    }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad options:', options);
    
    let that = this
    
    // 系统信息的高度
    // salesmanId // 销售员
    // https://lvyou.cxzjzg.com/tourismprogram/api/service1?lineId=efe6534b184a461880acbe72107670a9&isScanCodeQr=2&salesmanId=5b9bb42f238c46da851ad4b70599cd9a&lineTypeId=1&province=河南省&userType=2,

    /**
     * 二维码携带参数
     * @param {String} isScanCodeQr：2:扫码进入；3：不是
     * @param {String} lineId：路线id
     * @param {String} province：城市
     * @param {String} salesmanId：销售员id  有的话就携带，没有就undefined
     * @param {String} lineTypeId:线路类型id
     * @param {String} userType: 用户类型
    */
    console.log('optionsoptionsoptionsoptionsoptionsoptions', options);
    console.log('that.data.userType:', that.data.userType);
    console.log('that.data.userType:', that.data.userType);
    console.log('that.data.userTypeglobalInfo.userType', globalInfo.userType)

    if (options.q !== undefined) {
      // 扫码进入
      let getScanCodeUrl = decodeURIComponent(options.q);
      console.log('getScanCodeUrl:', getScanCodeUrl);
      let lineId = tool.sendUrlToParams(getScanCodeUrl, 'lineId');
      let isScanCodeQr = tool.sendUrlToParams(getScanCodeUrl, 'isScanCodeQr');
      let province = tool.sendUrlToParams(getScanCodeUrl, 'province');
      let salesmanId = tool.sendUrlToParams(getScanCodeUrl, 'salesmanId');
      let lineTypeId = tool.sendUrlToParams(getScanCodeUrl, 'lineTypeId');
      let userType = tool.sendUrlToParams(getScanCodeUrl, 'userType');

      that.setData({
        lineId: lineId,
        isShareOpen: '2', // 分享，扫码的不显示分享二维码
        lineTypeId: lineTypeId,
        userType: userType,
        cityData: province,
        isScanCodeQr: isScanCodeQr
      })
     // 可能没有销售员信息
      if (salesmanId) {
        that.setData({
          salesmanId: salesmanId,
        })
        // that.getLineDetail(that.data.lineId, that.data.cityData, that.data.salesmanId);
        
      } else {
        that.setData({
          salesmanId: '',
        })
        // that.getLineDetail(that.data.lineId, that.data.cityData);
      }
      that.showPopup();
      that.data.timeOutTimer = setTimeout(()=> {
        // 三秒内没有操作默认执行游客登录
        console.log('timeOutTimer');
        that.travelLogin();
      }, 3000);
      
    } else {
      // 非扫普通二维码进入
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      var optionsData = options;
      console.log('非扫普通二维码进入optionsData:', optionsData);
      if (wx.getStorageSync('isShareOpen') == '2' || optionsData.isShareOpen == '2') {
        // 转发进入
        that.setData({
          isShareOpen: '2',
          isScanCodeQr: '2'
        })
      } else {
        if (optionsData.isShareOpen) {
          that.setData({
            isShareOpen: optionsData.isShareOpen,
          })
        }
      }
      if (wx.getStorageSync('isScanCodeQr') == '2') {
        that.setData({
          isScanCodeQr: wx.getStorageSync('isScanCodeQr'),
        })
      } else {
        wx.removeStorageSync('isScanCodeQr');
      }
     
      if (optionsData.lineId) {
        that.setData({
          lineId: optionsData.lineId,
        })
      }
      
      if (optionsData.salesmanId) {
        that.setData({
          salesmanId: optionsData.salesmanId,
        })
      }
      if (optionsData.lineTypeId) {
        that.setData({
          lineTypeId: optionsData.lineTypeId
        })
      }
      if (optionsData.userType) {
        that.setData({
          userType: optionsData.userType
        })
      }
      // 存储旅行社信息返回键使用
        that.setData({
          agencyId: optionsData.agencyId ? optionsData.agencyId : wx.getStorageSync('agencyId')
        })
      
      
      console.log('isShareOpenisShareOpen:', that.data.isShareOpen); // userType
      
      wx.login({
        success: () => {
          wx.getSetting({
            success: (res1) => {
              console.log('getSetting res1', res1);
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  console.log('地理位置res', res);
                  map.getAddress(res.latitude, res.longitude, (successRes) => {
                    console.log('successRes:', successRes);
                    that.setData({
                      cityData: successRes.result.ad_info.province
                    })
                    console.log('globalInfo.userTypeglobalInfo.userTypeglobalInfo.userType', globalInfo.userType)
                    if (optionsData.isShareOpen == '2') {
                      // 右上角分享进入

                      if (that.data.userType == '2') {
                        // 销售员
                        that.setData({
                          userType: '2',
                          lineId: wx.getStorageSync('lineId') ? wx.getStorageSync('lineId') : that.data.lineId,
                          isShareOpen: wx.getStorageSync('isShareOpen') ? wx.getStorageSync('isShareOpen') : that.data.isShareOpen,
                          salesmanId: wx.getStorageSync('userId') ? wx.getStorageSync('userId') : that.data.salesmanId,
                          lineTypeId: wx.getStorageSync('lineTypeId') ? wx.getStorageSync('lineTypeId') : that.data.lineId
                        })
                        that.getLineDetail(that.data.lineId, successRes.result.ad_info.province, that.data.salesmanId);
                        // 二维合成内容
                        that.setData({
                          qrUrlText: config.api_blinl_ip +  "api/service1?lineId=" + that.data.lineId + "&isScanCodeQr=2&salesmanId=" + that.data.salesmanId + "&lineTypeId=" + that.data.lineId + "&province=" + that.data.cityData + "&userType=" + that.data.userType
                        })
                      } else {
                        // 旅行社
                        // this.getLocationFun(wx.getStorageSync('lineId'));
                        that.setData({
                          userType: '1',
                          lineId: wx.getStorageSync('lineId') ? wx.getStorageSync('lineId') : that.data.lineId,
                          isShareOpen: wx.getStorageSync('isShareOpen') ? wx.getStorageSync('isShareOpen') : that.data.isShareOpen,
                          lineTypeId: wx.getStorageSync('lineTypeId') ? wx.getStorageSync('lineTypeId') : that.data.lineId
                        })
                        that.getLineDetail(that.data.lineId, successRes.result.ad_info.province);
                        // 旅行社没有销售员信息，不用传假销售员salesmanId
                        that.setData({
                          qrUrlText: config.api_blinl_ip + "api/service1?lineId=" + that.data.lineId + "&isScanCodeQr=2" + "&lineTypeId=" + that.data.lineId + "&province=" + that.data.cityData + "&userType=1"
                        })
                      }

                    } else {

                      if (globalInfo.userType == '2') {
                        // 销售员
                        that.setData({
                          userType: '2',
                          lineId: wx.getStorageSync('lineId') ? wx.getStorageSync('lineId') : that.data.lineId,
                          isShareOpen: wx.getStorageSync('isShareOpen') ? wx.getStorageSync('isShareOpen') : that.data.isShareOpen,
                          salesmanId: wx.getStorageSync('userId') ? wx.getStorageSync('userId') : that.data.salesmanId,
                          lineTypeId: wx.getStorageSync('lineTypeId') ? wx.getStorageSync('lineTypeId') : that.data.lineId
                        })
                        that.getLineDetail(that.data.lineId, successRes.result.ad_info.province, that.data.salesmanId);
                        // 二维合成内容
                        that.setData({
                          qrUrlText: config.api_blinl_ip + "api/service1?lineId=" + that.data.lineId + "&isScanCodeQr=2&salesmanId=" + that.data.salesmanId + "&lineTypeId=" + that.data.lineId + "&province=" + that.data.cityData + "&userType=" + that.data.userType
                        })
                      } else {
                        // 旅行社
                        // this.getLocationFun(wx.getStorageSync('lineId'));
                        that.setData({
                          userType: '1',
                          lineId: wx.getStorageSync('lineId') ? wx.getStorageSync('lineId') : that.data.lineId,
                          isShareOpen: wx.getStorageSync('isShareOpen') ? wx.getStorageSync('isShareOpen') : that.data.isShareOpen,
                          lineTypeId: wx.getStorageSync('lineTypeId') ? wx.getStorageSync('lineTypeId') : that.data.lineId
                        })
                        that.getLineDetail(that.data.lineId, successRes.result.ad_info.province);
                        // 旅行社没有销售员信息，不用传假销售员salesmanId
                        that.setData({
                          qrUrlText: config.api_blinl_ip + "api/service1?lineId=" + that.data.lineId + "&isScanCodeQr=2" + "&lineTypeId=" + that.data.lineId + "&province=" + that.data.cityData + "&userType=1"
                        })
                      }

                    }
                    
                  })
                }
              })

            }
          })
        }
      })
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
    console.log('isShareOpen', that.data.isShareOpen)
    // let pages = getCurrentPages();
    


  },
  imageLoad: function (e) {//获取图片真实宽度  
    console.log(e);
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    // var imgHeight = this.data.imgHeight;
    //把每一张图片的对应的高度记录到数组里  
    // imgHeight[e.target.dataset.id] = viewHeight;
    this.setData({
      switerimgHeight: viewHeight
    })
  },
  playVideoEnd(e) {
    console.log('视频播放完成：', e)
    let that = this;
    this.setData({
      playBtn: true,
      isVideoPlayEnd: true
    })
  },
  playVideoPause(e) {
    // 点击暂停
    let that = this;
    this.setData({
      playBtn: true
    })
    console.log('视频播放暂停完成：', e)
    // const playCon = wx.createVideoContext('myVideo', this);
    // playCon.pause();
  },
  playVideoPlay(e) {
    console.log('视频播放：', e);
    let that = this;
    // this.playVideoAgain();
    that.setData({
      playBtn: false
    })
    if (that.data.isVideoPlayEnd) {
      that.getLineDetailAgain(that.data.lineId, that.data.cityData, that.data.salesmanId);
      that.setData({
        isVideoPlayEnd: false
      })
    }
  },
  playVideoAgain(e) {
    console.log('播放视频');
    let that = this;
    const playCon = wx.createVideoContext('myVideo', this);
    playCon.play();
    that.setData({
      playBtn: false
    })
    if (that.data.isVideoPlayEnd) {
      that.getLineDetailAgain(that.data.lineId, that.data.cityData, that.data.salesmanId);
      that.setData({
        isVideoPlayEnd: false
      })
    }
    
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    console.log('onReady options:', options);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log('onShow options:', options);
    console.log('onShow  getCurrentPages', getCurrentPages());
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (options) {
    console.log('onHide options:', options);
    let that = this;
    if (that.data.isScanCodeQr == '2' || that.data.isShareOpen == '2') {
      wx.clearStorageSync();
      // this.onUnload();
      wx.removeStorageSync('lineId')
    } else {
      wx.removeStorageSync('lineId')
      // this.onUnload();
    }
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
    // wx.redirectTo({
    //   url: '/pages/routerList/itinerary'
    // })
    // 只有页面卸载了，才会才会再次走onload
    // wx.clearStorageSync();
    let that = this;
    wx.removeStorageSync('lineId')
    console.log('onUnload options', options);
    console.log('onUnload getCurrentPages', getCurrentPages());
    // isScanCodeQr != '2' || isShareOpen != '2'
    if (that.data.isShareOpen != '2' && that.data.isScanCodeQr != '2') {
      wx.redirectTo({
        url: '/pages/routerList/itinerary?lineTypeId=' + that.data.lineTypeId + '&agencyId=' + that.data.agencyId,
      })
    }
    // wx.navigateBack({
    //   delta: 1
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
  toSharePage() {
    // let that = this;
    // that.setData({
    //   shareUrl: 'https://www.baidu.com/'
    // })
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
    console.log('来自页面内转发按钮');
    console.log('path:', '/pages/routeDetail/routeDetail?lineId=' + that.data.lineId + '&isShareOpen=2&salesmanId=' + that.data.salesmanId + '&lineTypeId=' + that.data.lineTypeId + "&userType=" + that.data.userType);
    console.log('that.data.lineInfo:', that.data.lineInfo);
    return {
      title: that.data.lineInfo.name, // pages/routeDetail/routeDetail
      path: '/pages/routeDetail/routeDetail?lineId=' + that.data.lineId + '&isShareOpen=2&salesmanId=' + that.data.salesmanId + '&lineTypeId=' + that.data.lineTypeId + "&userType=" + that.data.userType,  // 路径，传递参数到指定页面。
      imageUrl: globalInfo.shareBgUrl, // 分享的封面图
      success: (res)=> {
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