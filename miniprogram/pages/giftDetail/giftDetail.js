const app = getApp()
const db = wx.cloud.database()
const cmd = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collected: false,
    collectionName: '',
    isSuperAdmin: false,
    drawed: false
  },

  gotoGiftHomepage: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },


  onShare: function (e) {
    console.log(e)
  },




  joinLuckDraw: function () {

    var that = this;
    if (!app.globalData.hasLogin) {
      that.checkLogin()
    } else {
      console.log('can jia')
    }

  },

  runCloudDB: function (name, db, type) {
    var that = this
    wx.cloud.callFunction({
      name: name,
      data: {
        db: db, //collection name
        type: type, //action to take
        condition: {
          giftList_ID: that.data.contentId
        },
        data: {

        }
      },
      success: res => {
        console.log(res.result)
      },
      fail: err => {
        console.error(err)
      }
    })
  },


  delThisDetail: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '删除后无法恢复',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除...',
          })
          wx.cloud.deleteFile({
            fileList: that.data.detail[0].imgCloudUrl,
            success: res => {
              console.log(res.fileList)

              db.collection('giftList').doc(that.data.contentId).remove({
                success() {
                  console.log('giftList record deleted')

                  that.runCloudDB('runDB', 'giftUser', 'delete')
                  wx.navigateBack()
                },
                fail() {
                  console.log('fail to delete giftList record')
                },
                complete() {
                  wx.hideLoading()
                }
              })
            },
            fail: console.error
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  checkLogin: function () {
    wx.showModal({
      title: '用户未登录',
      content: '登录后体验完整功能',
      success(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../userInfo/userInfo',
          })
        } else if (res.cancel) {
          console.log('user canceled')
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {

    var that = this
    // console.log(o)
    // console.log(app.globalData.isAdmin)
    wx.showLoading({
      title: '加载中...',
    })

    that.setData({
      contentId: o.id,
      isSuperAdmin: app.globalData.isSuperAdmin
    })


    const db = wx.cloud.database()
    db.collection('giftList').where({
      _id: that.data.contentId
    }).get({
      success(res) {
        // res.data 包含该记录的数据
        // console.log(res.data)
        // var collectData = [].concat(res.data)
        that.setData({
          detail: res.data
        })
        // console.log(detail[0].title)
        // console.log(detail[0].description)
      },
      complete() {
        wx.hideLoading()
      }
    })



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
    this.onShare(this.data.detail)
  }
})