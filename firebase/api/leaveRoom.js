const { db, CONST } = require('../db')
const { updateRoom, updateRoomByAgora } = require('../db/update-room')
const functions = require('firebase-functions')

module.exports = function (req, res) {
  const { room_id, device_id } = req.body.data

  _leaveRoom({
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
      functions.logger.error(`Error(/api/leave-room): ${message}`)
      res.json({
        is_success: false,
        msg: message
      })
    })
}

async function _leaveRoom ({ room_id, device_id }) {
  functions.logger.log(`room_id: ${room_id} から ${device_id} さんが退出します (/api/leave-room)`)

  const roomRef = db.collection(CONST.TABLE_NAME.ROOM).doc(room_id)
  const room = await roomRef.get()

  if (!room.exists) {
    functions.logger.error(`room_id: ${room_id} はiamas-openhouse-2021 DBに存在しません`)
    throw new Error('ROOM_NOT_FOUND')
  }

  const roomData = room.data()
  const nextMember = roomData.member
    .filter(member => member.device_id != device_id)

  await roomRef.set({
    member: nextMember
  }, { merge: true })
  functions.logger.log('remove room member', {
    room_id,
    device_id
  })

  await updateRoomByAgora(room_id)
  await updateRoom(room_id)

  return {
    room_id,
    device_id
  }
}
