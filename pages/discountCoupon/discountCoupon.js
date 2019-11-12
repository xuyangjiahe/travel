// pages/ discountCoupon/ discountCoupon.js
const HTTP = require('../../utils/http-list.js');
const http = new HTTP();
const config = require("../../config.js");
let app = getApp();
let globalInfo = app.globalData;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    visterInfo: {},
    discountBgUrl: config.api_blink_base_url + '/userfiles/count-bg.png',
    locationBgUrl: '../../images/count-bg.png',
    systemInfo: {},
    poster: '', // 合成海报地址
    locationHeadUrl:'', //下载的头像本地路径
    logoUrl: '../../images/icon1.png'
  },
  
  getServerFun() {
    let that = this;
    let params = {
      "cmd": "touristmessage",
      "uid": that.data.userId
    };

    http.postD(params).then((res) => {
      if (res.data.result == '0') {
        that.setData({
          visterInfo: res.data.dataobject
        })
        
        // wx.downloadFile({
        //   url: that.data.visterInfo.thridsicon,
        //   // url: imgSrc,
        //   success: function (locationHeadUrlres) {
        //     console.log('locationHeadUrlres:', locationHeadUrlres);
            
        //     //图片保存到本地
        //     // this.data.discountBgUrl
        //     that.setData({
        //       locationHeadUrl: locationHeadUrlres.tempFilePath
        //     })

            
        //   }
        // })
      } else {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none'
        })
      }
    })
  },
  getBackIndePage() {
    wx.redirectTo({
      url: '/pages/salesmanIndex/salesmanIndex?userType=3',
    })
  },
  saveImg() {
    // 保存图片 获取相册权限
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              console.log('that.data.poster');
              that.firstGetHeadUrl();
            }
          })
        } else {
          
          that.firstGetHeadUrl();
        }
      }
    })
  },


  firstGetHeadUrl() {
    let that = this;
    // wx.getUserInfo({
    //   success: res => {
        // console.log("userInfouserInfo ", res.userInfo)

        wx.downloadFile({
          url: that.data.visterInfo.thridsicon, //仅为示例，并非真实的资源 // https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV07WOuzNCBiaGsSl5Q3CQWOnia6q9bE2zUrWIhCSOunzuLb8Z4OM3PTiazW4aAYMyrCupVbQr8JP2g/132
          success: (downloadFileRes) => {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            // wx.showModal({
            //   title: 'downloadFileRes',
            //   content: JSON.stringify(downloadFileRes),
            // })
            console.log('downloadFileRes:', downloadFileRes);
            if (downloadFileRes.statusCode === 200) {
              that.setData({
                locationHeadUrl: downloadFileRes.tempFilePath
              })
              that.drawImagefun(downloadFileRes.tempFilePath)
            }
          }
        })
    //   }
    // })
  },

  drawImagefun(locationHeadUrl) {
    let that = this;
    let ctx = wx.createCanvasContext('canvasPoster', this)

    // let canvasW = 773 // 画布的真实宽度
    // let canvasH = 1341 //画布的真实高度
    let canvasW = this.data.systemInfo.screenWidth // 画布的真实宽度
    let canvasH = this.data.systemInfo.screenHeight //画布的真实高度
    // 头像和二维码大小都需要在规定大小的基础上放大像素比的比例后面都会 *this.systemInfo.pixelRatio
    let headerW = 48 * this.data.systemInfo.pixelRatio
    let headerX = (canvasW - headerW) / 2
    let headerY = 40 * this.data.systemInfo.pixelRatio
    let qrcodeW = 73 * this.data.systemInfo.pixelRatio
    let qrcodeX = 216 * this.data.systemInfo.pixelRatio
    let qrcodeY = 400 * this.data.systemInfo.pixelRatio
    // 填充背景
    ctx.drawImage(that.data.locationBgUrl, 0, 0, canvasW*2, canvasH*2)
    ctx.save()
    // 控制头像为圆形
    // ctx.setStrokeStyle('rgba(0,0,0,.2)') //设置线条颜色，如果不设置默认是黑色，头像四周会出现黑边框
    // ctx.arc(headerX + headerW / 2, headerY + headerW / 2, headerW / 2, 0, 2 * Math.PI)
    // ctx.stroke()
    //画完之后执行clip()方法，否则不会出现圆形效果
    // ctx.clip()
    // 将头像画到画布上
    var name = this.data.visterInfo.thridsname;
    //绘制名字
    ctx.setFontSize(26);
    ctx.setFillStyle('#fff');
    ctx.setTextAlign('left');
    ctx.fillText(name, 152, 200);
    ctx.stroke();
    // 绘制账号
    var phone = this.data.visterInfo.phone;
    //绘制名字
    ctx.setFontSize(22);
    ctx.setFillStyle('#fff');
    ctx.setTextAlign('left');
    ctx.fillText(phone, 152, 228);
    ctx.stroke();
    // 绘制头像 http://tmp/wx0ba96f4a1539fbd8.o6zAJs1B8BUcYzW-usej…qOltMolRxYofa97f2c3400f2f04dc93b40e09499459d.jpeg
    console.log('this.data.locationHeadUrl', that.data.locationHeadUrl);
    // ctx.drawImage(this.data.logoUrl, 30,70,50,50)
    // wx.showModal({
    //   title: 'that.data.locationHeadUrl drawImage',
    //   content: locationHeadUrl,
    // })
    ctx.drawImage(locationHeadUrl, 58, 170, 70, 70)
    // 绘制logo
    ctx.drawImage(that.data.logoUrl, canvasW  - 60, canvasH*2 -70, 24, 24);
    
    ctx.setFontSize(16);
    ctx.setFillStyle('#333');
    ctx.setTextAlign('left');
    ctx.fillText('遨游视界', canvasW  - 30, canvasH*2 - 50);
    ctx.stroke();
    // ctx.restore()
    
    // 绘制二维码
    // ctx.drawImage(this.shareInfo.qrcode, qrcodeX, qrcodeY, qrcodeW, qrcodeW)
    ctx.save()
    ctx.draw()
    setTimeout(() => {
      //下面的13以及减26推测是因为在写样式的时候写了固定的zoom: 50%而没有用像素比缩放导致的黑边，所以在生成时进行了适当的缩小生成，这个大家可以自行尝试
      wx.canvasToTempFilePath({
        canvasId: 'canvasPoster',
        x: 13,
        y: 13,
        width: canvasW * 2 - 26,
        height: canvasH * 2 - 26,
        destWidth: canvasW * 2 - 26,
        destHeight: canvasH * 2 - 26,
        fileType: 'png',
        success: (res) => {
          console.log('canvasToTempFilePath res:', res);
          this.setData({
            poster: res.tempFilePath
          })
          wx.saveImageToPhotosAlbum({
            filePath: that.data.poster,
            success: (data) => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail: (err) => {
              console.log('err:', err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("当初用户拒绝，再次发起授权")
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    } else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
              }
            },
            complete(res) {
              console.log("res2", res);
            }
          })
        }
      })
    }, 200)
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.hideShareMenu();
    this.setData({
      userId: wx.getStorageSync('userId')
    })
    this.getServerFun();
    // var 
    wx.getSystemInfo({
      success(res){
        // 通过像素比计算出画布的实际大小（330x490）是展示的出来的大小
        // this.width = 330 * res.pixelRatio
        // this.height = 490 * res.pixelRatio
        
        that.setData({
          systemInfo: res
        })
        
      }
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
    // 获取头像
    let that = this;
    // wx.getUserInfo({
    //   success: res => {
    //     console.log("userInfouserInfo ", res.userInfo)
       
    //     wx.downloadFile({
    //       url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源 // https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJV07WOuzNCBiaGsSl5Q3CQWOnia6q9bE2zUrWIhCSOunzuLb8Z4OM3PTiazW4aAYMyrCupVbQr8JP2g/132
    //       success: (downloadFileRes) => {
    //         // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //         console.log('downloadFileRes:', downloadFileRes);
    //         wx.showModal({
    //           title: 'downloadFileRes',
    //           content: JSON.stringify(downloadFileRes),
    //         })
    //         if (downloadFileRes.statusCode === 200) {

    //           that.setData({
    //             locationHeadUrl: downloadFileRes.tempFilePath
    //           })
    //           wx.showModal({
    //             title: 'locationHeadUrl',
    //             content: that.data.locationHeadUrl,
    //           })
              
    //         }
    //       }
    //     })
    //   }
    // })

    
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
    //   url: '/pages/salesmanIndex/salesmanIndex',
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