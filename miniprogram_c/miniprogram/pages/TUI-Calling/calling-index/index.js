// room.js
// eslint-disable-next-line no-undef
Page({
  userInfo: {},
  hasUserInfo: false,
  data: {
    entryInfos: [
      { icon: 'https://web.sdk.qcloud.com/component/miniApp/resources/audio-card.png', title: '语音通话', desc: '丢包率70%仍可正常语音通话', navigateTo: '../calling-room/room?type=1' },
      { icon: 'https://web.sdk.qcloud.com/component/miniApp/resources/video-card.png', title: '视频通话', desc: '丢包率50%仍可正常视频通话', navigateTo: '../calling-room/room?type=2' },
    ],
    privateAgree:false
  },

  onLoad() {
    this.userInfo =  wx.getStorageSync("userinfosync");
    console.log(this.userInfo);
    this.hasUserInfo = wx.getStorageSync('hasuserinfo'); 
    console.log(this.hasUserInfo);
  },
  handleEntry(e) {
    const url = this.data.entryInfos[e.currentTarget.id].navigateTo;
    wx.navigateTo({
      url,
    });
  },

  onShow() {
    
  },
  // 返回
  onBack() {
    wx.showModal({
      title:'确定返回首页吗？',
      cancelColor: 'cancelColor',
      success :function(res){
        if(res.confirm){
           wx.redirectTo({
            url: '../../TUI-Login/login',
             })
        }
        else if(res.cancel){
          wx.showToast({
            title: '无操作',
            icon:'none',
            duration: 3000,
          })
        }
      }
    })
  },
});
