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
    isAdmin: false,
  },

  gotoDiscoverHomepage: function () {
    wx.switchTab({
      url: '../discover/discover',
    })
  },


  onShare: function (e) {
    console.log(e)
  },


  addRemoveFav: function () {
    var that = this
    if (!app.globalData.hasLogin) {
      console.log('not logined')
      that.checkLogin()
    } else {
      if (!that.data.collected) {
        db.collection('myFav').add({
          data: {
            detailID: that.data.contentId,
            createDate: new Date()
          },
          success(res) {
            console.log(res._id)
            that.setData({
              collected: true,
              fID: res._id
            })
            wx.showToast({
              title: '已收藏',
              'icon': '',
              duration: 2000
            })
          },
          fail: console.error
        })
      } else {
        console.log('remove fav')
        db.collection('myFav').doc(that.data.fID).remove({
          success(res) {
            console.log(res)
            that.setData({
              collected: false
            })
            wx.showToast({
              title: '取消收藏',
              'icon': '',
              duration: 2000
            })
          }
        })
      }

    }
  },

  gotoContact: function () {
    var current = 'cloud://demo-011111.6465-demo/const/qrcode.png'
    wx.previewImage({
      current: current,
      urls: [current]
    })

  },

  runCloudDB: function (name, db, type) {
    var that = this
    wx.cloud.callFunction({
      name: name,
      data: {
        db: db, //collection name
        type: type, //action to take
        condition: {
          detailID: that.data.contentId
        },
        data: {

        }
      },
      success: res => {
        console.log(res.result)
        // console.log(res.result)

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

              db.collection('discover').doc(that.data.contentId).remove({
                success(res) {
                  console.log('discover record deleted')

                  that.runCloudDB('runDB', 'myFav', 'delete')
                  wx.navigateBack()

                },
                fail() {
                  console.log('fail to delete discover record')
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

  checkFav: function () {
    var that = this
    db.collection('myFav').where({
      _openid: app.globalData.openid,
      detailID: that.data.contentId
    }).get({
      success: function (res) {
        console.log(res)
        // console.log(res.data[0]._id)
        if (res.data.length == 0) {
          //no this fav
          that.setData({
            collected: false
          })
        } else {
          //have this fav
          that.setData({
            collected: true,
            fID: res.data[0]._id
          })
        }

      },
      fail() {
        console.log('fail check Fav')
      },
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
      isAdmin: app.globalData.isAdmin
    })


    const db = wx.cloud.database()
    db.collection('discover').where({
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

    if (app.globalData.hasLogin) {
      that.checkFav()
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