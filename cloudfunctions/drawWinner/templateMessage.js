const rp = require('request-promise');
const sendTemplateMsg = async (token, msgid, msgData, openid, formid, page, emphasisKeyword) => {
  await rp({
    json: true,
    method: 'POST',
    url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token,
    body: {
      touser: openid,
      template_id: msgid,
      page: page,
      form_id: formid,
      data: msgData,
      emphasis_keyword: emphasisKeyword,
    }
  }).then(res => {
  }).catch(err => {
    console.error(err)
  })
}
module.exports = {
  sendTemplateMsg: sendTemplateMsg,
}