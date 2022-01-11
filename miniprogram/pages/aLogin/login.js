// pages/aLogin/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNull: true,
    login_bnt_cold:true
  },


  onLoad: function (options) {
     
  },
  _login(){
    this._check_server();
    this.setData({login_bnt_cold:false});
    setTimeout(() => {
      this.setData({login_bnt_cold:true});
    }, 5000);
  },
  _check_server(){
    wx.request({
      url: 'http://lzypro.com:3000/hello',
      success(res){
        console.log(res.data);
        wx.showToast({
          title: res.data,
          duration:2000,
          mask:true,
          icon:'success'
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