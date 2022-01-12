// pages/aLogin/login.js
Page({
  data: {
    //console.log(this.data.server_ready);
    account_input :'',
    password_input : '',
    server_ready:false,
    isNull: true,
    login_bnt_cold:true
  },

  onLoad: function (options) {
    this.setData({server_ready:false});
    
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
      this.check_server();
      this.setData({login_bnt_cold:false,});
      //wx.showLoading()偶尔出现显示bug，PC和手机端均无法使用属性
     wx.showLoading({
       title: '登录中',
       mask:true,
    })
    setTimeout(()=>{
      console.log(this.data.server_ready);
      if(this.data.server_ready == true ){;
        wx.request({
          url: 'http://lzypro.com:3000/login/'+account+'/'+password,
          method:"GET",
          success(res){
            if(res.statusCode == 200){
              console.log(res.data.id);
              wx.hideLoading({
                success: (res) => {
                  wx.setStorageSync('account_entity', res.data);
                  wx.redirectTo({
                    url: '../aManage/aIndex/index',
                  })
                },
              })
            }
            else if(res.statusCode == 400){
              error_toast(res.data)
            }
          }
      })
   }
    }, 2000);
    setTimeout(()=>{this.setData({login_bnt_cold:true});
  wx.hideLoading({
    success: (res) => {},
  })}, 6000);
  }
  },
 check_server(){
   var error_toast = this._return_error_toast;
   var _this = this;
    wx.request({
      url: 'http://lzypro.com:3000/hello',
      timeout:3000,
      success(res){
        console.log(res);
        _this.setData({server_ready:true});
      },
      fail(res){
        error_toast("服务器问题");
      }
    })
  },
  _return_account(data){
    this.data.account_input = data.detail.value;
  },
  _return_password(data){
    this.data.password_input = data.detail.value;
  },
  _return_error_toast:function(t){
    wx.showToast({
      title: t,
      icon:"error",
      duration:2000
    })
  },
  _return_success_toast:function(t){
    wx.showToast({
      title: t,
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