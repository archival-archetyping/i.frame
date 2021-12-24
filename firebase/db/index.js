const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

module.exports.db = db
module.exports.CONST = require('./CONSTANTS')
