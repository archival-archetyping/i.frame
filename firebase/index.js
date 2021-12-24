const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const _app = express()

/**
 * API Server Settings
 */
_app.use(express.json())
_app.use(cors({
  origin: (origin, callback) => {
    callback(null, process.env.FUNCTIONS_EMULATOR === 'true' || functions.config().site.origin === origin)
  }
}))

_app.post('/enter', require('./api/enter'))
_app.post('/create-room', require('./api/createRoom'))
_app.post('/create-voice-token', require('./api/createVoiceToken'))
_app.post('/join-room', require('./api/joinRoom'))
_app.post('/leave-room', require('./api/leaveRoom'))
_app.post('/toggle-voice', require('./api/toggleVoice'))
_app.post('/post', require('./api/post'))
_app.post('/change-icon', require('./api/changeIcon'))
_app.post('/update-room', require('./api/updateRoom'))
_app.post('/login', require('./api/login'))

module.exports.api = functions.region('asia-northeast1').https.onRequest(_app)
