//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    swiperData: [],
    requiredData: [],
    title: '',
    description: '',
    dataRequireLimit: 10,
    dataRequireSkip: 0,
  },

  requireSwiperData: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'runDB',
      data: {
        db: 'discover',
        type: 'get',
        orderByKey: 'createDate',
        descOResc: 'desc',
        limit: 3
      },
      success(res) {
        // console.log(res.result.data)
        that.setData({
          swiperData: res.result.data
        })
      }
    })
  },

  requireData: function(skip, limit, moreData) {
    wx.showLoading({
      title: '加载更多...',
    })
    var that = this
    db.collection('giftList').skip(skip).limit(limit)
      .orderBy('createDate', 'desc')
      .get({
        success(res) {
          if (moreData) {
            var collectionData = [].concat(res.data)
            that.setData({
              requiredData: that.data.requiredData.concat(collectionData)
            })
            console.log(that.data.requiredData)
            console.log(that.data.requiredData.length)
          } else {
            that.setData({
              requiredData: res.data
            })
          }

        },
        fail() {

        },
        complete() {
          wx.hideLoading()
        }
      })

  },

  dataQuanlity: function() {
    var that = this
    db.collection('giftList').count({
      success(res) {
        // 记录总数量
        that.setData({
          totalItem: res.total
        })
        console.log('total data = ' + that.data.totalItem)
      },
    })
  },

  gotoSwiperDetailPage: function(e) {
    // console.log(e)
    var id = e.currentTarget.dataset.para._id
    // console.log(id)
    wx.navigateTo({
      url: '../discoverDetail/discoverDetail?&id=' + id,

      success(res) {
        // console.log('navigateTo succeed')
      },
      fail(err) {
        console.error(err)
      }
    })
  },


  gotoDetailPage: function(e) {
    //console.log(e)
    var id = e.currentTarget.dataset.para._id
    // console.log(id)
    wx.navigateTo({
      url: '../giftDetail/giftDetail?&id=' + id,

      success(res) {
        // console.log('navigateTo succeed')
      },
      fail(err) {
        console.error(err)
      }
    })
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.dataQuanlity()
    this.requireData(this.data.dataRequireSkip, this.data.dataRequireLimit, false)
    this.requireSwiperData()


  },

  onReachBottom: function() {

    var that = this
    console.log(that.data.requiredData.length)
    if (that.data.totalItem > that.data.requiredData.length) {
      that.setData({
        dataRequireSkip: that.data.dataRequireSkip + that.data.dataRequireLimit

      })
      that.requireData(that.data.dataRequireSkip, that.data.dataRequireLimit, true)
    } else {
      wx.showToast({
        title: '已显示所有内容..',
        'icon': 'none',
        duration: 2000
      })
    }
  },

  onShow: function() {
    this.requireData(0, this.data.requiredData.length, false)
    this.dataQuanlity()
    this.requireSwiperData()
    wx.stopPullDownRefresh(); //停止下拉刷新
  },

  onPullDownRefresh: function() {
    var that = this
    that.onShow()
  },

})