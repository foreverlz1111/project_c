// pages/aLogin/login.js
Page({
  data: {
    //console.log(this.data.server_ready);
    account_input :'',
    password_input : '',
    isNull: true,
    login_bnt_cold:true
  },

  onLoad: function (options) {
    this.setData({
      account_input:'Tom',
      password_input:123456,
    });
    
  },
  login(){
    var error_toast = this._return_error_toast;
    var account = this.data.account_input;
    var password = this.data.password_input;
    var _this = this;
    if(account  == undefined || password == undefined ||
      account =='' || password == '' ){
      error_toast("输入不能为空哦")
    }
    else{
      this.check_server().then((s)=>{
        console.log(s),
        this.check_login(account,password).then((res)=>{
          if(res.statusCode == 200){
            wx.hideLoading({
              success: (h) => {
                wx.setStorage({
                  key : "account_entity", 
                  data : res.data
                });
                wx.redirectTo({
                  url: '../aManage/aIndex/index',
                })
              },
            })
          }
          else if(res.statusCode == 400){
            _this._return_error_toast(res.data);
          }
        }).catch((res)=>{
          console.log(res);
        })
        }
          ).catch((res)=>{
            console.log(res);
          });
      this.setData({login_bnt_cold:false,});
      //wx.showLoading()偶尔出现显示bug，PC和手机端均无法使用属性
     wx.showLoading({
       title: '登录中',
       mask:true,
    })
    setTimeout(()=>{
        this.setData({login_bnt_cold:true});
        wx.hideLoading({
        success: (res) => {},
      })
    }, 6000);
  }
  },
 check_server(){
  var _this = this;
   let promise = new Promise(function(solve,reject){
    wx.request({
      url: 'http://lzypro.com:3000/hello',
      timeout:3000,
      success(res){
        solve(res);
      },
      fail(){
        _this._return_error_toast("服务器连接问题");
        reject("服务器连接问题");
      }
    })
   })
   return promise;
  },
  check_login(account,password){
    var _this = this;
    let promise = new Promise(function(solve,reject){
      wx.request({
        url: 'http://lzypro.com:3000/login/'+account+'/'+password,
        method:"GET",
        success(res){
          solve(res)
        },
        fail(){
          _this._return_error_toast("登录服务器问题");
          reject("登录服务器问题");
        }
      })
    });
    return promise;
  },
  return_account(data){
    this.data.account_input = data.detail.value;
  },
  return_password(data){
    this.data.password_input = data.detail.value;
  },
  _return_error_toast:function(t){
    wx.showToast({
      title: t,
      icon:"error",
      mask:true,
      duration:2000
    })
  },
  _return_success_toast:function(t){
    wx.showToast({
      title: t,
      mask:true,
      icon:"success",
      duration:2000
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
    this.setData({server_ready:false});
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