const app = getApp()
const db = wx.cloud.database()
const cmd = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requiredData: [],
  },

  requireData: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this

    that.setData({
      requiredData: [],
    })

  
    db.collection('myInfo').where({
      _openid: app.globalData.openid,
      type: 'draw'
    }).get({
      success(res) {
        console.log(res.data.length)

        for (let i = 0; i < res.data.length; i++) {
          var detailID = res.data[i].detailID
          // console.log(detailID)
          db.collection('giftList').doc(detailID).get({
            success(res) {
              // console.log(res.data)
              var collectionData = [].concat(res.data)
              console.log(collectionData)
              that.setData({
                requiredData: that.data.requiredData.concat(collectionData)
              })
              console.log(that.data.requiredData)
            }
          })
        }

    
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  gotoDetailPage: function (e) {
    // console.log(e.currentTarget.dataset.para)
    var id = e.currentTarget.dataset.para._id
    // console.log(id)
    wx.navigateTo({
      url: '../giftDetail/giftDetail?&id=' + id,

      success(res) {
        // console.log('navigateTo succeed')
        // console.log(JSON.stringify(that.data.imgUrl))
      },
      fail() {
        console.log('navigateTo failed')
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.requireData()
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
    this.requireData()
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

  }
})