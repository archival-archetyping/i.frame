const crypto = require('crypto')
const length = 32

module.exports = () => crypto.randomBytes(length / 2).toString('hex')
