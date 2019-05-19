const app = getApp()
const db = wx.cloud.database()
const _ = db.command


Page({

    /**
     * 页面的初始数据
     */
    data: {
        collectionName: '',
        isSuperAdmin: false,
        joined: false,
        buttonDisabled: true,
        iWon: false,
        winnerOpenID: ''
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
        wx.showLoading({
            title: '正在加入抽奖...',
        })

        var that = this;

        console.log(that.data.drawStatus)
        if (that.data.joined) {
            console.log('joined')
        } else if (that.data.drawStatus) {
            console.log('draw finished')
        } else if (!that.data.joined) {
            wx.cloud.callFunction({
                name: 'runDB',
                data: {
                    db: 'giftList',
                    type: 'updateOnPush',
                    _id: that.data.contentId,
                    value: app.globalData.openid,
                    participatorInfo: app.appData.userInfo

                },
                success(res) {
                    console.log(res)
                    that.getDrawInfo()
                    that.setData({
                        joined: true,
                    })
                    that.addJoinToMyinfo()

                },
                fail(err) {
                    console.error(err)
                },
                complete() {
                    wx.hideLoading()
                }
            })


        }


    },

    addJoinToMyinfo: function (e) {
        var that = this
        console.log(e)
        db.collection('myInfo').add({
            data: {
                type: 'draw',
                createDate: new Date(),
                detailID: that.data.contentId,
                drawFormid: e.detail.formId,
            },
            success(res) {
                console.log(res)
            },
            fail(err) {
                console.error(err)
            }
        })

    },

    getDrawInfo: function () {
        var that = this
        wx.showLoading({
            title: '加载中...',
        })
        wx.cloud.callFunction({
            name: 'runDB',
            data: {
                db: 'giftList',
                type: 'getbyID',
                _id: that.data.contentId

            },
            success(res) {
                console.log(res.result)

                that.setData({
                    detail: res.result.data,
                    participatorInfo: res.result.data.participatorInfo,
                    participatorQuantity: res.result.data.participators.length,
                    drawStatus: res.result.data.drawStatus,
                    drawTime: res.result.data.showDrawTime,
                })
                // console.log(res.result.data.winnerOpenID)
                // console.log(app.globalData.openid)
                if (res.result.data.drawStatus) {
                    that.setData({
                        winnerOpenID: res.result.data.winnerOpenID,
                        iWon: res.result.data.winnerOpenID == app.globalData.openid ? true : false,
                    })

                }
                if (app.globalData.hasLogin) {
                    that.checkjoin()
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
                        fileList: that.data.detail.imgCloudUrl,
                        success: res => {
                            console.log(res.fileList)

                            db.collection('giftList').doc(that.data.contentId).remove({
                                success() {
                                    console.log('giftList record deleted')
                                    that.deleteInMyInfo()
                                    // wx.navigateBack()
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

    deleteInMyInfo: function () {
        var that = this
        wx.cloud.callFunction({
            name: 'runDB',
            data: {
                db: 'myInfo', //collection name
                type: 'delete', //action to take
                condition: {
                    detailID: that.data.contentId
                },
                data: {}
            },
            success: res => {
                console.log(res.result)
                // console.log(res.result)
                wx.navigateBack()

            },
            fail: err => {
                console.error(err)
            }
        })
    },

    checkjoin: function () {
        var that = this
        wx.cloud.callFunction({
            name: 'runDB',
            data: {
                db: 'giftList',
                type: 'checkDrawJoin',
                _id: that.data.contentId,
                openid: app.globalData.openid
            },
            success(res) {
                console.log(res.result)

                that.setData({
                    joined: res.result ? true : false,
                    buttonDisabled: false,
                })


            },
            fail(err) {
                console.error(err)
            }

        })

    },

    checkLogin: function () {

        var that = this;
        if (app.appData.userInfo == null) {

            wx.getUserInfo({
                success(res) {
                    app.appData.userInfo = res.userInfo
                    //   const nickName = res.userInfo.nickName
                    //   const avatarUrl = res.userInfo.avatarUrl
                    //   const gender = res.userInfo.gender // 性别 0：未知、1：男、2：女
                    //   const province = res.userInfo.province
                    //   const city = res.userInfo.city
                    //   const country = res.userInfo.country
                    that.joinLuckDraw()
                }
            })

        } else {
            that.joinLuckDraw()
        }

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (o) {

        var that = this
        // console.log(o)
        // console.log(app.globalData.isAdmin)


        that.setData({
            contentId: o.id,
            isSuperAdmin: app.globalData.isSuperAdmin
        })

        that.getDrawInfo()


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