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
    refresh_button:true,
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
    info: [{
        name: '车场ID',
        key: 'park_id',
        value: 0
      },
      {
        name: '车场名称',
        key: 'park_name',
        value: 'null'
      },
      {
        name: '地址',
        key: 'park_location',
        value: 'null'
      },
      {
        name: '车场状态',
        key: 'park_status',
        value: false
      },
      {
        name: '车场道闸',
        key: 'gate_id',
        value: 0
      },
      {
        name: '道闸类型',
        key: 'gate_style',
        value: 'null'
      },
      {
        name: '道闸状态',
        key: 'gate_status',
        value: true
      },
    ],
  },
  onLoad(option) {
    this._get_info();
    wx.$TUIKit.setLogLevel(1);
    /*废弃
    wx.setBackgroundColor({
      backgroundColor: '#000000',
      success(res){
        console.log(res)
      }
    })
    */
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
  _check_server(){
    wx.request({
      url: 'http://lzypro.com:3000/hello',
      success(res){
        console.log(res.data)
      }
    })
  },
  _get_info(){
    /***********
     *         POST：
                1.go使用time.Time类型，微信使用timestamp，需要将timestamp传入服务器运算后得到time.Time类型
                2.go的time.Time类型与mysql的timestamp类型不冲突，中间件可以自适应
    var my_timestamp = Date.parse(new Date());
    my_timestamp = my_timestamp / 1000;
    console.log(my_timestamp);
    wx.request({
      url: 'http://10.0.2.2:3000/insertone/'+my_timestamp,
      method:'POST',
      data:{
        name:"Eva",
        status:1,
      },
    })
    ***********/
  },
  _refresh_info(){
    //从showToast()改用showLoading()
    this._get_info();
    this.setData({refresh_button : false}) 
    wx.showLoading({
      title: '加载中',
      icon:'success',
      duration:3000,
      mask:true
    })
    setTimeout(() => {
      this.setData({refresh_button : true}) 
    }, 5000);
  },
  _refresh_info_error(){
    wx.showToast({
      title: '请稍后刷新',
      icon:'error',
      duration:1000
    })
  },
  _getUserProfile(e) {
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
                url: '../mCalling/mIndex/index',
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
  // },

  // 回退
  onBack() {

  },
  // 输入userID，【废弃】
  bindUserIDInput(e) {
    const val = e.detail.value
    this.setData({
      userID: val,
    })
  },
  //登录IM服务器，获取微信用户信息
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
    this._getUserProfile();
  },
})