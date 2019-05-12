const cloud = require('wx-server-sdk')

cloud.init({
  // env: 'demo-011111',
  env: 'produce-zam1a',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {

    const participators = event.participators
    if (participators.length === 0) {
        return 'no participator'
    } else {
        const winnerIndex = Math.floor(Math.random() * participators.length)
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

        try {
            await db.collection("myInfo").add({
                data: {
                    _openid: winnerOpenID,
                    type: 'winner',
                    createDate: new Date(),
                    detailID: event._id
                }

            })
        } catch (e) {
            console.error(e)
        }


        return winnerIndex + ',' + winnerOpenID

    }

}