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
    remoteUserAccount: '',
    remoteUserID: 0,
    user_accept: false,
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
    //this.park_params.park_id = this.data.park_id;
    this.setData({
      config
    }, () => {
      this.TRTCCalling = this.selectComponent('#TRTCCalling-component');
      this.TRTCCalling.init();
      /***** 
       * //this.config.tim == (privete) null
       * init() had included login(),addListen()
       *****/
      // 
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
    this.RemoveTRTCCallingListen();
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
    this.get_call_detail().then((s) => {
      _this.setData({
        UserAccept: false
      })
      if (_this.data.remoteUserAccount != '') {
        wx.hideLoading({});
        //wx.$TRTCCalling.on(wx.$TRTCCalling.EVENT.CALL_END, this.CallingEnd(this.data.remoteUserAccount), this);//通话结束[超时、取消都会回到这个状态，也就是通话的最终态]
        //wx.$TRTCCalling.on(wx.$TRTCCalling.EVENT.INVITATION_TIMEOUT, this.CallingTimeout(this.data.remoteUserID), this); //通话超时-->已取消
        //wx.$TRTCCalling.on(wx.$TRTCCalling.EVENT.REJECT, this.handleInviteeReject, this);//客服方拒绝了-->已取消
        //wx.$TRTCCalling.on(wx.$TRTCCalling.EVENT.CALLING_CANCEL, this.UserCancel(this.data.remoteUserID), this); // 通话取消[考虑手动的情况下]-->已取消?已挂断
        //wx.$TRTCCalling.on(wx.$TRTCCalling.EVENT.USER_ACCEPT, this.UserAccept(this.data.remoteUserID), this); //客服接听-->通话中
        //this.TRTCCalling.on(this.TRTCCalling.EVENT.USER_ACCEPT, this.UserAccept(this.data.remoteUserID), this); //客服接听-->通话中
        this.TRTCCalling.set_parkdata(this.data.remoteUserID, this.data.park_id);
        setTimeout(() => {
          //应把待数据传入组件再拨通，500ms等待
           this.TRTCCalling.call({
          userID: "客服" + this.data.remoteUserAccount,
          type: 2
        });
        }, 500);
       
      }
    }).catch((e) => {})
  },
  UserCancel(id) {
    wx.request({
      url: 'http://lzypro.com:3000/call_reject',
      method: 'PUT',
      data: {
        "account_id": id,
        "remark": "用户主动取消"
      },
      success(res) {
        console.log(res.data)
      }
    })
  },
  get_call_detail() {
    let _this = this;
    let park_id = _this.data.park_id;
    let road_id = _this.data.road_id;
    let remoteUserID = _this.remoteUserID
    let remoteUserAccount = _this.remoteUserAccount;
    let wxuserInfo = _this.data.wxuserInfo;
    let Parkparams = _this.Parkparams
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
              remoteUserID: res.data.id,
              remoteUserAccount: res.data.account,
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
  callingTimeoutEvent(id) {
    wx.request({
      url: 'http://lzypro.com:3000/call_reject',
      method: 'PUT',
      data: {
        "account_id": id,
        "remark": "用户拨打超时"
      },
      success(res) {
        console.log(res.data)
      }
    })
    console.log('无应答超时')
  },
  userEnterEvent(id) {
    wx.request({
      url: 'http://lzypro.com:3000/call_accept',
      method: 'PUT',
      data: {
        "account_id": id,
        "remark": "客服已接听"
      },
      success(res) {
        console.log(res.data)
      }
    })
  },
});