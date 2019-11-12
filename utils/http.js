const config=require("../config.js");

const tips={
    1:'抱歉，出现了一个错误',
    2:'请先登录'
}

class HTTP{
    constructor(){
        this.baseUrl=config.api_blink_url
    }

    request({url,data={},method=1}){
        return new Promise((resolve,reject)=>{
            this._request(url,resolve,reject,data,method);
        })
    }

  requestCOmmon({ url, data = {}, method = 1 }){
      return new Promise((resolve, reject) => {
        this._requestCommon(url, resolve, reject, data, method);
      })
    }

    _request(url,resolve,reject,data={},method=1){
        let methods=method===2?"POST":'GET';
        wx.request({
            url: config.api_blink_url + "?json=" + JSON.stringify(data),
            data:"",
            dataType:"json",
            method:methods,
            header:{
                "Content-Type":"application/json"
            },
          // context.Response.Headers.Add("Accept-Ranges", "bytes");
          // context.Response.Headers.Add("ETag", HashUtil.QuickComputeHash(target));
            success:(res)=>{
                const code=res.statusCode.toString();
                if(code.startsWith("2")){
                    resolve(res);
                }
                else{
                    reject();
                    this._showErr(code)
                }
            },
            fail:(err)=>{
                reject();
                this._showErr(1)
            }
        })
    }

    // 正常
  _requestCommon(url, resolve, reject, data = {}, method = 1) {
    let methods = method === 2 ? "POST" : 'GET';
    wx.request({
      url: config.api_blink_base_url + url,
      data: data,
      dataType: "json",
      method: methods,
      header: {
        "Content-Type": "application/json"
      },
      success: (res) => {
        const code = res.statusCode.toString();
        if (code.startsWith("2")) {
          resolve(res);
        }
        else {
          reject();
          this._showErr(code)
        }
      },
      fail: (err) => {
        reject();
        this._showErr(1)
      }
    })
  }

    _showErr(errCode=1){
        const tip=tips[errCode];
        wx.showToast({
            title:tip?tip:tips[1],
            icon:"none",
            duration:2000
        })
    }
}

module.exports=HTTP;