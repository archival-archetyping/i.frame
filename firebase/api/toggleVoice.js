const { db, CONST } = require('../db')

module.exports = function (req, res) {
  const { device_id, be_mute } = req.body.data

  _toggleVoice({
    device_id,
    be_mute
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

async function _toggleVoice ({ device_id, be_mute }) {
  const is_mute = be_mute

  const userRef = db.collection(CONST.TABLE_NAME.USER).doc(device_id)
  const user = await userRef.get()
  if (!user.exists) {
    throw new Error('USER_NOT_FOUND')
  }
  await userRef.set({
    is_mute
  }, { merge: true })

  return {
    device_id,
    is_mute
  }
}
