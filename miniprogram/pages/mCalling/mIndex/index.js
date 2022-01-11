// room.js
// eslint-disable-next-line no-undef
import {
  genTestUserSig
} from '../../../debug/GenerateTestUserSig';
// eslint-disable-next-line no-undef
const app = getApp();

Page({

  data: {
    userInfo: {},
    hasUserInfo: false,
    privateAgree: true,
    config: {
      sdkAppID: app.globalData.SDKAppID,
      userID: app.globalData.userID,
      userSig: app.globalData.userSig,
      type: 2,//视频通话
      tim: null,
    },
    localUserInfo: null,
    remoteUserInfo: {},
    userID: '',
    searchResultShow: ''
  },

  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync("userinfosync"),
      hasUserInfo: wx.getStorageSync('hasuserinfo'),
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
      this.setData({
        remoteUserInfo: {
          ...imResponse.data[0]
        },
        searchResultShow: true,
      });
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
          wx.showToast({
            title: '取消操作',
            icon: 'none',
            mask:true,
            duration: 3000,
          })
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
    //console.log("console.log(this.config.userID) == " + this.config.userID);
    console.log("console.log(this.data.remoteUserInfo.userID) ==" + this.data.remoteUserInfo.userID);
    //if(wx.$TUIKit)
    this.TRTCCalling.call({
      userID: this.data.remoteUserInfo.userID,
      type: 2
    });
  },
});