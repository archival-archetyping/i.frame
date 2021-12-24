const { db, CONST } = require('../db')
const { updateRoom, updateRoomByAgora } = require('../db/update-room')
const functions = require('firebase-functions')

module.exports = function (req, res) {
  const { room_id, device_id, agora_uid = null } = req.body.data

  _joinRoom({
    room_id,
    device_id,
    agora_uid
  })
    .then(result => {
      res.json({
        is_success: true,
        ...result
      })
    })
    .catch(({ message }) => {
      functions.logger.error(`Error(/api/join-room): ${message}`)
      functions.logger.log('msg', message)
      res.json({
        is_success: false,
        msg: message
      })
    })
}

async function _joinRoom ({ room_id, device_id, agora_uid }) {
  functions.logger.log(`room_id: ${room_id} に device_id: ${device_id} さんが agora_uid: ${agora_uid} として参加します (/api/join-room)`)
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

  if (roomData.member.length >= roomData.limit) {
    throw new Error('ROOM_IS_CLOWDED')
  }

  const nextMember = [].concat(roomData.member, {
    device_id,
    agora_uid
  })
  await roomRef.set({
    member: nextMember,
    is_used: true
  }, { merge: true })

  functions.logger.log(`room_id: ${room_id} の状態が更新されました(/api/join-room)`)

  // await updateRoomByAgora(room_id)
  // await updateRoom(room_id)

  return {
    room_id,
    device_id,
    agora_uid
  }
}
