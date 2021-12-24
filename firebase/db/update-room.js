const functions = require('firebase-functions')
const { db, CONST } = require('./index')

const agora = require('../services/agoraProvider')

module.exports.updateRoom = async function (room_id) {
  functions.logger.log(`room_id: ${room_id} をアップデートします`)
  const roomRef = db.collection(CONST.TABLE_NAME.ROOM).doc(room_id)
  const room = await roomRef.get()
  const result = await basicStatusCheck(room)
  if (!result) {
    return false
  }

  await roomRef.delete()
  functions.logger.log(`room_id: ${room_id} は参加者がいないので削除されました`)

  return true
}

module.exports.updateRoomByAgora = async function (room_id) {
  functions.logger.log(`room_id: ${room_id} をアップデートします`)

  const roomRef = db.collection(CONST.TABLE_NAME.ROOM).doc(room_id)
  const room = await roomRef.get()

  const roomData = room.data()
  if (!roomData.is_voice) {
    functions.logger.log(`room_id: ${room_id} はボイスルームではないのでスキップします`)
    return false
  }

  const result = await agora.checkMembersInChannel({ channelName: room_id })

  const nextMember = roomData.member.filter(({ agora_uid }) => result.uid.includes(agora_uid))
  roomRef.set({
    member: nextMember
  }, {
    merge: true
  })
  return true
}

async function basicStatusCheck (room) {
  if (!room.exists) {
    return false
  }

  const roomData = room.data()
  const room_id = roomData.id
  if (!roomData.is_used) {
    functions.logger.log(`room_id: ${room_id} はまだ使用されていないのでスキップします`)
    return false
  }
  if (roomData.type == 'registered') {
    functions.logger.log(`room_id: ${room_id} は type: registered なのでスキップします`)
    return false
  }

  if (roomData.member.length > 0) {
    functions.logger.log(`room_id: ${room_id} はまだ参加者がいるのでスキップします`)
    return false
  }

  return true
}
