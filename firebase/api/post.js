const { db, CONST } = require('../db')
const functions = require('firebase-functions')

module.exports = function (req, res) {
  const { room_id, device_id, content } = req.body.data

  _post({
    room_id,
    device_id,
    content
  })
    .then(result => {
      res.json({
        is_success: true,
        ...result
      })
    })
    .catch(({ message }) => {
      functions.logger.error(`Error(/api/post): ${message}`)
      functions.logger.log('msg', message)
      res.json({
        is_success: false,
        msg: message
      })
    })
}

async function _post ({ room_id, device_id, content }) {
  functions.logger.log(`room_id: ${room_id} に device_id: ${device_id} さんが content: 「${content}」 を投稿します (/api/post)`)

  const roomRef = db.collection(CONST.TABLE_NAME.ROOM).doc(room_id)
  const room = await roomRef.get()
  if (!room.exists) {
    throw new Error('ROOM_NOT_FOUND')
  }
  const roomData = room.data()
  if (!roomData.is_chat) {
    throw new Error('NOT_CHAT_ROOM')
  }

  const userRef = db.collection(CONST.TABLE_NAME.USER).doc(device_id)
  const user = await userRef.get()
  if (!user.exists) {
    throw new Error('USER_NOT_FOUND')
  }
  const userData = user.data()
  const isRegistered = !!userData.registered_id

  let user_data = {
    is_registered: false
  }
  if (isRegistered) {
    const registeredRef = db.collection(CONST.TABLE_NAME.REGISTERED).doc(userData.registered_id)
    const registered = await registeredRef.get()
    const registeredData = registered.data()

    user_data = Object.assign({}, user_data, {
      is_registered: true,
      name_ja: registeredData.name_ja,
      name_en: registeredData.name_en,
      thumbnail_url: registeredData.thumbnail_url
    })
  }

  user_data = Object.assign({}, user_data, {
    icon_id: userData.icon_id,
    key_color_id: userData.key_color_id
  })

  const datetime = postDatetime()
  const post = {
    datetime,
    device_id,
    content,
    user_data
  }

  const chatRef = db.collection(CONST.TABLE_NAME.CHAT).doc(room_id)
  const chat = await chatRef.get()
  if (!chat.exists) {
    chatRef.set({
      room_id,
      posts: [post]
    })
    functions.logger.log(`room_id: ${room_id} に初めての投稿をしました device_id: ${device_id}, content: ${content}, datetime: ${datetime} (/api/post)`)
    return {
      room_id,
      device_id,
      content,
      datetime,
      user_data
    }
  }

  const chatData = chat.data()
  const nextPosts = [].concat(chatData.posts, post)
  await chatRef.set({
    posts: nextPosts
  }, { merge: true })

  functions.logger.log(`room_id: ${room_id} に投稿が完了しました device_id: ${device_id}, content: ${content}, datetime: ${datetime} (/api/post)`)

  return {
    room_id,
    device_id,
    content,
    datetime,
    user_data
  }
}

function postDatetime () {
  const date = new Date()
  const jstOffset = 9

  const is_over_day = (date.getHours() + jstOffset) > 24
  const hour = is_over_day ? (date.getHours() + jstOffset - 24) : (date.getHours() + jstOffset)
  const hh = ('00' + hour).slice(-2)
  const mm = ('00' + (date.getMinutes())).slice(-2)
  const ss = ('00' + (date.getSeconds())).slice(-2)

  const YYYY = date.getFullYear()
  const MM = ('00' + (date.getMonth() + 1)).slice(-2)
  const day = is_over_day ? date.getDate() + 1 : date.getDate()
  const DD = ('00' + day).slice(-2)

  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}
