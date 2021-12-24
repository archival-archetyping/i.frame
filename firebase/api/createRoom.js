const { db, CONST } = require('../db')

const makeChannelName = require('../services/makeChannelName')

module.exports = function (req, res) {
  const {
    type,
    limit,
    name,
    is_voice = false,
    is_chat = false
  } = req.body.data

  _createRoom({
    type,
    limit,
    name,
    is_voice,
    is_chat
  })
    .then(result => {
      res.json({
        is_success: true,
        ...result
      })
    })
    .catch(({ message }) => {
      res.json({
        is_success: false,
        msg: message
      })
    })
}

async function _createRoom ({ type, limit, name, is_voice, is_chat }) {
  const id = makeChannelName()

  const roomRef = db.collection(CONST.TABLE_NAME.ROOM)
  await roomRef.doc(id).set({
    id,
    limit,
    name,
    type,
    member: [],
    is_used: false,
    is_voice,
    is_chat
  })

  return {
    id,
    limit,
    name,
    type,
    is_voice,
    is_chat
  }
}
