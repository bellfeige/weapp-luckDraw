//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    contentItems: ['', '', '', ''],
    listItems: ['', '', '', '', '', '', ''],
    listItemsUrl: null,

    requiredData: [],
    title: '',
    description: '',
    dataRequireLimit: 5,
    dataRequireSkip: 0,
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

  dataQuanlity: function () {
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

  gotoDetailPage: function (e) {
    //console.log(e)
    var id = e.currentTarget.dataset.para._id
    // console.log(id)
    wx.navigateTo({
      url: '../giftDetail/giftDetail?&id=' + id,

      success(res) {
        // console.log('navigateTo succeed')
      },
      fail() {
        console.log('navigateTo failed')
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


  },

  onReachBottom: function () {

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

  onShow: function () {
    this.requireData(0, this.data.requiredData.length, false)
    this.dataQuanlity()
    wx.stopPullDownRefresh(); //停止下拉刷新
  },

  onPullDownRefresh: function () {
    var that = this
    that.onShow()
  },

})