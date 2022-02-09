// pages/aManage/aParking/parking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_entity: {},
    park_entity: {},
    road: [],
    flag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      account_entity: wx.getStorageSync('account_entity'),
      park_entity: wx.getStorageSync('park_entity'),
    });

    this._get_control(this.data.park_entity.id).then((res) => {
      //接口返回4个元组

    });
  },
  open_status: function (event) {
    var question = event.detail.value == true ? "开启?" : "关闭?";
    var _this = this;
    var open_gate_id = event.currentTarget.id;
    var status = event.currentTarget.dataset.status;
    wx.showModal({
      title: "修改状态",
      content: "是否将闸口状态设为" + question,
      confirmColor: event.detail.value == false ? "#DC143C" : "#000000",
      confirmText: "是的",
      success(s) {
        if (s.cancel) console.log("cancel!")
        if (s.confirm) {
          _this._change_status(open_gate_id, status).then((res) => {
            _this._get_control(_this.data.park_entity.id);
          }).catch((e) => {
            console.log(e)
          })
        }
      }
    })
  },
  _change_status(id, status) {
    var _this = this
    let promise = new Promise(function (s, e) {
      wx.request({
        url: 'http://lzypro.com:3000/open_change',
        method: "PUT",
        data: {
          "id": id,
          "status": status,
        },
        success(res) {
          if (res.statusCode == 200) {
            // wx.setStorage({ key : "road_gate",data : res.data.r});
            console.log(res)
            s(res.data)
            _this._return_success_toast(res.data)
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
  _get_control(park) {
    var _this = this
    let promise = new Promise(function (s, e) {
      wx.request({
        url: 'http://lzypro.com:3000/road/' + park,
        method: "GET",
        success(res) {
          if (res.statusCode == 200) {
            // wx.setStorage({ key : "road_gate",data : res.data.r});
            _this.setData({
              road: res.data,
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})