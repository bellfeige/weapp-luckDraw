const app = getApp()
const db = wx.cloud.database()
// const cmd = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    hasLogin: false,
    isAdmin: false,
    isSuperAdmin: false,
    unLoginAvatarUrl: '../../images/user-unlogin.png'
  },

  myParticipation: function() {
    console.log('allParticipated')
  },

  wonPrizes: function() {
    console.log('wonPrizes')
  },

  gotoMyFav: function() {
    // console.log('myFav')
    if (this.data.myFavQuanlity == 0) {
      wx.showToast({
        title: '暂无收藏',
        'icon': 'none',
        duration: 3000
      })
    } else {
      wx.navigateTo({
        url: '../myFavDetail/myFavDetail',
      })
    }
  },

  getQuanlity: function() {
    var that = this
    db.collection('myFav').where({
      _openid: app.globalData.openid
    }).get({
      success(res) {
        // console.log(res.data.length)
        that.setData({
          myFavQuanlity: res.data.length
        })
      }
    })
  },

  userLogin: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'isAdmin',
      data: {},
      success(res) {
        // console.log(res.result.data)
        var a = res.result.data[0].adminOpenIDs;
        // console.log(a)
        var sa = res.result.data[0].superadminOpenIDs
        // console.log(sa)

        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success(res) {
            console.log('[云函数] [login] user openid: ' + res.result.openid)
            app.globalData.openid = res.result.openid
            app.globalData.hasLogin = true
            // console.log(app.globalData.openid)
            // console.log(app.globalData.hasLogin)

            if (a.includes(res.result.openid)) {
              // console.log("is admin")
              that.setData({
                isAdmin: true
              })
              app.globalData.isAdmin = true
            }
            if (sa.includes(res.result.openid)) {
              // console.log("is superadmin")
              that.setData({
                isSuperAdmin: true
              })
              app.globalData.isSuperAdmin = true
            }
            that.setData({
              hasLogin: true
            })
            app.globalData.hasLogin = true

            // wx.navigateTo({
            //   url: '../userConsole/userConsole',
            // })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
            // wx.navigateTo({
            //   url: '../deployFunctions/deployFunctions',
            // })
          }
        })


      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.userLogin()
    // this.setData({
    //   isAdmin: app.globalData.isAdmin,
    //   hasLogin: app.globalData.hasLogin
    // })




  },

  getUserInfo: function(info) {
    const userInfo = info.detail.userInfo
    app.appData.userInfo = userInfo
    if (app.appData.userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    }
  },

  goAdminSetting: function() {
    console.log("page isAdmin is " + this.data.isAdmin)
    console.log("Global isAdmin is " + app.globalData.isAdmin)
    wx.navigateTo({
      url: '../appManagement/appManagement',
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getQuanlity()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})