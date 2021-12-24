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
      functions.logger.error(`Error(/api/change-icon): ${message}`)
      functions.logger.log('msg', message)
      res.json({
        is_success: false,
        msg: message
      })
    })
}

async function _enter ({ device_id, icon_id, key_color_id }) {
  const userRef = db.collection(CONST.TABLE_NAME.USER).doc(device_id)
  const user = await userRef.get()
  if (!user.exists) {
    functions.logger.log(`device_id: ${prev_device_id} さんは存在しません(/api/change-icon)`)
    throw new Error('USER_NOT_FOUND')
  }

  const nextIcon = {}
  if (icon_id) {
    nextIcon.icon_id = icon_id
  }
  if (key_color_id) {
    nextIcon.key_color_id = key_color_id
  }

  functions.logger.log(`device_id: ${device_id} さんの アイコンを変更します ${nextIcon} (/api/change-icon)`)
  await userRef.set(nextIcon, { merge: true })

  return {
    ...nextIcon,
    device_id
  }
}
