require('dotenv').config({ path: './.env' })
const { execSync } = require('child_process')

console.log('[start] setup firebase config')

execSync(`npx firebase functions:config:unset \
  agora.app_id \
  agora.app_certificate \
  agora.rest.user_id \
  agora.rest.user_secret \
  site.origin
`)
execSync(`npx firebase functions:config:set \
  agora.app_id=${process.env.AGORA_APP_ID} \
  agora.app_certificate=${process.env.AGORA_APP_CERT} \
  agora.rest.user_id=${process.env.AGORA_REST_USER_NAME} \
  agora.rest.user_secret=${process.env.AGORA_REST_USER_SECRET} \
  site.origin=${process.env.SITE_ORIGIN}
`)

console.log('[done]  setup firebase config')
