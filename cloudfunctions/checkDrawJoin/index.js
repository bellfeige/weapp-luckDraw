// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'demo-011111',
  env: 'produce-zam1a',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {


  try {

  var res = await db.collection(event.db).doc(event._id)
    .get()
  var participatorsOpenID = res.data.participators
    // var participatorsOpenID = res
  return participatorsOpenID.includes(event.openid)
  // return participatorsOpenID


  } catch (e) {
    console.error(e)
  }

  // var participatorsOpenID = res.data[0].participators
  // var join = participatorsOpenID.includes(event.openid)




}