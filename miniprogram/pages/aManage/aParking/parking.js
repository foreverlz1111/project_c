// pages/aManage/aParking/parking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_entity: {},
    park_entity: {},
    road: [],
    road_gate_type: ['进口', '出口', '进出口'],
    road_gate_type_index: 0,
    open_type: 1, //['开启','关闭'] 1,2
    hide_add_dialog: true
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
        if (s.cancel) {
          //console.log("cancel!")
        }
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
    wx.showLoading({
      title: '更新中',
    })
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
  road_gate_type_alteration_change(e) {
    let _this = this;
    let _road_gate_type = e.detail.value;
    let _id = e.currentTarget.id;
    let _compare = e.currentTarget.dataset.compare;
    _road_gate_type++;
    if (_compare != _road_gate_type) {
      _this.road_gate_type_alteration(_id, _road_gate_type).then((res) => {
        if (res.statusCode == 200) {
          _this._return_success_toast(res.data);
          _this._get_control(_this.data.park_entity.id);
        } else if (res.statusCode == 400) {
          _this._return_error_toast(res.data);
        }
      })
    } else {
      _this._return_success_toast("无需修改");
    }
    //console.log(this.data.road_gate_type[e.detail.value]);
  },
  road_gate_type_alteration(id, road_gate_type) {
    let _this = this;
    wx.showLoading({
      title: '修改中',
    })
    console.log("id" + id);
    console.log(",road_gate_type" + road_gate_type)
    let promise = new Promise(function (s, e) {
      wx.request({
        url: 'http://lzypro.com:3000/manages/open_gate',
        method: 'PUT',
        data: {
          id: id,
          road_gate_type: road_gate_type
        },
        success(res) {
          s(res)
        },
        fail() {
          _this._return_error_toast("请求超时");
        }
      })
    })
    return promise;
  },
  road_gate_type_picker_change(e) {
    this.setData({
      road_gate_type_index: e.detail.value
    });
  },
  open_type_radio_change(e) {
    this.setData({
      open_type: e.detail.value
    });
  },
  add_tap() {
    this.setData({
      hide_add_dialog: false
    });

  },
  cancel_add_tap() {
    this.setData({
      hide_add_dialog: true
    });
  },
  confirm_add_tap() {
    let _this = this;
    let _park_entity = _this.data.park_entity;
    let _road_gate_type = _this.data.road_gate_type;
    let _road_gate_type_index = _this.data.road_gate_type_index;
    let _open_type = _this.data.open_type;
    let _open_type_text = _open_type == 1 ? '开闸' : '关闸'
    wx.showModal({
      cancelColor: 'cancelColor',
      confirmText: '添加',
      title: '是否添加该道闸？',
      content: '道闸类型：' +
        _road_gate_type[_road_gate_type_index] +
        ';\r\n' +
        '状态类型：' +
        _open_type_text,
      success(s) {
        if (s.confirm) {
          _this.confirm_add(_park_entity.id, _road_gate_type_index, _open_type).then((res) => {
            if (res.statusCode == 200) {
              _this._return_success_toast(res.data);
              _this._get_control(_this.data.park_entity.id);
              _this.setData({
                hide_add_dialog: true
              })
            } else if (res.statusCode == 400) {
              _this._return_error_toast(res.data);
            }
          })
        }
      }
    })
  },
  confirm_add(park_id, road_gate_type, open_type) {
    let _this = this;
    wx.showLoading({
      title: '正在添加...',
    })
    let promise = new Promise(function (s, e) {
      wx.request({
        url: 'http://lzypro.com:3000/manages/open_gate',
        method: 'POST',
        data: {
          park_id: park_id,
          road_gate_type: ++road_gate_type,
          open_type: open_type
        },
        success(res) {
          s(res)
        },
        fail() {
          _this._return_error_toast("网络不好");
        }
      })
    });
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