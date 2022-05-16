// pages/aManage/aPrivilege/privilege.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_entity: [],
    input_value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      account_entity: wx.getStorageSync('account_entity'),
      input_value: ''
    });
  },
  change_password_tap(e) {
    let _this = this;
    let _account = _this.data.account_entity.account;
    let password1 = e.detail.value.old_password;
    let password2 = e.detail.value['new_password1'];
    let password3 = e.detail.value['new_password2'];
    //console.log(password1 + "~~~~~" + password2 + "~~~~~~" + password3);
    if (password1 != '' && password2 != '' && password3 != '') {
      if (password2 != password3) {
        _this._return_error_toast("两次密码不一致");
      } else if (password2 == password3) {
        if (password2 == password1) {
          _this._return_error_toast("不能使用旧密码")
        } else {
          _this.change_password(_account, password1, password2).then((res) => {
            if (res.statusCode == 200) {
              _this._return_success_toast(res.data);
            } else if (res.statusCode == 400) {
              _this._return_error_toast(res.data)
            }
            _this.setData({
              input_value: ''
            })
          })
        }
      }
    } else {
      _this._return_error_toast("不能留空")
    }
  },
  change_password(account, old_password, new_password) {
    let _this = this;
    wx.showLoading({
      title: '修改中',
    })
    let p = new Promise(function (params) {
      wx.request({
        url: app.globalData.request_remote + '/manages/change_password',
        method: 'PUT',
        data: {
          account: account,
          old_password: old_password,
          new_password: new_password
        },
        success(res) {
          params(res)
        },
        fail() {
          _this._return_error_toast("网络错误")
        }
      })
    })
    return p;
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