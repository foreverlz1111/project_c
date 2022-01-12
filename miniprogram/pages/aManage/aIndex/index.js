// pages/aManage/aIndex/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    init_index:[
      {title: "通话记录",icon:"../../../static/images/file.png",url:"../aRecord/record"},
      {title: "权限管理",icon:"../../../static/images/rating.png",url:"../aPrivilege/privilege"},
      {title: "车场管理",icon:"../../../static/images/star.png",url:"../aParking/parking"},
      
    ],
    account_entity : {},
    ready_call :false,
    account:'未定义'
  },

  onLoad: function (options) {
    this.data.account_entity = wx.getStorageSync('account_entity');
    console.log(account_entity);
  },
  _redirect(event){
    const tab = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: tab.url,
    })
},
switch_ready:function(e){
  console.log(e.detail.value);
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