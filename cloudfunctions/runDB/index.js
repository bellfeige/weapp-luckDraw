// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  const targetDB = db.collection(event.db)
  try {

    if (event.type == "get") {
      return await targetDB
        .where(event.condition)
        .get()
    }

    if (event.type == "getbyID") {
      return await targetDB
        .doc(event._id)
        .get()
    }

    if (event.type == "add") {
      return await targetDB.add({
        data: event.action
      })
    }

    if (event.type == "update") {
      console.log(event.action)
      return await targetDB.where(event.condition).update({
        data: event.action
        // data:{
        //   participators: _.push('1')
        // }

      })
    }

    if (event.type == "delete") {
      return await targetDB.where(event.condition).remove()
    }

    if (event.type == "updateOnPush") {
  
      return await targetDB.doc(event._id)
      // .where(event.condition)
      .update({
        data: {
          participators: _.push(event.value),
          avatarUrl: _.push(event.avatarUrl)
        }
      })
    }

    if(event.type =="checkDrawJoin"){
      var res = await targetDB.doc(event._id).get()
      var participatorsOpenID = res.data.participators
      return participatorsOpenID.includes(event.openid)
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