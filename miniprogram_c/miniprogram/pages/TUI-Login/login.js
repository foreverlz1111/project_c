//硬代码一个用户ID（6620），通过该ID获取到sig并存入缓存
// 获取用户微信信息后缺少一个异步登录，假如网络不通畅后台登录失败也会转跳下一页面
import {
  setTokenStorage
} from '../../utils/token'
import logger from '../../utils/logger'
import {
  genTestUserSig
} from '../../debug/GenerateTestUserSig'

const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,

    userID: '6620',
    // 用户ID硬代码

    hidden: false,
    privateAgree: true,
    code: '',
    path: '',
    lastTime: 0,
    countryIndicatorStatus: false,
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    info:[
      { name:'车场ID',key:'park_id',value:0},
      { name:'车场名称',key:'park_name',value:'null'}, 
      { name:'地址',key:'park_location',value:'null'}, 
      { name:'车场状态',key:'park_status',value:false}, 
      { name:'车场道闸',key:'gate_id',value:0},
      { name:'道闸类型',key:'gate_style',value:'null'},
      { name:'道闸状态',key:'gate_status',value:true}, 
    ],
  },
  onLoad(option) {
    wx.$TUIKit.setLogLevel(1);
    this.setData({
      path: option.path,
    })
    wx.setStorage({
      key: 'path',
      data: option.path,
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    //每次通过该接口获取用户个人信息均需用户确认
    wx.getUserProfile({
      desc: '选择用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.$TUIKit.login({
            userID: app.globalData.userInfo.userID,
            userSig: app.globalData.userInfo.userSig,
          }).then(() => {})
          .catch(() => {});
        //console.log(res)
        this.setData({
            //微信用户的头像、昵称等信息
            userInfo: res.userInfo,
            hasUserInfo: true
          }),
          wx.setStorage({
            key: "userinfosync",
            data: res.userInfo,
          })
        wx.setStorage({
          key: "hasuserinfo",
          data: true,
          success() {
            wx.showToast({
              title: '请稍等',
              icon: 'loading',
              duration: 2000,
            });
            setTimeout(() => {
              wx.redirectTo({
                url: '../TUI-Calling/calling-index/index',
              })
            }, 2000);
          }
        })
      }
    })
  },
  onShow() {
   
  },
  // Token没过期可以利用Token登陆。无作用
  // loginWithToken() {
  //   wx.redirect({
  //     url: '../TUI-Calling/calling-index/index',
  //   })
  // },

  // 回退
  onBack() {
   
  },
  // 输入userID
  bindUserIDInput(e) {
    const val = e.detail.value
    this.setData({
      userID: val,
    })
  },
  login() {
    const userID = this.data.userID
    const userSig = genTestUserSig(userID).userSig
    logger.log(`TUI-login | login  | userSig:${userSig} userID:${userID}`)
    app.globalData.userInfo = {
      userSig,
      userID,
    }
    setTokenStorage({
      userInfo: app.globalData.userInfo,
    })
    this.getUserProfile();
  },
})