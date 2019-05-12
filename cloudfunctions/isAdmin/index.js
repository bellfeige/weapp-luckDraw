// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'demo-011111',
  env: 'produce-zam1a',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  // const wxContext = cloud.getWXContext()
  try {


    var sa = db.collection('isAdmin').get({})
  } catch (e) {
    console.log(e)
  }
  return await sa

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}