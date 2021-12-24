const functions = require('firebase-functions')
const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
const axios = require('axios').default

const restCredential = 'Basic ' + Buffer.from(
  `${functions.config().agora.rest.user_id}:${functions.config().agora.rest.user_secret}`
).toString('base64')
const appId = functions.config().agora.app_id
const appCertificate = functions.config().agora.app_certificate
const expirationTime = 86400 // 60[sec] * 60[min] * 12[hour] * 2[day]
const uid = 0
const role = RtcRole.PUBLISHER

const createAccessToken = ({ channelName }) => {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const expiredAt = currentTimestamp + expirationTime

  const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, expiredAt)

  return {
    channelName,
    token
  }
}

const checkMembersInChannel = async ({ channelName }) => {
  const result = await axios.get(`https://api.agora.io/dev/v1/channel/user/${appId}/${channelName}`, {
    headers: {
      Authorization: restCredential
    }
  })

  if (!result.data.success) {
    throw new Error('cannot access to agora')
  }

  functions.logger.log(`agora_api_response.total -> ${JSON.stringify(result.data)}`)

  if (!result.data.data.channel_exist) {
    return {
      members: 0,
      uid: []
    }
  }

  return {
    members: result.data.data.total,
    uid: result.data.data.users
  }
}

module.exports = {
  createAccessToken,
  checkMembersInChannel
}
