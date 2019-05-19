const app = getApp()
const db = wx.cloud.database()
// const _ = db.command

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

  gotoMyParticipation: function () {
    if (this.data.myParticipatedQuanlity === 0) {
      wx.showToast({
        title: '暂无参加任何抽奖',
        'icon': 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../myParticipationDetail/myParticipationDetail',
      })
    }

  },

  gotoWonPrizes: function () {
    if (this.data.myWonQuanlity === 0) {
      wx.showToast({
        title: '暂无中奖',
        'icon': 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../myWonList/myWonList',
      })
    }
  },

  gotoMyFav: function () {
    // console.log('myFav')
    if (this.data.myFavQuanlity === 0) {
      wx.showToast({
        title: '暂无任何收藏',
        'icon': 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../myFavDetail/myFavDetail',
      })
    }
  },

  getQuanlity: function (myOpenid) {
    var that = this

    //get fav quanlity
    db.collection('myInfo').where({
      _openid: myOpenid,
      type: 'fav'

    }).get({
      success(res) {
        // console.log(res.data.length)
        that.setData({
          myFavQuanlity: res.data.length
        })
      },

    })

    //get participated quanlity
    db.collection('myInfo').where({
      _openid: myOpenid,
      type: 'draw'
    }).get({
      success(res) {
        // console.log(res.data.length)
        that.setData({
          myParticipatedQuanlity: res.data.length
        })
      }
    })

    //get won prizes quanlity
    db.collection('myInfo').where({
      _openid: myOpenid,
      type: 'winner'
    }).get({
      success(res) {
        // console.log(res.data.length)
        that.setData({
          myWonQuanlity: res.data.length
        })
      }
    })

    //get check in quanlity

  },



  getUserInfo: function (info) {
    var that = this
    // wx.showLoading({
    //   title: '加载中...',
    // })
    const userInfo = info.detail.userInfo
    // console.log(userInfo)
    try {
      const localUserInfo = wx.getStorageSync('userInfo')
      if (!localUserInfo || localUserInfo == null) {
        wx.setStorage({
          key: 'userInfo',
          data: userInfo
        })
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true,
          hasLogin: true
        })
      }

    } catch (e) {
      console.error(e)
    }


  },


  goAdminSetting: function () {
    console.log("page isAdmin is " + this.data.isAdmin)
    console.log("Global isAdmin is " + app.globalData.isAdmin)
    wx.navigateTo({
      url: '../appManagement/appManagement',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    setTimeout(function () {
      if (app.globalData.openid !== null) {
        that.getQuanlity(app.globalData.openid)
        that.setData({
          isAdmin: app.globalData.isAdmin,
          isSuperAdmin: app.globalData.isSuperAdmin
        })
      }
    }, 2500)

    try {
      const localUserInfo = wx.getStorageSync('userInfo')
      if (localUserInfo) {
        console.log(localUserInfo)
        app.appData.userInfo = localUserInfo
        // if (app.appData.userInfo) {
        this.setData({
          userInfo: localUserInfo,
          hasUserInfo: true,
          hasLogin: true
        })
        // }

      }
    } catch (e) {
      console.error(e)
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.openid !== null) {
      this.getQuanlity(app.globalData.openid)
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})