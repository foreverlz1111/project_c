// room.js
// eslint-disable-next-line no-undef
import { genTestUserSig } from '../../../debug/GenerateTestUserSig';
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
      type: 1,
      tim: null,
    },
    localUserInfo: null,
    remoteUserInfo: {},
    userID: '',
    searchResultShow:''
  },

  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync("userinfosync"),
      hasUserInfo: wx.getStorageSync('hasuserinfo'),
    })
    // console.log(this.userInfo.avatarUrl);
    // console.log(this.hasUserInfo);
    
    const { config } = this.data;
    config.sdkAppID = app.globalData.SDKAppID;
    config.userID = app.globalData.userInfo.userID;
    config.userSig = genTestUserSig(config.userID).userSig;
    config.type = 2;// 视频聊天 参数2
    //config.tim = wx.$TUIKit;
    this.setData({
      config
    }, () => {
      this.TRTCCalling = this.selectComponent('#TRTCCalling-component');
      console.log(" this.TRTCCalling == "+this.TRTCCalling);
      console.log("config sdkAppID== " + config.sdkAppID);
      console.log("config userID== " + config.userID);
      console.log("config type== " + config.type);
      console.log("config tim== " + config.tim);
      //config.tim is null
     this.TRTCCalling.init();
    });
    wx.$TUIKit.getUserProfile({ userIDList: ['user0'] }).then((imResponse) => {
      console.log(imResponse.data[0]);
      this.setData({
        remoteUserInfo: { ...imResponse.data[0] },
        searchResultShow: true,
      });
    });
  },
  // handleEntry(e) {
  //   const url = this.data.entryInfos[e.currentTarget.id].navigateTo;
  //   wx.navigateTo({
  //     url,
  //   });
  // },
  linkTo() {
    const url = 'https://www.aliyun.com'
    wx.navigateTo({
      url: `../../TUI-User-Center/webview/webview?url=${url}&nav=AliCloud`,
    })
  },

  onShow() {
    //console.log("appid"+ app.globalData.userInfo.userID);
    //console.log("sig"+ app.globalData.userInfo.userSig);

  },
  // 返回
  onBack() {
    wx.showModal({
      title: '确定返回首页吗？',
      cancelColor: 'cancelColor',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../../TUI-Login/login',
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '无操作',
            icon: 'none',
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
onUpload(){
    this.TRTCCalling.destroyed();
},
  call() {
    //console.log("console.log(this.config.userID) ==" + this.config.userID);
    console.log("console.log(this.data.remoteUserInfo.userID) ==" +this.data.remoteUserInfo.userID);
    this.TRTCCalling.call({ userID: this.data.remoteUserInfo.userID, type: 2 });
  },

});