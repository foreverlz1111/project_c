//Copy from room.js
// eslint-disable-next-line no-undef
import {
  genTestUserSig
} from '../../../debug/GenerateTestUserSig';
// eslint-disable-next-line no-undef
const app = getApp();

Page({

  data: {
    wxuserInfo: {},
    park_id: 0,
    road_id: 0,
    hasUserInfo: false,
    privateAgree: true,
    config: {
      sdkAppID: app.globalData.SDKAppID,
      userID: app.globalData.userID,
      userSig: app.globalData.userSig,
      type: 2, //视频通话
      tim: null,
    },
    localUserInfo: null,
    remoteUserInfo: {},
    remoteUserID: '',
    //userID: '',
    //searchResultShow: ''
  },

  onLoad() {
    wx.$TUIKit.setLogLevel(1);
    this.setData({
      wxuserInfo: wx.getStorageSync("wxuserinfosync"),
      hasUserInfo: wx.getStorageSync('hasuserinfo'),
      park_id: wx.getStorageSync("park_id"),
      road_id: wx.getStorageSync("road_id"),
    })
    const {
      config
    } = this.data;
    config.sdkAppID = app.globalData.SDKAppID;
    config.userID = app.globalData.userInfo.userID;
    config.userSig = genTestUserSig(config.userID).userSig;
    config.type = 2; // 视频聊天 参数2
    config.tim = wx.$TUIKit;
    this.setData({
      config
    }, () => {
      this.TRTCCalling = this.selectComponent('#TRTCCalling-component');
      /***** 
       * Correct usages:
       *  console.log(" this.TRTCCalling == "+this.TRTCCalling);
       * console.log("config sdkAppID== " + config.sdkAppID);
       * console.log("config userID== " + config.userID);
       * console.log("config type== " + config.type);
       * Incorrect usage:
       * console.log("config tim== " + config.tim);
       * //this.config.tim == (privete) null
       * Initual for login,Check if login before init():
       * Or this.TRTCCalling.init(); -->kickout() -->toast()
       *****/
      //
      this.TRTCCalling.init();
      //_isLogin();
    });
    wx.$TUIKit.getUserProfile({
      userIDList: ['user0']
    }).then((imResponse) => {
      console.log(imResponse.data[0]);
      // this.setData({
      //   remoteUserInfo: {
      //     ...imResponse.data[0]
      //   },
      //   //searchResultShow: true,
      // });
    });
  },

  linkTo() {
    const url = 'https://www.aliyun.com'
    wx.navigateTo({
      url: `../../TUI-User-Center/webview/webview?url=${url}&nav=AliCloud`,
    })
  },
  onShow() {

  },
  // 返回
  onBack() {
    let _this = this;
    wx.showModal({
      title: '确定返回首页吗？',
      cancelColor: 'cancelColor',
      success: function (res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../../mLogin/login',
          })
          this.TRTCCalling.destroyed();
        } else if (res.cancel) {
          _this._return_success_toast("取消操作")
        }
      }
    })
  },
  onAgreePrivateProtocol() {
    this.setData({
      privateAgree: !this.data.privateAgree,
    })
  },
  onUpload() {
    wx.showToast({
      title: '重新登陆',
      icon: 'none',
      success() {
        this.TRTCCalling.destroyed();
        wx.redirectTo({
          url: '../../mLogin/login',
        })
      }
    })
  },
  call() {
    let _this = this;
    wx.showLoading({
      title: '正在连接中...',
    })
    //if(wx.$TUIKit)
    this.get_call_detail().then((s) => {
      if (_this.data.remoteUserID != '') {
        wx.hideLoading({})
        this.TRTCCalling.call({
          userID: "客服" + this.data.remoteUserID,
          type: 2
        });
      }
    }).catch((e) => {

    })

  },
  get_call_detail() {
    let _this = this;
    let park_id = _this.data.park_id;
    let road_id = _this.data.road_id;
    let remoteUserID = _this.remoteUserID
    let wxuserInfo = _this.data.wxuserInfo;
    let promise = new Promise(function (s, e) {
      wx.request({
        url: 'http://lzypro.com:3000/call',
        method: 'PUT',
        data: {
          "park_id": park_id,
          "road_gate_id": road_id,
          "remark": "微信用户:" + wxuserInfo.nickName,
        },
        success(res) {
          if (res.statusCode == 200) {
            s(res)
            _this.setData({
              remoteUserID: res.data.account
            })
            if (res.data.statusCode == 400) {
              e(res)
              _this._return_error_toast(res.data);
            }
          }
        }
      })
    })
    return promise;
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
});