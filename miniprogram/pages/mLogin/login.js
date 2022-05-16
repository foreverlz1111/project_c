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
    wxuserInfo: {},
    hasUserInfo: false,
    refresh_button: true,
    userID: 'useruser', // 用户ID硬代码
    park_id: 0,
    road_id: 0,
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
        key: 'id',
        value: 0
      },
      {
        name: '车场名称',
        key: 'park_name',
        value: 'null'
      },
      {
        name: '地址',
        key: 'city',
        value: 'null'
      },
      {
        name: '车场状态',
        key: 'status',
        value: -1
      },
      {
        name: '闸口ID',
        key: 'road_id',
        value: 0
      },
      {
        name: '闸口类型：',
        key: 'road_gate_type',
        value: 1
      },
      {
        name: '闸口状态：',
        key: 'open_gate_type',
        value: 1
      },
    ],
  },
  onLoad(option) {
    this._get_info();
    wx.hideHomeButton({
      success: (res) => {},
    })
    wx.$TUIKit.setLogLevel(1);
    /*【废弃】
    wx.setBackgroundColor({
      backgroundColor: '#000000',
      success(res){
        console.log(res)
      }
    })
    */
    /**********************【废弃】获取用户信息
     if (wx.getUserProfile) {
       this.setData({
         canIUseGetUserProfile: true
       })
     }
     *********************/
    this.setData({
      park_id: option.park_id,
      road_id: option.road_id
    });
    wx.setStorage({
      key: "park_id",
      data: this.data.park_id
    });
    wx.setStorage({
      key: "road_id",
      data: this.data.road_id
    });
    this.get_park();
    setTimeout(() => {
      //this.test_call()
      //this.test_accept()
      //this.test_reject()
    }, 1000);
  },
  test_call() {
    let _this = this;
    let park_id = _this.data.park_id;
    let road_id = _this.data.road_id;
    wx.request({
      url: app.globalData.request_remote + '/call',
      method: 'PUT',
      data: {
        "park_id": park_id,
        "road_gate_id": road_id,
      },
      success(res) {
        console.log(res.data)
      }
    })
  },
  test_accpet() {
    let _this = this;
    let account_id = 2;
    wx.request({
      url: app.globalData.request_remote + '/call_accept',
      method: 'PUT',
      data: {
        "account_id": account_id
      },
      success(res) {
        console.log(res.data)
      }
    })
  },
  test_reject() {
    let _this = this;
    let account_id = 2;
    wx.request({
      url: app.globalData.request_remote + '/call_accept',
      method: 'PUT',
      data: {
        "account_id": account_id
      },
      success(res) {
        console.log(res.data)
      }
    })
  },

  get_park() {
    var _this = this;
    var park_id = _this.data.park_id;
    var road_id = _this.data.road_id;
    var _info = _this.data.info
    wx.showLoading({
      title: '加载中',
      success() {
        wx.request({
          url: app.globalData.request_remote + '/fetcher/' + park_id + '/' + road_id,
          success(res) {
            if (res.statusCode == 200) {
              _info.forEach(element => {
                for (let n in res.data.p) {
                  if (n == element.key) {
                    element.value = res.data.p[n];
                    break;
                  }
                }
                for (let n in res.data.r) {
                  if (n == element.key) {
                    element.value = res.data.r[n];
                  }
                }
              });
              wx.hideLoading({
                success: (res) => {},
              });
              _this.setData({
                info: _info
              })
            }
            if (res.data.statusCode == 400) {
              _this._return_error_toast(res.data);
            }
          },
          fail() {
            _this._return_error_toast("网络不好")
          }
        })
      }
    })
  },
  _check_server() {
    var _this = this;
    wx.request({
      url: app.globalData.request_remote + '/hello',
      success(res) {
        console.log(res.data);
      },
      fail() {
        _this._return_error_toast("服务器不行哦");
      }
    })
  },
  _get_info() {
    /***********
     * 【废弃】
     *         POST：
                1.go使用time.Time类型，微信使用timestamp，需要将timestamp传入服务器运算后得到time.Time类型
                2.go的time.Time类型与mysql的timestamp类型不冲突
    var my_timestamp = Date.parse(new Date());
    my_timestamp = my_timestamp / 1000;
    console.log(my_timestamp);
    wx.request({
      url: app.globalData.request_remote+'/time/'+my_timestamp,
      method:'POST',
      data:{
        name:"Eva",
        status:1,
      },
    })
    ***********/
  },
  _refresh_info() {
    //改用showLoading()
    this.get_park()
    this.setData({
      refresh_button: false
    })
    setTimeout(() => {
      this.setData({
        refresh_button: true
      })
    }, 6000);
  },
  _getUserProfile() {
    var _this = this;
    //每次通过该接口获取用户个人信息均需用户确认
    //文档不全
    wx.getUserProfile({
      desc: '选择用户信息', // 没有实质用处
      success: (res) => {
        //不需要登录IM，接下来登录TRTC服务器即可
        // wx.$TUIKit.login({
        //     userID: app.globalData.userInfo.userID,
        //     userSig: app.globalData.userInfo.userSig,
        //   }).then(() => {})
        //   .catch(() => {});
        this.setData({
            //微信用户的头像、昵称等信息
            wxuserInfo: res.userInfo,
            hasUserInfo: true
          }),
          wx.setStorage({
            key: "wxuserinfosync",
            data: res.userInfo,
          })
        wx.setStorage({
          key: "hasuserinfo",
          data: true,
          success() {
            _this._return_success_toast("请稍等");
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
    //const userID = this.data.userID
    //const userSig = genTestUserSig(userID).userSig
    // logger.log(`TUI-login | login  | userSig:${userSig} userID:${userID}`)
    // app.globalData.userInfo = {
    //   userSig,
    //   userID,
    // }
    // setTokenStorage({
    //   userInfo: app.globalData.userInfo,
    // })
    this._getUserProfile();
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
})