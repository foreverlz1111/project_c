// pages/aManage/aRecord/record.js
const app = getApp()
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
    wx.showLoading({
      title: '加载中~ ~ ~',
    })
    setTimeout(() => {
      this.get_record().then((s) => {
        console.log(s)
        this.setData({
          record: s
        });
        wx.hideLoading({
          success: (res) => {},
        })
      }).catch((e) => {
        console.log(e);
      })
    }, 800);
  },
  edit_remark(event) {
    let _remark_id = event.currentTarget.id;
    let _remark = event.currentTarget.dataset.remark;
    let _this = this;
    wx.showModal({
      cancelColor: 'cancelColor',
      content: _remark,
      editable: true,
      success(s) {
        if (s.confirm) {
          wx.showModal({
            title: "是否修改为 : ",
            content: s.content,
            cancelColor: 'cancelColor',
            success(sc) {
              if (sc.confirm) {
                if (s.content == _remark) {
                  _this._return_success_toast("没有修改");
                } else {
                  wx.showLoading({
                    title: '保存中 ~ ~',
                  })
                  _this.save_remark(_remark_id, s.content).then((res) => {
                    if (res.statusCode == 200) {
                      _this.get_record().then((refresh) => {
                        _this.setData({
                          record: refresh,
                        })
                        _this._return_success_toast(res.data);
                      });
                    } else if (res.statusCode == 400) {
                      _this._return_error_toast(res.data)
                    }
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  save_remark(id, remark) {
    let _this = this;
    let promise = new Promise(function (s, e) {
      wx.request({
        url: app.globalData.request_remote + '/call_entity/update/remark/',
        method: "PUT",
        data: {
          "id": id,
          "remark": remark
        },
        success(res) {
          s(res);
        },
        fail() {
          _this._return_error_toast("网络不行哦");
        }
      })
    })
    return promise;
  },
  get_record() {
    let _this = this;
    let _park = _this.data.park_entity;
    let _account = _this.data.account_entity;
    let promise = new Promise(function (s, e) {
      wx.request({
        url: app.globalData.request_remote + '/call_entity/' + _park.id + '/' + _account.id,
        method: "GET",
        success(res) {
          if (res.statusCode == 200) {
            // wx.setStorage({ key : "road_gate",data : res.data.r});
            // _this.setData({
            //   record: res.data,
            // })
            s(res.data)
          } else if (res.statusCode == 400) {
            _this._return_error_toast(res.data)
            e(res.data);
          }
        },
        fail() {
          _this._return_error_toast("请求超时");

        }
      })
    })
    return promise;
  },
  delete_tap(event) {
    let _delete_id = event.currentTarget.id;
    let _this = this;
    wx.showModal({
      title: '删除记录？',
      content: '该操作不可恢复。',
      cancelColor: 'cancelColor',
      confirmColor: '#ff3434',
      confirmText: '删除',
      success(s) {
        if (s.confirm) {
          wx.showLoading({
            title: '删除中',
          });
          _this.delete_record(_delete_id).then((res) => {
            if (res.statusCode == 200) {
              _this._return_success_toast(res.data);
              _this.get_record().then((refresh) => {
                _this.setData({
                  record: refresh
                });
              });
            } else if (res.statusCode == 400) {
              _this._return_error_toast(res.data);
            }
          })
        } else {
          _this._return_success_toast("没有删除");
        }
      }
    })
  },
  delete_record(id) {
    let _this = this;
    let promise = new Promise(function (s, e) {
      wx.request({
        url: app.globalData.request_remote + '/call_entity/update/deletion',
        method: 'DELETE',
        data: {
          id: id
        },
        success(res) {
          s(res)
        },
        fail() {
          _this._return_error_toast("网络问题");
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