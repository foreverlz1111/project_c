// pages/aManage/aParking/parking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_entity:{},
    road_gate:[],
    open_gate:[],
    park_entity:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      account_entity: wx.getStorageSync('account_entity'),
      park_entity: wx.getStorageSync('park_entity'),
    });

    this._get_control(this.data.park_entity.id).then((res)=>{
      //接口分别返回r和o，通过填充
      //console.log(res.data.r);
      //console.log(res.data.o);
  });
  },
  _get_control(park){
    var _this = this
    let promise = new Promise(function(s,e){
      wx.request({
        url: 'http://lzypro.com:3000/road_gate/'+park,
        method:"GET",
        success(res){
          if(res.statusCode == 200){
            // wx.setStorage({ key : "road_gate",data : res.data.r});
            _this.setData({
              road_gate:res.data.r,
              open_gate:res.data.o,
            })
          }
          else if(res.statusCode == 400){
            _this._return_error_toast(res.data)
          }
          s(res)
        },
        fail(){
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})