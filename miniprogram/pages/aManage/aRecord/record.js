// pages/aManage/aRecord/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_entity: {},
    park_entity: {},
    record: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      account_entity: wx.getStorageSync('account_entity'),
      park_entity: wx.getStorageSync('park_entity'),
    });
    this.get_record()
  },
  get_record() {
    let _this = this;
    let _park = _this.park_entity;
    let _account = _this.account_entity
    let promise = new Promise(function (s, e) {
      wx.request({
        url: 'http://lzypro.com:3000/call_entity/' + _park.id + '/' + _account.id,
        method: "GET",
        success(res) {
          if (res.statusCode == 200) {
            // wx.setStorage({ key : "road_gate",data : res.data.r});
            _this.setData({
              record: res.data,
            })
            s(res.data)
          } else if (res.statusCode == 400) {
            _this._return_error_toast(res.data)
          }
          s(res)
        },
        fail() {
          _this._return_error_toast("请求超时");
        }
      })
    })
    return promise;
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

  },
  _return_error_toast: function (t) {
    wx.showToast({
      title: t,
      mask: true,
      icon: "error",
      duration: 2000
    })
  },
  _return_success_toast: function (t) {
    wx.showToast({
      title: t,
      mask: true,
      icon: "success",
      duration: 2000
    })
  },
})