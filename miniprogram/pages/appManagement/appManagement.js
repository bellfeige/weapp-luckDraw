const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuperAdmin: false,
    targetCollection: ['discover', 'giftList'],
    targetCollectionIndex: 0,
    // targetCollection:'discover',
    imgUrl: [],
    storageFolder: 'discover/',
    title: '',
    description: '',
    isDisabled: true,
    choosePicDisabled: true,
    uploadProgPer: 0,

  },

  getTime: function () {

    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var nowTime = Y + M + D + h + m + s
    // console.log("当前时间：" + nowTime);
    return nowTime

  },

  collectionPicker: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      targetCollectionIndex: e.detail.value,
      storageFolder: 'gifts/'
    })
  },

  addImg: function () {
    var that = this
    let openid = app.globalData.openid || wx.getStorageSync('openid')
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const filePathArray = res.tempFilePaths
        //console.log(filePathArray)
        var cloudPath = new Array()
        for (let i = 0; i < filePathArray.length; i++) {
          const fileName = +Math.random() * 1000
          cloudPath.push(that.data.storageFolder + that.getTime() + fileName + filePathArray[i].match(/\.[^.]+?$/)[0])
          that.setData({
            // flp: filePath,
            flpa: filePathArray,
            clp: cloudPath,
            isDisabled: false
          })

        }
        // console.log(cloudPath)

      }

    })
  },

  clearImg: function () {
    this.setData({
      flpa: [],
      isDisabled: true,
      choosePicDisabled: true
    })
  },

  uploadImg: function () {
    wx.showLoading({
      title: '上传中',
    })
    var that = this
    var clp = [].concat(this.data.clp)
    var flpa = [].concat(this.data.flpa)

    // console.log(clp)
    // console.log(flpa)
    var imgArray = new Array()
    var id = null
    for (let i = 0; i < flpa.length; i++) {
      console.log(i)
      // console.log(clp)
      // console.log(flpa)
      wx.cloud.uploadFile({
        cloudPath: clp[i], //云存储图片名字
        filePath: flpa[i], //临时路径
        success: function (res) {
          console.log('[上传图片] 成功：', res)
          imgArray.push(res.fileID)

          console.log(imgArray)
          that.setData({
            imgUrl: imgArray, //云存储图片路径
          })

          console.log(that.data.imgUrl.length)
          console.log(that.data.flpa.length)

          that.setData({
            uploadProgPer: that.data.imgUrl.length / that.data.flpa.length * 100,

          })
          console.log(that.data.uploadProgPer)

          if (that.data.imgUrl.length == that.data.flpa.length) {
            console.log(that.data.targetCollection[that.data.targetCollectionIndex])
            //把图片存到targetCollection集合表
            db.collection(that.data.targetCollection[that.data.targetCollectionIndex]).add({
              data: {
                imgCloudUrl: imgArray,
                createDate: new Date()
              }

              ,
              success: function (res) {

                console.log(res._id)
                // var id = res._id
                that.setData({
                  idInColl: res._id,
                })
                wx.showToast({
                  title: '图片存储成功',
                  'icon': 'none',
                  duration: 3500
                })
                that.setData({
                  isDisabled: true,
                  choosePicDisabled: false
                })
              },
              fail(err) {
                console.error(err)
                wx.showToast({
                  title: '图片存储失败',
                  'icon': 'none',
                  duration: 3000
                })
              }
            })
          }
        },
        fail: e => {
          console.error('[上传图片] 失败：', e)
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  },

  inputTitle: function (e) {
    // console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },

  bindTextAreaInput: function (e) {
    //console.log(e.detail.value)
    this.setData({
      description: e.detail.value
    })
  },

  submitData: function () {
    if (this.data.idInColl && this.data.title) {
      wx.showLoading({
        title: '发布中...',
      })
      // var dsption = this.data.description
      // console.log(dsption)
      // const id = this.data.idInColl
      // console.log(id)
      var that = this
      if (that.data.targetCollectionIndex == 0) {
        db.collection(that.data.targetCollection[that.data.targetCollectionIndex]).doc(that.data.idInColl).update({
          data: {
            title: that.data.title,
            description: that.data.description,
          },
          success(res) {
            wx.showToast({
              title: '发布成功',
              'icon': 'none',
              duration: 3000
            })
            wx.redirectTo({
              // url: '../discoverDetail/discoverDetail?imgUrl=' + str_imgUrl + '&title=' + that.data.title + '&id=' + that.data.idInColl,
              url: '../discoverDetail/discoverDetail?&id=' + that.data.idInColl,
              success(res) {
                console.log('redirectTo succeed')
                // console.log(JSON.stringify(that.data.imgUrl))
              },
              fail() {
                console.log('redirectTo failed')
              }
            })
          },
          fail() {
            wx.showToast({
              title: '发布失败',
              'icon': 'none',
              duration: 3000
            })
          },
          complete() {
            wx.hideLoading()
          }

        })
      } else if (that.data.targetCollectionIndex == 1) {

        db.collection(that.data.targetCollection[that.data.targetCollectionIndex]).doc(that.data.idInColl).update({
          data: {
            title: that.data.title,
            description: that.data.description,
            createDate: new Date(),
            participators: [],
            drawStatus: false,
            execTime: that.drawExecDate(3,0),
            showDrawTime: that.drawExecDate(3,1),
            avatarUrl: []
          },
          success(res) {
            console.log(res)
            wx.redirectTo({
              url: '../giftDetail/giftDetail?&id=' + that.data.idInColl,
            })
          },
          fail() {
            wx.showToast({
              title: '发布失败',
              'icon': 'none',
              duration: 3000
            })
          },
          complete() {
            wx.hideLoading()
          }
        })
      }


    } else {
      wx.showToast({
        title: '图片未上传完成,或标题未添加',
        'icon': 'none',
        duration: 3000
      })
    }
  },

  drawExecDate: function (addDayCount, type) {
    var dd;
    dd = new Date();
    dd.setDate(dd.getDate() + addDayCount); //获取AddDayCount天后的日期 
    dd.setHours(10)
    dd.setMinutes(0)
    dd.setSeconds(0)


    var year = dd.getFullYear();
    var month = dd.getMonth() + 1; //获取当前月份的日期 
    var day = dd.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };

    var h = dd.getHours();
    if (h < 10) {
      h = '0' + h;
    };
    var m = dd.getMinutes();
    if (m < 10) {
      m = '0' + m;
    };
    var s = dd.getSeconds();
    if (s < 10) {
      s = '0' + s;
    };
    dd

    // var drawDate = year + '-' + month + '-' + day
    const drawDate = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
    if (type === 0) {
      return dd;
    } else if (type === 1) {
      return drawDate
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isSuperAdmin: app.globalData.isSuperAdmin
    })
    console.log('isSuperAdmin = ' + this.data.isSuperAdmin)
  
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

  }
})