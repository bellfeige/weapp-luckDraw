const cloud = require('wx-server-sdk')

const templateMessage = require('templateMessage.js')

const COLL_FIELD_NAME = 'publicField';
const FIELD_NAME = 'ACCESS_TOKEN'

const MSGID = 'BD4Uceiz8q9oNq59sj660b2BGqoF-uhEbjtxYtyrxkQ';

cloud.init({
    // env: 'demo-011111',
    env: 'produce-zam1a',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

    const participators = event.participators
    if (participators.length === 0) {
        return 'no participator'
    } else {







        // 开奖程序
        const winnerIndex = Math.floor(Math.random() * participators.length)
        const winnerOpenID = participators[winnerIndex]
        // let drawResultMsg = winnerOpenID == openid ? '恭喜你中奖了' : '抱歉，你未中奖'

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


        //add to myWonPrize
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



        // 从数据库中获取AccessToken
        let tokenRes = await db.collection(COLL_FIELD_NAME).doc(FIELD_NAME).get();
        let token = tokenRes.data.token; // access_token



        //获取参与用户信息，获取到用户的 openid 和 formid.
        const res = await db.collection("myInfo").where({
            type: 'draw',
            detailID: event._id
        }).get()

        for (let i = 0; i < res.data.length; i++) {
            let formid = res.data[i].drawFormid
            let openid = res.data[i]._openid

            //set msg info
            let page = 'pages/giftDetail/giftDetail?id=' + event._id;
            let msgData = {
                "keyword1": {
                    "value": event.title
                },
                "keyword2": {
                    "value": '你参与的抽奖活动正在开奖，点击查看中奖名单'
                },

            };
            let emphasisKeyword = ''
            // let emphasisKeyword = 'keyword1.DATA'

            //call sending msg
            await templateMessage.sendTemplateMsg(token, MSGID, msgData, openid, formid, page, emphasisKeyword);

        }
        return res.data.length










    }

}