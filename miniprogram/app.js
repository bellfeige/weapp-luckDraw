//app.js


App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }




  },

  globalData: {
    hasLogin: false,
    isAdmin: false,
    isSuperAdmin:false,
  },

  appData: {
    userInfo: null,
    // adminOpenid: ['oW9VY5CabhksplplkEn18yUwqNok', 'oW9VY5PgSIMHLpvers6hfKjWP8WM'],
    // superAdminOpenid: ['oW9VY5CabhksplplkEn18yUwqNok'],

  }

})