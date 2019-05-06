// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const targetDB = db.collection(event.db)
  try {

    if (event.type == "get") {
      return await targetDB
        .where(event.condition)
        .get()
    }

    if (event.type == "add") {
      return await targetDB.add({
        data: event.data
      })
    }

    if (event.type == "update") {
      return await targetDB.where(event.condition).update({
        data: event.data
      })
    }

    if (event.type == "delete") {
      return await targetDB.where(event.condition).remove()
    }


  } catch (e) {
    console.error(e)
  }

  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}