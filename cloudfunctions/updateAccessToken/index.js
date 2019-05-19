const cloud = require('wx-server-sdk')
const rq = require('request-promise')
const APPID = 'APPID';
const APPSECRET = 'APPSECRET';
const COLLNAME = 'publicField';
const FIELDNAME = 'ACCESS_TOKEN'

cloud.init({
  // env: 'demo-011111',
  env: 'produce-zam1a',
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    let res = await rq({
      method: 'GET',
      uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET,
    });
    // return res
    res = JSON.parse(res)

    let resUpdate = await db.collection(COLLNAME).doc(FIELDNAME).update({
      data: {
        token: res.access_token
      }
    })
  } catch (e) {
    console.error(e)
  }
}