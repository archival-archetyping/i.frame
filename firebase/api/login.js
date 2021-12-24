const { db, CONST } = require('../db')

module.exports = function (req, res) {
  const { device_id, registered_id, registered_secret } = req.body.data

  _login({
    device_id,
    registered_id,
    registered_secret
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

async function _login ({ device_id, registered_id, registered_secret }) {
  const registeredRef = db.collection(CONST.TABLE_NAME.REGISTERED).doc(registered_id)
  const registered = await registeredRef.get()
  const passwordRef = db.collection(CONST.TABLE_NAME.PASSWORD).doc(registered_id)
  const password = await passwordRef.get()

  if (registered.empty || password.empty) throw new Error('LOGIN_FAILURE')

  const passwordData = password.data()
  if (passwordData.password != registered_secret) {
    throw new Error('LOGIN_FAILURE')
  }

  const userRef = db.collection(CONST.TABLE_NAME.USER).doc(device_id)
  const user = await userRef.get()
  if (user.empty) throw new Error('LOGIN_FAILURE')
  await userRef.set({
    registered_id
  }, { merge: true })

  return {
    device_id,
    registered_id
  }
}
