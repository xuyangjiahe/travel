// pages/travelList/travelList.js
const HTTP = require('../../utils/http-list.js');
const http = new HTTP();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    lineTypeId:'',
    agencyId: '',
    nowPage: 1, 
    pageCount: 10,
    totalPage: '', // 总页数
  },
  toSeeOrderDetail(event) {
    console.log(event);
    let that = this;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderId=' + event.currentTarget.dataset.orderid + '&agencyId=' + that.data.agencyId + '&listTitile=' + event.currentTarget.dataset.listtitle,
      // url: '/pages/orderDetailShare/orderDetailShare?orderId=' + event.currentTarget.dataset.orderid + '&agencyId=' + that.data.agencyId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.hideShareMenu()
    that.setData({
      agencyId: wx.getStorageSync('agencyId')
    });
    this.getLists('1', '1');
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

  getLists(nowPage, refreshType) {
    /**
     * @param {String} refreshType 1:下拉刷新；2：上拉加载更多
     * @param {String} nowPage 当前页吗
    */
    let that = this;
    let params = {
      "cmd": "confirmsList",
      "uid": that.data.agencyId,
      "nowPage": nowPage,
      "pageCount": that.data.pageCount
    };
    /**
     * "result": "0",
    "resultNote": "成功",
    "totalPage":""//总页数
    "dataList":[{
       "cid":""//确认单id
       "title":""//确认单标题
     }]
     * 
    */

    http.postD(params)
      .then((res) => {
        if (res.data.result == '0') {
          that.setData({
            totalPage: res.data.totalPage
          })
          
          if (res.data.dataList) {
            if (refreshType === '1') {
              that.setData({
                lists: res.data.dataList
              })
              // 隐藏导航栏加载框
              wx.hideNavigationBarLoading();
              // 停止下拉动作
              wx.stopPullDownRefresh();
            } else if (refreshType === '2') {
              let oldLists = that.data.list;
              that.setData({
                lists: oldLists.concat(res.data.dataList)
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
    if (Number(this.data.totalPage) >= Number(nowPageCur) ) {
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
  onShareAppMessage: function () {

  }
})