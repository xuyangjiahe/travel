
export default {
  unescape(html) {
    return html
      .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&ldquo;/g, '“')
      .replace(/&rdquo;/g, '”')
      .replace(/&amp;nbsp;/g, '')
      .replace(/&mdash;/g, '-')
      .replace(/&nbsp;/g, '')
      // .replace(/<img/g, '<img class="rich-img" ')
      .replace(/<img/g, '<img class="rich-img" style="display:block;width:100%;height:auto;box-sizing:border-box;margin-bottom:18rpx;margin-top:18rpx;object-fill:fill;"')
      // .replace(/<p/g, '<p style="font-size:30px;line-height: 40px;text-align: left;text-index:2em;height:40px;"margin-bottom:18px;')
      // .replace(/<h2/g, '<h2 style="font-size:30px;line-height: 40px;text-align: left;text-index:2em;height:40px;"margin-bottom:18px;')
      // .replace(/<h1/g, '<h1 style="font-size:30px;line-height: 40px;text-align: left;text-index:2em;height:40px;"margin-bottom:18px;')
      // .replace(/src="/g, 'src="http://106.14.132.113/')
      //  data:image/jpeg;base64,
      
      // .replace(/&amp;/g, '')
      // .replace(/%C2%A0/g, '%20')
      // eslint-disable-next-line no-useless-escape
      .replace(/&#39;/g, "\'");
  },
  iframeInfo(isShowIfram, isShowTitle, iframTitle, iframTip, iframTtn, comIframErrNum = {}, $this) {
    /**
   * isShowIfram 是否显示弹窗
   * isShowTitle 是否显示标题
   * iframTitle 标题文字
   * iframTip 提示文字
   * iframTtn btn按钮文字
   * iframNum 金额，数量等
   * iframErrNum: 返回的错误参数，根据错误参数不同跳转不同的页面
   * $this 当前vue对象
  */
    // 修改弹窗信息
    console.log('修改弹窗信息')
    // $this.isShowComIfram = isShowComIfram;
    // that.isShowIfram = true,
    $this.$store.commit(
      'setIsComIfram',
      {
        'isShowIfram': isShowIfram,
        'isShowTitle': isShowTitle,
        'iframTitle': iframTitle,
        'iframTip': iframTip,
        'iframTtn': iframTtn,
        'comIframErrNum': comIframErrNum
      }
    );
    // $this.conInfo = conInfo;
    // $this.comIframErrNum = comIframErrNum;
  },
  getUrlParams (name) {
    // 获取url中参数
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  },
  sendUrlToParams(url, name) {
    /**
     * @param {String} url 非当前页面url，当时一定包含“？”；
     * @param {String} nane 获取的对应参数名
     * 
    */
    var searchInfo = url.split('?')[1];
    console.log('searchInfo:', searchInfo);
    console.log('name:', name);
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    console.log('reg:', reg);
    var r = searchInfo.match(reg);
    if (r != null) return unescape(r[2]); return null;
  },
  getIsWxClient () {
    /**
     * 判断是否是微信环境
     */
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    }
    return false;
  },
  wxLoginFun (appId, url) {
    // 微信授权登录网页版
    /***
     * @param redirectUrl = encodeURIComponent(url)授权后重定向的回调链接地址，并把字符串编码为 URI 组件。
     * 2、windows.location.href="/url" 当前页面打开URL页面
     * @param appid 公众号的唯一标识（必填）
     * @param redirect_uri 授权后重定向的回调链接地址， 请使用 urlEncode 对链接进行处理（必填）
     * @param response_type  返回类型，请填写code（必填）
     * @param scope 应用授权作用域，1、snsapi_base（静默登录，不弹出授权页面，直接跳转，只能获取用户openid），  2、snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息 ）（必填）
      * @param state 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节（非必填）
      * @param #wechat_redirect无论直接打开还是做页面302重定向时候，必须带此参数（必填）

      1、第一个参数用？号隔开，之后的参数用&隔开，最后的#wechat_redirect不用加&
      2、open.weixin.qq.com/connect/oauth2/authorize 微信默认地址
      3、文档地址：https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
    */
    var redirectUrl = encodeURIComponent(url);

    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATUS#wechat_redirect`;
  },
  downloadIamge(imgsrc, name) { // 下载图片地址和图片名
    // 非同源图片下载 电脑端可以使用移动端无法下载 移动端需要使用mui
    var image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height);
      var url = canvas.toDataURL('image/png'); // 得到图片的base64编码数据

      var a = document.createElement('a'); // 生成一个a元素
      var event = new MouseEvent('click'); // 创建一个单击事件
      a.download = name || 'photo'; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
  },
  downs(shoppicUrl) {
    // 同源图片下载
    var alink = document.createElement('a');
    alink.href = shoppicUrl;
    alink.download = 'pic'; // 图片名
    alink.click();
  },
  getGoodsPayPrice(price1, price2) {
    /**
     * 二进制价钱相减 浮点类型数据会存在差异
     * @param [Number] price1价钱
    */
    var oldPrice = Number(price1) * 100;
    var newPrice = Number(price2) * 100;
    var spreadPrice;
    spreadPrice = ((oldPrice - newPrice) / 100).toFixed(2);
    // debugger
    return spreadPrice
  },
  getCurTime(days) {
    // days :多少天
    let date = new Date();
    // var seperator1 = "年";
    // var seperator2 = "月";
    // var seperator3 = "日";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate() + Number(days);
    if (strDate > 30) {
      month = month + Math.floor(strDate / 30);
      strDate = strDate % 30;
      if (month > 12) {
        year = year + Math.floor(month / 12);
        month = month % 12;
      }
    }
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    var currentdate = year + '年' + month + '月' + strDate + '日';
    return currentdate;
  },
  getScrollTopVal() {
    // 获取滚动条距离顶部位置（卷进去）
    var ScrollTopVal = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    return ScrollTopVal
  }
}
