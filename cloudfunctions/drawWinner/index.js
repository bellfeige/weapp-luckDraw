const cloud = require('wx-server-sdk')

cloud.init({
  env: 'demo-011111'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  const participators = event.participators
  if (participators.length > 0) {
    const winnerIndex = Math.floor(Math.random() * participators.length) + 1
    const winnerOpenID = participators[winnerIndex]

    try {
      await db.collection("giftList").doc(event._id)
        .update({
          data: {
            drawStatus: true,
            winnerIndex: winnerIndex,
            winnerOpenID: winnerOpenID,
          }
        })
    } catch (e) {
      console.error(e)
    }

    return winnerOpenID
  } else {
    return 'no participator'
  }





}