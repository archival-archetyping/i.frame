const { db, CONST } = require('../db')
const { createAccessToken } = require('../services/agoraProvider')
const { updateRoom, updateRoomByAgora } = require('../db/update-room')
const functions = require('firebase-functions')

module.exports = function (req, res) {
  const { room_id, device_id } = req.body.data

  _createVoiceToken({
    room_id,
    device_id
  })
    .then(result => {
      res.json({
        is_success: true,
        ...result
      })
    })
    .catch(({ message }) => {
      functions.logger.error(`Error(/api/create-voice-token): ${message}`)
      res.json({
        is_success: false,
        msg: message
      })
    })
}

async function _createVoiceToken ({ room_id, device_id }) {
  functions.logger.log(`room_id: ${room_id} のアクセストークンを ${device_id} さんに付与します (/api/create-voice-room)`)

  // try {
  //  await updateRoom(room_id)
  // } catch (e) {
  //  throw new Error(e.message)
  // }

  const roomRef = db.collection(CONST.TABLE_NAME.ROOM).doc(room_id)
  const room = await roomRef.get()
  if (!room.exists) {
    throw new Error('ROOM_NOT_FOUND')
  }
  const roomData = room.data()
  if (!roomData.is_voice) {
    throw new Error('ROOM_IS_NOT_VOICE_CHAT')
  }
  const { token } = await createAccessToken({ channelName: roomData.id })

  await updateRoomByAgora(room_id)
  await updateRoom(room_id)

  return {
    device_id,
    room_id,
    token
  }
}
