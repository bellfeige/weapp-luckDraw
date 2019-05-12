//app.js


App({



  userLogin: function () {
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
            that.globalData.openid = res.result.openid
            that.globalData.hasLogin = true
            // console.log(that.globalData.openid)
            // console.log(that.globalData.hasLogin)

            if (a.includes(res.result.openid)) {
              // console.log("is admin")
              // that.setglobalData({
              //   isAdmin: true
              // })
              that.globalData.isAdmin = true
            }
            if (sa.includes(res.result.openid)) {
              // console.log("is superadmin")
              // that.setglobalData({
              //   isSuperAdmin: true
              // })
              that.globalData.isSuperAdmin = true
            }

            // that.getQuanlity(res.result.openid)
            // that.getAddCollectionMyInfo(res.result.openid)

            console.log('hasLogin: ' + that.globalData.hasLogin)
            console.log('isAdmin: ' + that.globalData.isAdmin)
            console.log('isSuperAdmin: ' + that.globalData.isSuperAdmin)
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
            wx.showToast({
              title: '登录失败，请检查网络连接是否正常，然后重新打开小程序',
              'icon': 'none',
              duration: 3000
            })

          },

        })


      }
    })

  },


  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        // env: 'demo-011111',
        env: 'produce-zam1a',
      })
      this.userLogin()

    }




  },

  globalData: {
    hasLogin: false,
    isAdmin: false,
    isSuperAdmin: false,
  },

  appData: {
    userInfo: null,
    // adminOpenid: ['oW9VY5CabhksplplkEn18yUwqNok', 'oW9VY5PgSIMHLpvers6hfKjWP8WM'],
    // superAdminOpenid: ['oW9VY5CabhksplplkEn18yUwqNok'],

  }

})