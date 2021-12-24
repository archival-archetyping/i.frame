const { db, CONST } = require('../db')
const functions = require('firebase-functions')

module.exports = function (req, res) {
  const { device_id, icon_id, key_color_id } = req.body.data

  _enter({
    device_id,
    icon_id,
    key_color_id
  })
    .then(result => {
      res.json({
        is_success: true,
        ...result
      })
    })
    .catch(({ message }) => {
      functions.logger.error(`Error(/api/enter): ${message}`)
      functions.logger.log('msg', message)
      res.json({
        is_success: false,
        msg: message
      })
    })
}

async function _enter ({ device_id, icon_id, key_color_id }) {
  functions.logger.log(`device_id: ${device_id} さんが会場に入りました (/api/enter)`)

  const userRef = db.collection(CONST.TABLE_NAME.USER).doc(device_id)
  const user = await userRef.get()
  if (user.exists) {
    const prev_device_id = user.data().device_id
    await userRef.set({
      device_id,
      is_mute: true
    }, { merge: true })
    functions.logger.log(`device_id: ${prev_device_id} さんの device_idが ${device_id} に更新されました(/api/enter)`)

    const data = (await userRef.get()).data()
    return {
      device_id,
      is_mute: data.is_mute,
      icon_id: data.icon_id,
      key_color_id: data.key_color_id
    }
  }

  const created_at = Math.floor(Date.now() / 1000)
  await userRef.set({
    device_id,
    icon_id,
    key_color_id,
    registered_id: null,
    is_mute: true,
    created_at
  })
  functions.logger.log(`device_id: ${device_id} さんが icon_id: ${icon_id}, key_color_id: ${key_color_id} で作成されました(/api/enter)`)

  return {
    device_id,
    icon_id,
    key_color_id,
    is_mute: true,
    created_at
  }
}
