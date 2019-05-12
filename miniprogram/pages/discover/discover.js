const app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        db.collection('discover').skip(skip).limit(limit)
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
        db.collection('discover').count({
            success(res) {
                // 记录总数量
                that.setData({
                    totalItem: res.total
                })
                console.log('total data = ' + that.data.totalItem)
            },
        })
    },

    gotoDetailPage: function(e) {
        //console.log(e)
        var id = e.currentTarget.dataset.para._id
            // console.log(id)
        wx.navigateTo({
            url: '../discoverDetail/discoverDetail?&id=' + id,

            success(res) {
                // console.log('navigateTo succeed')
            },
            fail() {
                console.log('navigateTo failed')
            }
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        this.dataQuanlity()
        this.requireData(this.data.dataRequireSkip, this.data.dataRequireLimit, false)

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
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.requireData(0, this.data.requiredData.length, false)
        this.dataQuanlity()
        wx.stopPullDownRefresh(); //停止下拉刷新
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
        var that = this
        that.onShow()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})