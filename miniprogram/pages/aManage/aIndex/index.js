// pages/aManage/aIndex/index.js
import {
  setTokenStorage
} from '../../../utils/token'
import logger from '../../../utils/logger'
import {
  genTestUserSig
} from '../../../debug/GenerateTestUserSig';
// eslint-disable-next-line no-undef
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    init_index1: [{
        title: "通话记录",
        icon: "../../../static/images/notes-tasks.png",
        url: "../aRecord/record"
      },
      {
        title: "权限管理",
        icon: "../../../static/images/programming-user-head.png",
        url: "../aPrivilege/privilege"
      },
      {
        title: "车场管理",
        icon: "../../../static/images/parking-ramp.png",
        url: "../aParking/parking"
      },
    ],
    init_index2: [{
      title: "新增车场",
      icon: "../../../static/images/parking-p.png",
      url: "../aPlus/plus"
    }, ],
    account_entity: {},
    park_entity: {},
    ready_call: false,
    account: '未定义',

    userID: '客服', //
    config: {
      sdkAppID: app.globalData.SDKAppID,
      userID: app.globalData.userID,
      userSig: app.globalData.userSig,
      type: 2, //视频通话
      tim: null,
    },
  },

  onLoad: function (options) {
    wx.$TUIKit.setLogLevel(1);
    wx.hideHomeButton({
      success: (res) => {},
    })
    this.setData({
      account_entity: wx.getStorageSync('account_entity')
    });

    this._get_park(this.data.account_entity.id).then((res => {
      console.log(res)
    })).catch((res) => {
      if (res != '') {
        this._get_park(this.data.account_entity.id)
      }
    });
  },
  _get_park(account_id) {
    var _this = this;
    let promise = new Promise(function (s, e) {
      wx.request({
        url: 'http://lzypro.com:3000/park/' + account_id,
        timeout: 3000,
        method: "GET",
        success(res) {
          if (res.statusCode == 200) {
            wx.setStorage({
              key: "park_entity",
              data: res.data,
            });
            _this.setData({
              park_entity: res.data,
            })
          } else if (res.statusCode == 400) {
            _this._return_error_toast(res.data)
          }
          s(res);
        },
        fail() {
          _this._return_error_toast("网络问题");
          e("网络问题");
        }
      })
    })
    return promise;
  },
  _redirect(event) {
    const tab = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: tab.url,
    })
  },
  switch_ready: function (e) {
    let _this = this;
    let _ready_call = this.data.ready_call;
    if (_ready_call == false) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '准备',
        content: '开始接受用户来电？',
        success(e) {
          if (e.confirm) {
            _this.setData({
              ready_call: !_ready_call,
            })
            _this.ready_video()
          }
        }
      })
    } else {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '结束',
        content: '是否结束本次客服？',
        success(e) {
          if (e.confirm) {
            _this.setData({
              ready_call: !_ready_call,
            })
            _this.TRTCCalling.destroyed();
          }
        }
      })
    }
  },
  ready_video() {
    wx.showLoading({
      title: '加载中...',
    });
    let _this = this;
    const userID = _this.data.userID + _this.data.account_entity.account
    const userSig = genTestUserSig(userID).userSig
    logger.log(`TUI-login | login  | userSig:${userSig} userID:${userID}`)
    app.globalData.userInfo = {
      userSig,
      userID,
    };
    // wx.$TUIKit.login({
    //     userID: app.globalData.userInfo.userID,
    //     userSig: app.globalData.userInfo.userSig,
    //   }).then(() => {})
    //   .catch(() => {});
    const {
      config
    } = _this.data;
    config.sdkAppID = app.globalData.SDKAppID;
    config.userID = app.globalData.userInfo.userID;
    config.userSig = genTestUserSig(config.userID).userSig;
    config.type = 2; // 视频聊天 参数2
    config.tim = wx.$TUIKit;
    _this.setData({
      config
    }, () => {
      _this.TRTCCalling = _this.selectComponent('#TRTCCalling-component');
      _this.TRTCCalling.init();
      setTimeout(() => {

      }, 1000);
    });
    wx.hideLoading({
      success: (res) => {},
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
  _return_error_toast: function (t) {
    wx.showToast({
      title: t,
      icon: "error",
      mask: true,
      duration: 2000
    })
  },
  _return_success_toast: function (t) {
    wx.showToast({
      title: t,
      icon: "success",
      mask: true,
      duration: 2000
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})